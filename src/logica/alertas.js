import { STATUS_TRABALHANDO } from "../constantes";
import { minimoDoSetor } from "../utils";

const estaTrabalhando = (status) => STATUS_TRABALHANDO.includes(status);

/**
 * Conferencia de cobertura minima, dia a dia. Considera sempre TODOS os
 * funcionarios (o filtro da tabela e apenas visual).
 * Retorna { lista, diasComAlerta } — a lista de mensagens e um Set com os dias afetados.
 */
export function calcularAlertas({ dias, mapa, funcionarios, minimosSetor, minimoGeral }) {
  const lista = [];
  const diasComAlerta = new Set();

  const setores = [...new Set(funcionarios.map((f) => f.funcao))];

  dias.forEach((dia) => {
    const trabalhando = funcionarios.filter((f) => estaTrabalhando(mapa[f.id]?.[dia.numero]));

    setores.forEach((setor) => {
      const minimo = minimoDoSetor(minimosSetor[setor], dia.diaSemana);
      if (minimo <= 0) return;
      const quantidade = trabalhando.filter((f) => f.funcao === setor).length;
      if (quantidade < minimo) {
        diasComAlerta.add(dia.numero);
        lista.push({
          dia: dia.numero,
          abrev: dia.abrev,
          alvo: setor,
          quantidade,
          minimo,
        });
      }
    });

    const minimoDoDia = Number(minimoGeral[dia.diaSemana]) || 0;
    if (minimoDoDia > 0 && trabalhando.length < minimoDoDia) {
      diasComAlerta.add(dia.numero);
      lista.push({
        dia: dia.numero,
        abrev: dia.abrev,
        alvo: "Equipe total",
        quantidade: trabalhando.length,
        minimo: minimoDoDia,
      });
    }
  });

  lista.sort((a, b) => a.dia - b.dia);
  return { lista, diasComAlerta };
}

/**
 * Quantos funcionarios trabalham em cada domingo do mes.
 * `diasComAlerta` vem de calcularAlertas e marca o domingo como coberto ou nao.
 */
export function coberturaDominical({ dias, mapa, funcionarios, diasComAlerta }) {
  return dias
    .filter((dia) => dia.diaSemana === 0)
    .map((dia) => ({
      dia: dia.numero,
      trabalhando: funcionarios.filter((f) => estaTrabalhando(mapa[f.id]?.[dia.numero])).length,
      total: funcionarios.length,
      completa: !diasComAlerta.has(dia.numero),
    }));
}
