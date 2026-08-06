// Dados fixos e tabelas de referencia usados em toda a aplicacao.

export const FUNCIONARIOS_INICIAIS = [
  { id: "adriele-oliveira-dos-santos", nome: "Adriele Oliveira Dos Santos", funcao: "Fiscal De Caixa", sexo: "Feminino", turno: "" },
  { id: "alberto-dos-santos-oliveira", nome: "Alberto Dos Santos Oliveira", funcao: "Assistente Administrativo", sexo: "Masculino", turno: "" },
  { id: "anderson-santana-dos-santos", nome: "Anderson Santana Dos Santos", funcao: "Repositor De Mercadorias", sexo: "Masculino", turno: "" },
  { id: "andre-liro-santos-de-vasconcelos", nome: "Andre Liro Santos De Vasconcelos", funcao: "Atendente De Balcão", sexo: "Masculino", turno: "" },
  { id: "andreza-silva-de-jesus", nome: "Andreza Silva De Jesus", funcao: "Operador De Caixa", sexo: "Feminino", turno: "" },
  { id: "argileo-da-conceicao-neto", nome: "Argileo Da Conceicao Neto", funcao: "Auxiliar De Padeiro", sexo: "Masculino", turno: "" },
  { id: "bruno-santos-da-hora", nome: "Bruno Santos Da Hora", funcao: "Repositor De Mercadorias", sexo: "Masculino", turno: "" },
  { id: "carleandro-ferreira-dos-santos", nome: "Carleandro Ferreira Dos Santos", funcao: "Açougueiro", sexo: "Masculino", turno: "" },
  { id: "cleiton-nascimento-macario-da-silva", nome: "Cleiton Nascimento Macario Da Silva", funcao: "Repositor De Mercadorias", sexo: "Masculino", turno: "" },
  { id: "conceicao-do-nascimento-moreira", nome: "Conceição Do Nascimento Moreira", funcao: "Cozinheiro(A)", sexo: "Masculino", turno: "" },
  { id: "doriel-santos-da-conceicao", nome: "Doriel Santos Da Conceição", funcao: "Repositor De Mercadorias", sexo: "Masculino", turno: "" },
  { id: "eliete-barbosa-da-conceicao", nome: "Eliete Barbosa Da Conceição", funcao: "Auxiliar De Limpeza", sexo: "Masculino", turno: "" },
  { id: "ewerton-souza-santos", nome: "Ewerton Souza Santos", funcao: "Repositor De Mercadorias", sexo: "Masculino", turno: "" },
  { id: "fabricia-evangelista-de-souza", nome: "Fabricia Evangelista De Souza", funcao: "Operador De Caixa", sexo: "Feminino", turno: "" },
  { id: "fernanda-santana-dos-santos", nome: "Fernanda Santana Dos Santos", funcao: "Repositor De Mercadorias", sexo: "Feminino", turno: "" },
  { id: "gabriela-eduarda-costa-kruschewsky", nome: "Gabriela Eduarda Costa Kruschewsky", funcao: "Operador De Caixa", sexo: "Feminino", turno: "" },
  { id: "grasiele-santos-do-nascimento", nome: "Grasiele Santos Do Nascimento", funcao: "Operador De Caixa", sexo: "Feminino", turno: "" },
  { id: "jefferson-junior-santos-andrade", nome: "Jefferson Júnior Santos Andrade", funcao: "Repositor De Mercadorias", sexo: "Masculino", turno: "" },
  { id: "joao-miranda-andrade-santos", nome: "Joao Miranda Andrade Santos", funcao: "Encarregado De Loja", sexo: "Masculino", turno: "" },
  { id: "joao-paulo-nascimento-dos-santos", nome: "Joao Paulo Nascimento Dos Santos", funcao: "Ajudante De Açougueiro (Comércio)", sexo: "Masculino", turno: "" },
  { id: "joedson-ferreira-do-nascimento", nome: "Joedson Ferreira Do Nascimento", funcao: "Ajudante De Açougueiro (Comércio)", sexo: "Masculino", turno: "" },
  { id: "jonata-coutinho-dos-santos", nome: "Jonata Coutinho Dos Santos", funcao: "Repositor De Mercadorias", sexo: "Masculino", turno: "" },
  { id: "juliana-reis-bonfim", nome: "Juliana Reis Bonfim", funcao: "Auxiliar Administrativo", sexo: "Feminino", turno: "" },
  { id: "luan-santana-santos", nome: "Luan Santana Santos", funcao: "Ajudante De Açougueiro (Comércio)", sexo: "Masculino", turno: "" },
  { id: "maikon-reis-silva", nome: "Maikon Reis Silva", funcao: "Operador De Loja", sexo: "Masculino", turno: "" },
  { id: "manasses-barboza-santos", nome: "Manasses Barboza Santos", funcao: "Motorista De Caminhão", sexo: "Masculino", turno: "" },
  { id: "sergio-rodrigues-de-souza", nome: "Sergio Rodrigues De Souza", funcao: "Repositor De Mercadorias", sexo: "Masculino", turno: "" },
  { id: "taina-silva-santos", nome: "Taina Silva Santos", funcao: "Operador De Caixa", sexo: "Feminino", turno: "" },
  { id: "thiago-alberto-sacramento-de-jesus", nome: "Thiago Alberto Sacramento De Jesus", funcao: "Padeiro", sexo: "Masculino", turno: "" },
  { id: "victor-santos-de-assis", nome: "Victor Santos De Assis", funcao: "Estoquista", sexo: "Masculino", turno: "" },
];

