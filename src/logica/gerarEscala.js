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
 * Maior sequencia de trabalho que o ciclo escolhido admite — 5 no 5x2, 6 no 6x1,
 * 1 no 12x36. O ciclo e duplicado para contar tambem a sequencia que atravessa a
 * virada (fim de um ciclo emendado no inicio do seguinte).
 */
export function maxDiasSeguidos(ciclo) {
  let atual = 0;
  let maior = 0;
  [...ciclo, ...ciclo].forEach((posicao) => {
    atual = posicao === "T" ? atual + 1 : 0;
    maior = Math.max(maior, atual);
  });
  return Math.min(maior, ciclo.length);
}

/**
 * Garante o teto de dias consecutivos de trabalho, inserindo folgas onde a
 * sequencia estoura. Necessario porque dois casos furam o ciclo:
 *   - um domingo de trabalho obrigatorio entra no meio da sequencia, ja que o
 *     ciclo so avanca nos demais dias;
 *   - o modo "fixas" so folga no dia escolhido, o que daria 6 dias seguidos
 *     mesmo em escalas de 5 dias.
 * Altera `linha` no lugar.
 */
function limitarDiasSeguidos(linha, dias, limite, domingoTemRegraPropria) {
  let seguidos = 0;

  for (let i = 0; i < dias.length; i += 1) {
    const dia = dias[i];

    if (linha[dia.numero] === "F") {
      seguidos = 0;
      continue;
    }

    seguidos += 1;
    if (seguidos <= limite) continue;

    // Se quem estourou foi um domingo com folga ja distribuida pela regra dos
    // domingos, a folga recua um dia para nao desfazer aquela distribuicao.
    if (domingoTemRegraPropria && dia.diaSemana === 0 && i > 0) {
      linha[dias[i - 1].numero] = "F";
      seguidos = 1;
    } else {
      linha[dia.numero] = "F";
      seguidos = 0;
    }
  }
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
  const limiteDeSequencia = maxDiasSeguidos(ciclo);

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

    dias.forEach((dia) => {
      let status;

      if (dia.diaSemana === 0 && minimoDomingos > 0) {
        // Domingos com minimo configurado seguem a distribuicao equilibrada acima.
        status = diasDomingoFolga.has(dia.numero) ? "F" : "T";
      } else if (modoFolgas === "fixas") {
        const diaFixo = Number(folgasFixas[funcionario.id]);
        status = dia.diaSemana === diaFixo ? "F" : "T";
      } else {
        // Rotativas: o ciclo caminha com o calendario e e deslocado pelo indice do
        // funcionario, de modo que a equipe nao folgue toda no mesmo dia. Andar pelos
        // dias corridos preserva o ritmo semanal; quando a folga do ciclo cai num
        // domingo de trabalho obrigatorio, quem repoe o descanso e o limitador de
        // dias seguidos, com uma folga so — nao uma por semana.
        status = ciclo[(indice + dia.numero - 1) % ciclo.length];
      }

      if (status === "T" && diasFeriado.has(dia.numero)) status = "FE";

      linha[dia.numero] = status;
    });

    // Ultimo passo: nenhum funcionario pode passar do teto de dias seguidos do ciclo.
    limitarDiasSeguidos(linha, dias, limiteDeSequencia, minimoDomingos > 0);

    mapa[funcionario.id] = linha;
  });

  return { dias, mapa };
}
