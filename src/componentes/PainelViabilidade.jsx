import { OctagonAlert } from "lucide-react";
import { CORES } from "../estilos";

const TITULOS = {
  equipe: "Equipe insuficiente",
  domingo: "Domingos inviáveis",
  capacidade: "Capacidade do mês estourada",
};

/**
 * Aviso de configuracao impossivel de atender — diferente do banner vermelho, que
 * aponta os dias que ficaram em falta na escala ja gerada. Aqui o recado e que
 * nenhum arranjo de funcionarios atenderia os minimos definidos.
 */
export default function PainelViabilidade({ problemas, contexto = "configuracao" }) {
  if (problemas.length === 0) return null;

  const introducao =
    contexto === "escala"
      ? "Os dias em falta abaixo não são um erro de encaixe: a configuração atual não tem solução possível."
      : "Com a equipe e a escala atuais, estes mínimos não podem ser cumpridos em nenhuma combinação de folgas.";

  return (
    <section
      style={{
        background: CORES.avisoFundo,
        border: `1px solid ${CORES.avisoBorda}`,
        borderRadius: 14,
        padding: 16,
      }}
    >
      <header style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
        <OctagonAlert size={17} color={CORES.aviso} style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ minWidth: 0 }}>
          <strong style={{ fontSize: 13.5, color: CORES.avisoTexto }}>
            {problemas.length} requisito(s) que a escala não consegue atender
          </strong>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: CORES.avisoTexto, opacity: 0.85 }}>
            {introducao}
          </p>
        </div>
      </header>

      <div
        style={{
          marginTop: 10,
          maxHeight: 190,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {problemas.map((problema, indice) => (
          <div
            key={`${problema.alvo}-${problema.tipo}-${indice}`}
            style={{
              background: "rgba(255,255,255,0.65)",
              border: `1px solid ${CORES.avisoBorda}`,
              borderRadius: 10,
              padding: "9px 11px",
            }}
          >
            <p style={{ margin: 0, fontSize: 12.5, color: CORES.avisoTexto, lineHeight: 1.6 }}>
              <strong>{problema.alvo}</strong>{" "}
              <span style={{ opacity: 0.7 }}>({TITULOS[problema.tipo]})</span> — {problema.mensagem}
            </p>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 11.5,
                color: CORES.avisoTexto,
                opacity: 0.8,
                lineHeight: 1.55,
              }}
            >
              {problema.sugestao}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