export const SEXOS = ["Masculino", "Feminino"];

export const TURNOS = [
  { valor: "", rotulo: "Não definido" },
  { valor: "Manhã", rotulo: "Manhã" },
  { valor: "Tarde", rotulo: "Tarde" },
  { valor: "Noite", rotulo: "Noite" },
  { valor: "Integral", rotulo: "Integral" },
];

// T = dia de trabalho, F = dia de folga.
export const TIPOS_ESCALA = [
  {
    id: "6x1",
    rotulo: "6×1",
    descricao: "6 dias trabalho, 1 folga",
    ciclo: ["T", "T", "T", "T", "T", "T", "F"],
  },
  {
    id: "6x2",
    rotulo: "6×2",
    descricao: "6 dias trabalho, 2 folgas",
    ciclo: ["T", "T", "T", "T", "T", "T", "F", "F"],
  },
  {
    id: "5x2",
    rotulo: "5×2",
    descricao: "5 dias trabalho, 2 folgas",
    ciclo: ["T", "T", "T", "T", "T", "F", "F"],
  },
  {
    id: "5x1",
    rotulo: "5×1",
    descricao: "5 dias trabalho, 1 folga",
    ciclo: ["T", "T", "T", "T", "T", "F"],
  },
  {
    id: "12x36",
    rotulo: "12×36",
    descricao: "12h trabalho, 36h descanso",
    ciclo: ["T", "F"],
  },
  {
    id: "espanhola",
    rotulo: "Espanhola",
    descricao: "48h e 40h alternadas",
    ciclo: ["T", "T", "T", "T", "T", "T", "F", "T", "T", "T", "T", "T", "F", "F"],
  },
];

export const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const ANOS = [2025, 2026, 2027];

// Indice 0 = domingo, seguindo Date.getDay().
export const ABREV_DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// Dias uteis para folga fixa (segunda a sabado) — usados no rodizio de sugestao.
export const DIAS_SEMANA = [
  { valor: 1, rotulo: "Segunda" },
  { valor: 2, rotulo: "Terça" },
  { valor: 3, rotulo: "Quarta" },
  { valor: 4, rotulo: "Quinta" },
  { valor: 5, rotulo: "Sexta" },
  { valor: 6, rotulo: "Sábado" },
];

// Ordem de exibicao dos campos de minimo: comeca na segunda e termina no domingo.
export const ORDEM_SEMANA = [1, 2, 3, 4, 5, 6, 0];

export const OPCOES_DOMINGOS = [
  { valor: 0, rotulo: "Sem mínimo" },
  { valor: 1, rotulo: "1 domingo por mês" },
  { valor: 2, rotulo: "2 domingos por mês" },
  { valor: 3, rotulo: "3 domingos por mês" },
  { valor: 4, rotulo: "4 domingos por mês" },
];

export const STATUS = {
  T: { sigla: "T", rotulo: "Trabalho", fundo: "#ECFDF5", texto: "#047857" },
  F: { sigla: "F", rotulo: "Folga", fundo: "#F1F3F8", texto: "#8B93A7" },
  FE: { sigla: "FE", rotulo: "Feriado Trabalhado", fundo: "#FEF9C3", texto: "#A16207" },
  FC: { sigla: "FC", rotulo: "Folga Compensatória", fundo: "#EEF2FF", texto: "#4338CA" },
};

// Ciclo aplicado ao clicar em uma celula da tabela.
export const CICLO_STATUS = ["T", "F", "FE", "FC"];

// Status que contam como "funcionario trabalhando" nas conferencias de cobertura.
export const STATUS_TRABALHANDO = ["T", "FE"];

// Paleta fixa de 6 pares fundo/texto para os badges de funcao.
export const PALETA_FUNCOES = [
  { fundo: "#EEF2FF", texto: "#4338CA" },
  { fundo: "#ECFDF5", texto: "#047857" },
  { fundo: "#FEF9C3", texto: "#A16207" },
  { fundo: "#FDEEF3", texto: "#9F1239" },
  { fundo: "#EFF6FF", texto: "#1D4ED8" },
  { fundo: "#F5F3FF", texto: "#6D28D9" },
];

export const CORES_SEXO = {
  Feminino: { fundo: "#FDEEF3", texto: "#9F1239" },
  Masculino: { fundo: "#EFF6FF", texto: "#1D4ED8" },
};

export const SIMBOLO_SEXO = { Feminino: "♀", Masculino: "♂" };
