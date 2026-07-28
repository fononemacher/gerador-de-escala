// Paleta e estilos base compartilhados (CSS-in-JS via prop style).

export const CORES = {
  fundo: "#F4F6FA",
  primaria: "#101C3D",
  gradienteCabecalho: "linear-gradient(135deg, #101C3D 0%, #1B2C5C 100%)",
  subtituloCabecalho: "#AAB6DA",
  selecionado: "#EEF1F8",
  branco: "#FFFFFF",
  texto: "#1A2138",
  textoSecundario: "#8B93A7",
  label: "#4B5468",
  borda: "#E7EAF1",
  bordaInput: "#DDE1EA",
  erro: "#DC2626",
  erroFundo: "#FEF2F2",
  erroBorda: "#FECACA",
  aviso: "#D97706",
  avisoFundo: "#FFFBEB",
  avisoBorda: "#FDE68A",
  avisoTexto: "#92400E",
  info: "#1D4ED8",
  infoFundo: "#EFF6FF",
  infoBorda: "#BFDBFE",
  domingo: "#9F1239",
  domingoFundo: "#FDEEF3",
  sucesso: "#047857",
  alerta: "#C2410C",
  linhaAlternada: "#FBFBFD",
  edicaoFundo: "#EEF4FF",
  edicaoBorda: "#93B4F5",
};

export const FONTE = "'Inter', 'Segoe UI', system-ui, sans-serif";

export const cartao = {
  background: CORES.branco,
  borderRadius: 14,
  border: `1px solid ${CORES.borda}`,
  boxShadow: "0 1px 2px rgba(16,28,61,0.04)",
  padding: 20,
};

export const tituloCartao = {
  margin: 0,
  fontSize: 15,
  fontWeight: 600,
  color: CORES.texto,
  display: "flex",
  alignItems: "center",
  gap: 8,
};

export const subtituloCartao = {
  margin: "4px 0 0",
  fontSize: 12.5,
  color: CORES.textoSecundario,
  lineHeight: 1.5,
};

export const rotulo = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: CORES.label,
  marginBottom: 6,
};

export const entrada = {
  width: "100%",
  height: 40,
  padding: "0 10px",
  border: `1px solid ${CORES.bordaInput}`,
  borderRadius: 8,
  background: CORES.branco,
  fontSize: 13.5,
  color: CORES.texto,
  outlineOffset: 2,
};

export const botaoPrimario = {
  height: 40,
  padding: "0 18px",
  border: "none",
  borderRadius: 8,
  background: CORES.primaria,
  color: CORES.branco,
  fontSize: 13.5,
  fontWeight: 600,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

export const botaoSecundario = {
  height: 40,
  padding: "0 18px",
  border: `1px solid ${CORES.bordaInput}`,
  borderRadius: 8,
  background: CORES.branco,
  color: CORES.texto,
  fontSize: 13.5,
  fontWeight: 600,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

export const botaoDesabilitado = {
  background: "#C6CBD8",
  color: "#F6F7FB",
};

export const botaoIcone = {
  width: 30,
  height: 30,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: `1px solid ${CORES.bordaInput}`,
  borderRadius: 8,
  background: CORES.branco,
  color: CORES.textoSecundario,
  padding: 0,
};
