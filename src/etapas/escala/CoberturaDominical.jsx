import { Sun } from "lucide-react";
import Cartao from "../../componentes/Cartao";
import { CORES } from "../../estilos";

export default function CoberturaDominical({ domingos }) {
  if (domingos.length === 0) return null;

  return (
    <Cartao
      titulo="Cobertura Dominical"
      subtitulo="Funcionários trabalhando em cada domingo sobre o total da equipe."
      icone={<Sun size={16} />}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))",
          gap: 10,
        }}
      >
        {domingos.map((domingo) => {
          const cor = domingo.completa ? CORES.sucesso : CORES.alerta;
          return (
            <div
              key={domingo.dia}
              style={{
                border: `1px solid ${CORES.borda}`,
                borderRadius: 10,
                padding: "12px 8px",
                textAlign: "center",
                background: domingo.completa ? "#F6FDFA" : "#FFF8F3",
              }}
            >
              <div style={{ fontSize: 17, fontWeight: 700, color: cor }}>
                {domingo.trabalhando}/{domingo.total}
              </div>
              <div
                style={{
                  marginTop: 3,
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: CORES.textoSecundario,
                  letterSpacing: 0.3,
                }}
              >
                DIA {String(domingo.dia).padStart(2, "0")}
              </div>
            </div>
          );
        })}
      </div>
    </Cartao>
  );
}
