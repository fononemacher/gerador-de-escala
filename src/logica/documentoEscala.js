import { ABREV_DIAS, MESES, STATUS, STATUS_TRABALHANDO } from "../constantes";

// Quantas linhas cabem em uma pagina A4 retrato sem estourar para a seguinte.
// A tabela da semana tem cabecalho maior (dia + abreviacao), por isso cabe menos.
const FUNCIONARIOS_POR_PAGINA = 20;
const LINHAS_TOTAIS_POR_PAGINA = 26;

const escapar = (texto) =>
  String(texto ?? "").replace(
    /[&<>"]/g,
    (caractere) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[caractere]
  );

const doisDigitos = (valor) => String(valor).padStart(2, "0");

const dataCurta = (numeroDoDia, mes) => `${doisDigitos(numeroDoDia)}/${doisDigitos(mes + 1)}`;

/**
 * Quebra os dias do mes em semanas de domingo a sabado, que e como a escala e
 * afixada na loja. Cada semana sai com os 7 dias da semana sempre nas mesmas
 * posicoes: as bordas do mes viram slots vazios, para que todas as paginas
 * fiquem alinhadas quando forem empilhadas.
 */
export function agruparEmSemanas(dias) {
  const semanas = [];
  dias.forEach((dia) => {
    const ultima = semanas[semanas.length - 1];
    if (!ultima || dia.diaSemana === 0) semanas.push([dia]);
    else ultima.push(dia);
  });

  return semanas.map((diasDaSemana, indice) => ({
    numero: indice + 1,
    dias: diasDaSemana,
    // Sete posicoes fixas (0 = domingo). null = dia de outro mes.
    slots: ABREV_DIAS.map(
      (_, diaSemana) => diasDaSemana.find((dia) => dia.diaSemana === diaSemana) || null
    ),
  }));
}

/** Fatia uma lista em blocos do tamanho pedido (uma pagina por bloco). */
function dividirEmPaginas(lista, tamanho) {
  const paginas = [];
  for (let inicio = 0; inicio < lista.length; inicio += tamanho) {
    paginas.push(lista.slice(inicio, inicio + tamanho));
  }
  return paginas.length > 0 ? paginas : [[]];
}

/** Totais do mes por funcionario, na mesma leitura que a tela faz das celulas. */
export function totaisPorFuncionario({ dias, mapa, funcionarios }) {
  return funcionarios.map((funcionario) => {
    let trabalhados = 0;
    let folgas = 0;
    let feriados = 0;
    let folgasEmDomingo = 0;
    let sequencia = 0;
    let maiorSequencia = 0;

    dias.forEach((dia) => {
      const status = mapa[funcionario.id]?.[dia.numero] || "T";
      if (STATUS_TRABALHANDO.includes(status)) {
        trabalhados += 1;
        sequencia += 1;
        maiorSequencia = Math.max(maiorSequencia, sequencia);
      } else {
        folgas += 1;
        sequencia = 0;
        if (dia.diaSemana === 0) folgasEmDomingo += 1;
      }
      if (status === "FE") feriados += 1;
    });

    return { funcionario, trabalhados, folgas, feriados, folgasEmDomingo, maiorSequencia };
  });
}

const ESTILOS = `
  @page { size: A4 portrait; margin: 11mm 9mm; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    color: #1A2138;
    font-size: 10px;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .pagina { page-break-after: always; break-after: page; }
  .pagina:last-child { page-break-after: auto; break-after: auto; }

  .topo {
    display: flex; align-items: baseline; justify-content: space-between;
    gap: 12px; padding-bottom: 6px; border-bottom: 2px solid #101C3D;
  }
  .topo h1 { margin: 0; font-size: 14px; font-weight: 700; letter-spacing: -0.2px; }
  .topo .modelo { font-size: 9.5px; font-weight: 600; color: #4B5468; white-space: nowrap; }

  .faixa {
    display: flex; align-items: baseline; justify-content: space-between; gap: 12px;
    margin: 8px 0 6px; font-size: 11px; font-weight: 700; color: #101C3D;
  }
  .faixa .pagina-de { font-size: 9px; font-weight: 600; color: #8B93A7; }

  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  th, td { border: 1px solid #E7EAF1; }

  thead th { background: #101C3D; color: #FFFFFF; font-size: 9px; font-weight: 600; padding: 4px 3px; }
  thead th.dia { text-align: center; }
  thead th.dia .numero { display: block; font-size: 11px; font-weight: 700; }
  thead th.dia .abrev { display: block; font-size: 8px; font-weight: 600; opacity: 0.85; }
  thead th.domingo { background: #9F1239; }
  thead th.nome { text-align: left; padding-left: 7px; }
  thead th.fora { background: #E9EBF1; color: #A9B0C0; }
  tbody td.fora { background: #F4F5F8; }

  tbody th {
    text-align: left; padding: 3px 7px; font-weight: 600; font-size: 9.5px;
    background: #FFFFFF; overflow: hidden;
  }
  tbody tr:nth-child(even) th { background: #FBFBFD; }
  tbody th .setor {
    display: block; font-size: 7.5px; font-weight: 500; color: #8B93A7;
    text-transform: lowercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  tbody td { text-align: center; font-size: 9.5px; font-weight: 700; padding: 4px 2px; }

  .legenda { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 7px; font-size: 8.5px; }
  .legenda span { display: inline-flex; align-items: center; gap: 4px; color: #4B5468; }
  .legenda i { width: 13px; height: 11px; border-radius: 3px; border: 1px solid #E7EAF1; display: inline-block; }

  .rodape-pagina { margin-top: 6px; font-size: 8px; color: #8B93A7; }

  h3 { margin: 12px 0 5px; font-size: 10.5px; font-weight: 700; color: #101C3D; }
  h3:first-of-type { margin-top: 10px; }

  .cartoes { display: flex; gap: 7px; }
  .cartao {
    flex: 1; border: 1px solid #E7EAF1; border-radius: 7px; padding: 7px 8px; background: #FBFBFD;
  }
  .cartao .valor { display: block; font-size: 14px; font-weight: 700; color: #101C3D; }
  .cartao .rotulo { display: block; margin-top: 1px; font-size: 8px; color: #8B93A7; font-weight: 600; }

  .domingos { display: flex; flex-wrap: wrap; gap: 6px; }
  .domingos div {
    border: 1px solid #E7EAF1; border-radius: 7px; padding: 6px 10px; text-align: center; min-width: 62px;
  }
  .domingos .contagem { display: block; font-size: 12px; font-weight: 700; }
  .domingos .dia { display: block; font-size: 7.5px; font-weight: 600; color: #8B93A7; letter-spacing: 0.3px; }
  .domingos .completa .contagem { color: #047857; }
  .domingos .falha .contagem { color: #C2410C; }

  .avisos { border: 1px solid #FECACA; background: #FEF2F2; border-radius: 7px; padding: 7px 9px; }
  .avisos.ambar { border-color: #FDE68A; background: #FFFBEB; }
  .avisos p { margin: 0 0 2px; font-size: 8.5px; color: #7F1D1D; line-height: 1.5; }
  .avisos.ambar p { color: #92400E; }
  .avisos p:last-child { margin-bottom: 0; }

  table.totais thead th { text-align: center; }
  table.totais thead th.esq { text-align: left; padding-left: 7px; }
  table.totais td { text-align: center; font-weight: 600; }
  table.totais td.esq { text-align: left; padding-left: 7px; font-weight: 500; color: #4B5468; }
`;

function cabecalhoDaPagina(titulo, modelo) {
  return `<header class="topo"><h1>${escapar(titulo)}</h1><span class="modelo">${escapar(
    modelo
  )}</span></header>`;
}

function legenda() {
  const itens = Object.values(STATUS)
    .map(
      (visual) =>
        `<span><i style="background:${visual.fundo};border-color:${visual.texto}33"></i>${escapar(
          `${visual.sigla} — ${visual.rotulo}`
        )}</span>`
    )
    .join("");
  return `<div class="legenda">${itens}</div>`;
}

function linhaDeFuncionario(funcionario, slots, mapa) {
  const celulas = slots
    .map((dia) => {
      if (!dia) return '<td class="fora"></td>';
      const status = mapa[funcionario.id]?.[dia.numero] || "T";
      const visual = STATUS[status] || STATUS.T;
      return `<td style="background:${visual.fundo};color:${visual.texto}">${visual.sigla}</td>`;
    })
    .join("");

  return `<tr><th>${escapar(funcionario.nome)}<span class="setor">${escapar(
    funcionario.funcao
  )}</span></th>${celulas}</tr>`;
}

function paginaDaSemana({ semana, funcionariosDaPagina, mapa, mes, titulo, modelo, paginaDe, feriados }) {
  const primeiro = semana.dias[0];
  const ultimo = semana.dias[semana.dias.length - 1];
  const diasFeriado = new Map(feriados.map((feriado) => [Number(feriado.dia), feriado.nome]));

  const colunas = semana.slots
    .map((dia, diaSemana) => {
      const abrev = `<span class="abrev">${ABREV_DIAS[diaSemana]}</span>`;
      // Dias de outro mes mantem a coluna no lugar, mas sem numero e sem cor.
      if (!dia) return `<th class="dia fora"><span class="numero">–</span>${abrev}</th>`;
      return `<th class="dia${diaSemana === 0 ? " domingo" : ""}"><span class="numero">${
        dia.numero
      }${diasFeriado.has(dia.numero) ? "*" : ""}</span>${abrev}</th>`;
    })
    .join("");

  const linhas = funcionariosDaPagina
    .map((funcionario) => linhaDeFuncionario(funcionario, semana.slots, mapa))
    .join("");

  const feriadosDaSemana = semana.dias
    .filter((dia) => diasFeriado.has(dia.numero))
    .map((dia) => `${doisDigitos(dia.numero)} — ${diasFeriado.get(dia.numero)}`);

  return `
    <section class="pagina">
      ${cabecalhoDaPagina(titulo, modelo)}
      <h2 class="faixa">
        <span>Semana ${semana.numero} — ${dataCurta(primeiro.numero, mes)} a ${dataCurta(
    ultimo.numero,
    mes
  )}</span>
        ${paginaDe ? `<span class="pagina-de">${escapar(paginaDe)}</span>` : ""}
      </h2>
      <table>
        <thead><tr><th class="nome" style="width:31%">Funcionário</th>${colunas}</tr></thead>
        <tbody>${linhas}</tbody>
      </table>
      ${legenda()}
      ${
        feriadosDaSemana.length > 0
          ? `<p class="rodape-pagina">* Feriado: ${escapar(feriadosDaSemana.join("  ·  "))}</p>`
          : ""
      }
    </section>`;
}

function paginasDeResumo({
  titulo,
  modelo,
  dias,
  mapa,
  equipe,
  funcionariosDaTabela,
  domingos,
  alertas,
  violacoesDeJornada,
  problemasDeViabilidade,
  limiteDiasSeguidos,
}) {
  const totais = totaisPorFuncionario({ dias, mapa, funcionarios: funcionariosDaTabela });
  const blocos = dividirEmPaginas(totais, LINHAS_TOTAIS_POR_PAGINA);

  const cartoes = `
    <div class="cartoes">
      <div class="cartao"><span class="valor">${equipe.length}</span><span class="rotulo">FUNCIONÁRIOS NA ESCALA</span></div>
      <div class="cartao"><span class="valor">${dias.length}</span><span class="rotulo">DIAS NO MÊS</span></div>
      <div class="cartao"><span class="valor">${escapar(modelo.split(" · ")[0])}</span><span class="rotulo">MODELO DA ESCALA</span></div>
      <div class="cartao"><span class="valor">${domingos.length}</span><span class="rotulo">DOMINGOS NO MÊS</span></div>
    </div>`;

  const cobertura = `
    <div class="domingos">
      ${domingos
        .map(
          (domingo) =>
            `<div class="${domingo.completa ? "completa" : "falha"}"><span class="contagem">${
              domingo.trabalhando
            }/${domingo.total}</span><span class="dia">DIA ${doisDigitos(domingo.dia)}</span></div>`
        )
        .join("")}
    </div>`;

  const secaoAvisos = [];

  if (problemasDeViabilidade.length > 0) {
    secaoAvisos.push(
      `<h3>Configuração impossível de cumprir</h3><div class="avisos ambar">${problemasDeViabilidade
        .map((problema) => `<p><b>${escapar(problema.alvo)}</b>: ${escapar(problema.mensagem)}</p>`)
        .join("")}</div>`
    );
  }

  if (violacoesDeJornada.length > 0) {
    secaoAvisos.push(
      `<h3>Acima do limite de ${limiteDiasSeguidos} dias seguidos</h3><div class="avisos">${violacoesDeJornada
        .map(
          (violacao) =>
            `<p><b>${escapar(violacao.nome)}</b>: ${violacao.seguidos} dias seguidos — do dia ${doisDigitos(
              violacao.inicio
            )} ao dia ${doisDigitos(violacao.fim)}</p>`
        )
        .join("")}</div>`
    );
  }

  if (alertas.length > 0) {
    secaoAvisos.push(
      `<h3>Dias abaixo da cobertura mínima</h3><div class="avisos">${alertas
        .map(
          (alerta) =>
            `<p>Dia ${doisDigitos(alerta.dia)} (${escapar(alerta.abrev)}) — ${escapar(
              alerta.alvo
            )}: ${alerta.quantidade} de ${alerta.minimo}</p>`
        )
        .join("")}</div>`
    );
  }

  return blocos
    .map((bloco, indice) => {
      const primeira = indice === 0;
      const linhas = bloco
        .map(
          (total) => `<tr>
            <th>${escapar(total.funcionario.nome)}</th>
            <td class="esq">${escapar(total.funcionario.funcao)}</td>
            <td>${total.trabalhados}</td>
            <td>${total.folgas}</td>
            <td>${total.feriados}</td>
            <td>${total.folgasEmDomingo}</td>
            <td>${total.maiorSequencia}</td>
          </tr>`
        )
        .join("");

      return `
        <section class="pagina">
          ${cabecalhoDaPagina(titulo, modelo)}
          <h2 class="faixa">
            <span>Resumo da Escala</span>
            ${blocos.length > 1 ? `<span class="pagina-de">Página ${indice + 1} de ${blocos.length}</span>` : ""}
          </h2>
          ${primeira ? cartoes : ""}
          <h3>Totais por funcionário</h3>
          <table class="totais">
            <thead><tr>
              <th class="esq" style="width:29%">Funcionário</th>
              <th class="esq" style="width:23%">Setor</th>
              <th>Trabalhados</th><th>Folgas</th><th>Feriados</th><th>Folgas dom.</th><th>Maior seq.</th>
            </tr></thead>
            <tbody>${linhas}</tbody>
          </table>
          ${primeira && domingos.length > 0 ? `<h3>Cobertura dominical</h3>${cobertura}` : ""}
          ${primeira ? secaoAvisos.join("") : ""}
        </section>`;
    })
    .join("");
}

/**
 * Monta o documento inteiro: uma semana por pagina (quebrada em varias paginas
 * quando a equipe nao cabe em uma so) e, ao final, as paginas de resumo.
 */
export function montarDocumento({
  escala,
  equipe,
  funcionariosDaTabela,
  modeloRotulo,
  modoFolgas,
  feriados,
  filtroSetor,
  domingos,
  alertas,
  violacoesDeJornada,
  problemasDeViabilidade,
  limiteDiasSeguidos,
}) {
  const { dias, mapa, mes, ano } = escala;
  const titulo = `Escala de Trabalho — ${MESES[mes]} ${ano}`;
  const modelo = [
    modeloRotulo,
    modoFolgas === "fixas" ? "Folgas fixas na semana" : "Folgas rotativas",
    filtroSetor && filtroSetor !== "todos" ? `Setor: ${filtroSetor}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const semanas = agruparEmSemanas(dias);

  const paginasDeSemana = semanas
    .map((semana) => {
      const blocos = dividirEmPaginas(funcionariosDaTabela, FUNCIONARIOS_POR_PAGINA);
      return blocos
        .map((funcionariosDaPagina, indice) =>
          paginaDaSemana({
            semana,
            funcionariosDaPagina,
            mapa,
            mes,
            titulo,
            modelo,
            feriados,
            paginaDe: blocos.length > 1 ? `Página ${indice + 1} de ${blocos.length}` : "",
          })
        )
        .join("");
    })
    .join("");

  const resumo = paginasDeResumo({
    titulo,
    modelo,
    dias,
    mapa,
    equipe,
    funcionariosDaTabela,
    domingos,
    alertas,
    violacoesDeJornada,
    problemasDeViabilidade,
    limiteDiasSeguidos,
  });

  return `<!doctype html>
<html lang="pt-BR">
<head><meta charset="utf-8"><title>${escapar(titulo)}</title><style>${ESTILOS}</style></head>
<body>${paginasDeSemana}${resumo}</body>
</html>`;
}

/**
 * Abre a caixa de impressao do navegador com o documento pronto — e de la que
 * sai o PDF ("Salvar como PDF"). Usa um iframe oculto em vez de window.open
 * para nao esbarrar em bloqueador de pop-up.
 */
export function imprimirDocumento(html) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";

  iframe.onload = () => {
    const janela = iframe.contentWindow;
    janela.focus();
    janela.print();
    // O print() e sincrono na maioria dos navegadores, mas o Safari retorna
    // antes de o usuario fechar a caixa — por isso a remocao fica atrasada.
    window.setTimeout(() => iframe.remove(), 1000);
  };

  iframe.srcdoc = html;
  document.body.appendChild(iframe);
}
