import { STATUS_TRABALHANDO } from "../constantes";

const trabalhou = (status) => STATUS_TRABALHANDO.includes(status);

/**
 * Confere o teto de dias consecutivos de trabalho na escala como ela esta AGORA.
 *
 * A geracao ja respeita esse teto, mas a edicao manual das celulas nao passa por
 * ela — sem esta conferencia daria para montar um mes inteiro sem folga e nada
 * na tela avisaria.
 *
 * Retorna { lista, celulasEmExcesso }, onde celulasEmExcesso traz as chaves
 * `idFuncionario-numeroDoDia` dos dias que passaram do limite, para destacar na tabela.
 */
export function alertasDeJornada({ dias, mapa, funcionarios, limite }) {
  const lista = [];
  const celulasEmExcesso = new Set();

  if (!limite || dias.length === 0) return { lista, celulasEmExcesso };

  funcionarios.forEach((funcionario) => {
    let seguidos = 0;
    let inicio = null;

    const registrar = (fim) => {
      if (seguidos > limite) {
        lista.push({
          id: funcionario.id,
          nome: funcionario.nome,
          seguidos,
          inicio,
          fim,
        });
      }
    };

    dias.forEach((dia, indice) => {
      if (trabalhou(mapa[funcionario.id]?.[dia.numero])) {
        seguidos += 1;
        if (seguidos === 1) inicio = dia.numero;
        if (seguidos > limite) celulasEmExcesso.add(`${funcionario.id}-${dia.numero}`);
        return;
      }
      registrar(dias[indice - 1]?.numero);
      seguidos = 0;
      inicio = null;
    });

    // Sequencia que chega ate o fim do mes sem folga.
    registrar(dias[dias.length - 1].numero);
  });

  // Pior caso primeiro: e o que o usuario precisa corrigir antes.
  lista.sort((a, b) => b.seguidos - a.seguidos || a.inicio - b.inicio);
  return { lista, celulasEmExcesso };
}
