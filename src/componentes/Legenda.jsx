import { CORES } from "../estilos";
import { STATUS } from "../constantes";
import Badge from "./Badge";

const ITENS = [
  ...Object.values(STATUS),
  { sigla: "—", rotulo: "Domingo (coluna)", fundo: CORES.domingoFundo, texto: CORES.domingo },
];

/** Legenda dos status, fixa no topo do contêiner rolavel da tabela. */
export default function Legenda({ refExterna }) {
  return (
    <div
      ref={refExterna}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 5,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 14,
        padding: "12px 14px",
        background: CORES.branco,
        borderBottom: `1px solid ${CORES.borda}`,
        minHeight: 45,
      }}
    >
      {ITENS.map((item) => (
        <span key={item.sigla} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Badge
            texto={item.sigla}
            fundo={item.fundo}
            cor={item.texto}
            estilo={{ borderRadius: 6, minWidth: 26, justifyContent: "center", padding: "3px 6px" }}
          />
          <span style={{ fontSize: 11.5, color: CORES.textoSecundario, fontWeight: 500 }}>
            {item.rotulo}
          </span>
        </span>
      ))}
    </div>
  );
}
