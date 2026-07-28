import { CORES, cartao } from "../estilos";

/** Cartao compacto usado no bloco "Resumo da Escala". */
export default function ResumoCard({ icone, valor, rotulo }) {
  return (
    <div style={{ ...cartao, padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
      {icone ? (
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: CORES.selecionado,
            color: CORES.primaria,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icone}
        </span>
      ) : null}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: CORES.texto,
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {valor}
        </div>
        <div style={{ fontSize: 11.5, color: CORES.textoSecundario, marginTop: 2 }}>{rotulo}</div>
      </div>
    </div>
  );
}
