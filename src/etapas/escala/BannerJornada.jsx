import { CalendarX } from "lucide-react";
import { CORES } from "../../estilos";

/**
 * Violacoes do teto de dias consecutivos — normalmente fruto de edicao manual,
 * ja que a geracao respeita o limite.
 */
export default function BannerJornada({ violacoes, limite, modelo }) {
  if (violacoes.length === 0) return null;

  return (
    <section
      style={{
        background: CORES.erroFundo,
        border: `2px solid ${CORES.erro}`,
        borderRadius: 14,
        padding: 16,
      }}
    >
      <header style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
        <CalendarX size={17} color={CORES.erro} style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ minWidth: 0 }}>
          <strong style={{ fontSize: 13.5, color: "#991B1B" }}>
            {violacoes.length} funcionário(s) passando do limite de dias seguidos de trabalho
          </strong>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#991B1B", opacity: 0.85 }}>
            A escala {modelo} permite no máximo {limite} dia(s) consecutivos. Os dias em excesso
            estão marcados em vermelho na tabela — troque a célula para F para regularizar.
          </p>
        </div>
      </header>

      <div
        style={{
          marginTop: 10,
          maxHeight: 130,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {violacoes.map((violacao, indice) => (
          <p
            key={`${violacao.id}-${violacao.inicio}-${indice}`}
            style={{ margin: 0, fontSize: 12.5, color: "#7F1D1D", lineHeight: 1.6 }}
          >
            <strong>{violacao.nome}</strong>: {violacao.seguidos} dias seguidos — do dia{" "}
            {String(violacao.inicio).padStart(2, "0")} ao dia{" "}
            {String(violacao.fim).padStart(2, "0")}
          </p>
        ))}
      </div>
    </section>
  );
}
