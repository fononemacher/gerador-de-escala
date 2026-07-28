import { ABREV_DIAS, PALETA_FUNCOES } from "./constantes";

/** Remove acentos e transforma o nome em um id no formato slug. */
export function gerarId(nome) {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Iniciais do primeiro e do ultimo nome (ex.: "Adriele Oliveira" -> "AO"). */
export function iniciais(nome) {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

/** Hash simples e estavel, para derivar sempre a mesma cor do mesmo texto. */
export function hashTexto(texto) {
  let hash = 0;
  for (let i = 0; i < texto.length; i += 1) {
    hash = (hash * 31 + texto.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** Par fundo/texto da paleta fixa, derivado do nome da funcao. */
export function coresFuncao(funcao) {
  return PALETA_FUNCOES[hashTexto(funcao || "") % PALETA_FUNCOES.length];
}

/** Lista de dias do mes com numero, indice do dia da semana (0=Dom) e abreviacao. */
export function diasDoMes(mes, ano) {
  const total = new Date(ano, mes + 1, 0).getDate();
  const dias = [];
  for (let numero = 1; numero <= total; numero += 1) {
    const diaSemana = new Date(ano, mes, numero).getDay();
    dias.push({ numero, diaSemana, abrev: ABREV_DIAS[diaSemana] });
  }
  return dias;
}

/** Funcoes distintas presentes na equipe, em ordem alfabetica. */
export function setoresDaEquipe(funcionarios) {
  const distintas = [...new Set(funcionarios.map((f) => f.funcao))];
  return distintas.sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export function ordenarPorNome(lista) {
  return [...lista].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

/** Minimo exigido para um setor em um dia da semana (respeita o modo avancado). */
export function minimoDoSetor(configSetor, diaSemana) {
  if (!configSetor) return 0;
  if (configSetor.avancado) return Number(configSetor.porDia?.[diaSemana]) || 0;
  return Number(configSetor.simples) || 0;
}

export function objetoSemana(valor = 0) {
  return { 0: valor, 1: valor, 2: valor, 3: valor, 4: valor, 5: valor, 6: valor };
}
