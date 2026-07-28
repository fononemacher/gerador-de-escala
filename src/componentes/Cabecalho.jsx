import { CalendarDays } from "lucide-react";
import { CORES } from "../estilos";

export default function Cabecalho() {
  return (
    <header style={{ background: CORES.gradienteCabecalho, padding: "26px 20px" }}>
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <span
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: "rgba(255,255,255,0.12)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CalendarDays size={22} color="#FFFFFF" />
        </span>
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 21,
              fontWeight: 700,
              color: CORES.branco,
              letterSpacing: -0.2,
            }}
          >
            Gerador de Escalas de Trabalho
          </h1>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: CORES.subtituloCabecalho }}>
            Monte a escala mensal da equipe respeitando folgas, domingos e cobertura mínima
          </p>
        </div>
      </div>
    </header>
  );
}
