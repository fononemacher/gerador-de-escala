import { TIPOS_ESCALA } from "../constantes";
import { maxDiasSeguidos } from "./gerarEscala";
import { diasDoMes, minimoDoSetor, setoresDaEquipe } from "../utils";

/**
 * Diagnostico de viabilidade: verifica se a configuracao pode ser atendida ANTES
 * de olhar a escala gerada. Serve para distinguir "o gerador encaixou mal" de
 * "nao existe encaixe possivel com essa equipe, escala e minimos".
 *
 * Todos os calculos usam o MELHOR cenario possivel (limite superior de capacidade).
 * Se nem no melhor cenario a exigencia cabe, o problema e da configuracao — nunca
 * um falso positivo.
 */

function minimoDominical(config, sexo) {
  return Number(sexo === "Feminino" ? config.minDomingosMulheres : config.minDomingosHomens) || 0;
}

/** Limite superior de dias que um funcionario consegue trabalhar no mes. */
function diasTrabalhaveis(funcionario, { dias, totalDias, totalDomingos, ciclo, config }) {
  const folgasDominicais = Math.min(minimoDominical(config, funcionario.sexo), totalDomingos);

  // Teto de dias seguidos: obriga pelo menos uma folga a cada (limite + 1) dias,
  // valendo para os dois modos de folga.
  const limite = maxDiasSeguidos(ciclo);
  const tetoPorSequencia = totalDias - Math.floor(totalDias / (limite + 1));

  if (config.modoFolgas === "fixas") {
    const diaFixo = Number(config.folgasFixas[funcionario.id]);
    // Folga fixa cai de segunda a sabado, entao nunca coincide com a folga de domingo.
    const ocorrenciasDoDiaFixo = Number.isNaN(diaFixo)
      ? 0
      : dias.filter((dia) => dia.diaSemana === diaFixo).length;
    return Math.min(tetoPorSequencia, totalDias - ocorrenciasDoDiaFixo - folgasDominicais);
  }

  const folgasNoCiclo = ciclo.filter((posicao) => posicao === "F").length;

  // Com minimo dominical configurado, o ciclo passa a reger apenas os demais dias.
  if (folgasDominicais > 0) {
    const diasForaDomingo = totalDias - totalDomingos;
    return Math.min(
      tetoPorSequencia,
      totalDias - folgasDominicais - Math.floor((diasForaDomingo * folgasNoCiclo) / ciclo.length)
    );
  }

  return Math.min(
    tetoPorSequencia,
    totalDias - Math.floor((totalDias * folgasNoCiclo) / ciclo.length)
  );
}

/**
 * Analisa um grupo (um setor ou a equipe inteira) contra os minimos exigidos dele.
 * Devolve a lista de problemas encontrados.
 */
function analisarGrupo({ alvo, membros, minimoNoDia, dias, ciclo, config }) {
  const problemas = [];
  const total = membros.length;
  if (total === 0) return problemas;

  const domingos = dias.filter((dia) => dia.diaSemana === 0);
  const contexto = {
    dias,
    totalDias: dias.length,
    totalDomingos: domingos.length,
    ciclo,
    config,
  };

  // 1) Estrutural: exigir mais gente do que existe no grupo nunca tem solucao.
  const diasSemanaComFalta = [...new Set(dias.map((dia) => dia.diaSemana))].filter(
    (diaSemana) => minimoNoDia(diaSemana) > total
  );
  if (diasSemanaComFalta.length > 0) {
    const maiorMinimo = Math.max(...diasSemanaComFalta.map((diaSemana) => minimoNoDia(diaSemana)));
    problemas.push({
      alvo,
      tipo: "equipe",
      mensagem: `o mínimo chega a ${maiorMinimo} funcionário(s), mas só há ${total} cadastrado(s).`,
      sugestao: `Reduza o mínimo para no máximo ${total} ou cadastre mais funcionários.`,
    });
  }

  // Faltar gente e a causa raiz: os outros dois diagnosticos seriam so consequencia
  // dela. Resolvido isso, o que sobrar aparece na proxima renderizacao.
  if (problemas.length > 0) return problemas;

  // 2) Domingos: as folgas dominicais obrigatorias derrubam a cobertura do domingo.
  const minimoDomingo = minimoNoDia(0);
  if (domingos.length > 0 && minimoDomingo > 0) {
    const folgasDominicaisDoGrupo = membros.reduce(
      (soma, membro) => soma + Math.min(minimoDominical(config, membro.sexo), domingos.length),
      0
    );
    // Distribuidas da forma mais equilibrada possivel entre os domingos do mes.
    const folgasPorDomingo = Math.floor(folgasDominicaisDoGrupo / domingos.length);
    const capacidade = total - folgasPorDomingo;
    if (minimoDomingo > capacidade) {
      problemas.push({
        alvo,
        tipo: "domingo",
        mensagem: `os domingos exigem ${minimoDomingo} trabalhando, mas com os domingos de folga configurados no máximo ${capacidade} pode(m) trabalhar.`,
        sugestao: `Reduza o mínimo dos domingos para ${Math.max(0, capacidade)} ou exija menos domingos de folga.`,
      });
    }
  }

  // 3) Capacidade do mes: soma dos minimos de todos os dias contra os dias-pessoa
  //    disponiveis. E o que pega o caso classico de "cabe em cada dia isolado,
  //    mas nao cabe no mes inteiro" — folga semanal e um custo inescapavel.
  const exigido = dias.reduce((soma, dia) => soma + minimoNoDia(dia.diaSemana), 0);
  const disponivel = membros.reduce(
    (soma, membro) => soma + diasTrabalhaveis(membro, contexto),
    0
  );

  if (exigido > disponivel && exigido > 0) {
    const mediaPorPessoa = disponivel / total;
    const necessarios = Math.ceil(exigido / mediaPorPessoa);
    problemas.push({
      alvo,
      tipo: "capacidade",
      mensagem: `os mínimos do mês somam ${exigido} dias-pessoa de trabalho, mas ${total} funcionário(s) nessa escala oferecem no máximo ${disponivel}.`,
      sugestao: `Seriam necessários ${necessarios} funcionário(s) no grupo, ou reduza os mínimos (média sustentável: ${Math.floor(
        disponivel / dias.length
      )} por dia).`,
    });
  }

  return problemas;
}

export function analisarViabilidade({ funcionarios, config }) {
  if (funcionarios.length === 0) return [];

  const dias = diasDoMes(config.mes, config.ano);
  const ciclo = (TIPOS_ESCALA.find((tipo) => tipo.id === config.tipoEscala) || TIPOS_ESCALA[0]).ciclo;

  const problemas = [];

  setoresDaEquipe(funcionarios).forEach((setor) => {
    problemas.push(
      ...analisarGrupo({
        alvo: setor,
        membros: funcionarios.filter((funcionario) => funcionario.funcao === setor),
        minimoNoDia: (diaSemana) => minimoDoSetor(config.minimosSetor[setor], diaSemana),
        dias,
        ciclo,
        config,
      })
    );
  });

  problemas.push(
    ...analisarGrupo({
      alvo: "Equipe total",
      membros: funcionarios,
      minimoNoDia: (diaSemana) => Number(config.minimoGeral[diaSemana]) || 0,
      dias,
      ciclo,
      config,
    })
  );

  return problemas;
}
