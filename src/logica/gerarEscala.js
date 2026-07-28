import { TIPOS_ESCALA } from "../constantes";
import { diasDoMes } from "../utils";

/**
 * Escolhe quais domingos do mes serao de folga para um funcionario.
 *
 * A ideia e espalhar as folgas ao longo do mes em vez de agrupa-las: divide-se o
 * total de domingos pela quantidade de folgas exigidas, obtendo o "passo" entre
 * uma folga e a seguinte (ex.: 4 domingos com minimo 2 -> passo 2, resultando no
 * padrao folga/trabalha/folga/trabalha, sem domingos consecutivos).
 *
 * O deslocamento (offset) vem da posicao do funcionario dentro do grupo do mesmo
 * sexo: assim o primeiro folga no 1o e 3o domingos, o segundo no 2o e 4o, e assim
 * por diante — escalonando quem folga em qual domingo e mantendo a loja coberta.
 *
 * Quando o minimo exigido se aproxima do total de domingos (ex.: 3 folgas em 4
 * domingos) o espacamento perfeito deixa de existir e as folgas ficam o mais
 * distantes que a aritmetica do mes permite.
 */
export function domingosDeFolga(totalDomingos, minimo, posicaoNoGrupo) {
  if (totalDomingos === 0 || minimo <= 0) return new Set();

  const quantidade = Math.min(minimo, totalDomingos);
  const passo = totalDomingos / quantidade;
  const deslocamento = posicaoNoGrupo % Math.max(1, Math.round(passo));

  const indices = new Set();
  for (let k = 0; k < quantidade; k += 1) {
    let indice = (deslocamento + Math.round(k * passo)) % totalDomingos;
    // Em meses "apertados" o arredondamento pode repetir um indice; empurra para o proximo livre.
    while (indices.has(indice)) indice = (indice + 1) % totalDomingos;
    indices.add(indice);
  }
  return indices;
}

/**
 * Monta a escala completa do mes.
 * Retorna { dias, mapa } onde mapa[idFuncionario][numeroDoDia] = status.
 */
export function gerarEscala({
  funcionarios,
  tipoEscala,
  mes,
  ano,
  modoFolgas,
  folgasFixas,
  minDomingosHomens,
  minDomingosMulheres,
  feriados,
}) {
  const dias = diasDoMes(mes, ano);
  const domingos = dias.filter((dia) => dia.diaSemana === 0);
  const diasFeriado = new Set(feriados.map((feriado) => Number(feriado.dia)));
  const ciclo = (TIPOS_ESCALA.find((t) => t.id === tipoEscala) || TIPOS_ESCALA[0]).ciclo;

  // Posicao de cada funcionario dentro do grupo do proprio sexo (base do offset dos domingos).
  const contadorPorSexo = {};
  const posicaoNoGrupo = {};
  funcionarios.forEach((funcionario) => {
    const atual = contadorPorSexo[funcionario.sexo] || 0;
    posicaoNoGrupo[funcionario.id] = atual;
    contadorPorSexo[funcionario.sexo] = atual + 1;
  });

  const mapa = {};

  funcionarios.forEach((funcionario, indice) => {
    const minimoDomingos =
      funcionario.sexo === "Feminino" ? Number(minDomingosMulheres) : Number(minDomingosHomens);
    const folgasDominicais = domingosDeFolga(
      domingos.length,
      minimoDomingos,
      posicaoNoGrupo[funcionario.id]
    );
    // Numeros dos dias do mes em que este funcionario folga aos domingos.
    const diasDomingoFolga = new Set(
      [...folgasDominicais].map((indiceDomingo) => domingos[indiceDomingo].numero)
    );

    const linha = {};
    // Conta apenas os dias regidos pelo ciclo: assim os domingos ja resolvidos acima
    // nao "consomem" a folga semanal de quem tem domingo obrigatorio de trabalho.
    let passosDoCiclo = 0;

    dias.forEach((dia) => {
      let status;

      if (dia.diaSemana === 0 && minimoDomingos > 0) {
        // Domingos com minimo configurado seguem a distribuicao equilibrada acima.
        status = diasDomingoFolga.has(dia.numero) ? "F" : "T";
      } else if (modoFolgas === "fixas") {
        const diaFixo = Number(folgasFixas[funcionario.id]);
        status = dia.diaSemana === diaFixo ? "F" : "T";
      } else {
        // Rotativas: o ciclo caminha pelos demais dias e e deslocado pelo indice do
        // funcionario, de modo que a equipe nao folgue toda no mesmo dia.
        status = ciclo[(indice + passosDoCiclo) % ciclo.length];
        passosDoCiclo += 1;
      }

      if (status === "T" && diasFeriado.has(dia.numero)) status = "FE";

      linha[dia.numero] = status;
    });

    mapa[funcionario.id] = linha;
  });

  return { dias, mapa };
}
