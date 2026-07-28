/** Etiqueta colorida reutilizavel (funcao, sexo, turno, status...). */
export default function Badge({ texto, fundo, cor, titulo, estilo }) {
  return (
    <span
      title={titulo}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 9px",
        borderRadius: 999,
        background: fundo,
        color: cor,
        fontSize: 11.5,
        fontWeight: 600,
        whiteSpace: "nowrap",
        lineHeight: 1.4,
        ...estilo,
      }}
    >
      {texto}
    </span>
  );
}
