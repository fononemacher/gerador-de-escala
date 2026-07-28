import { AlertTriangle } from "lucide-react";
import { CORES } from "../../estilos";

/** Banner vermelho com os dias que nao atingem os minimos configurados. */
export default function BannerAlertas({ alertas, configViavel = true }) {
  if (alertas.length === 0) return null;

  return (
    <section
      style={{
        background: CORES.erroFundo,
        border: `1px solid ${CORES.erroBorda}`,
        borderRadius: 14,
        padding: 16,
      }}
    >
      <header style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
        <AlertTriangle size={17} color={CORES.erro} style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ minWidth: 0 }}>
          <strong style={{ fontSize: 13.5, color: "#991B1B" }}>
            Cobertura mínima não atendida — {alertas.length} alerta(s)
          </strong>
          {/* Sem problemas de viabilidade, a falta veio do encaixe da rotacao, nao da configuracao. */}
          {configViavel ? (
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#991B1B", opacity: 0.85 }}>
              A configuração cabe no total do mês — foi a rotação que não encaixou nestes dias.
              Clique nas células da tabela para ajustar manualmente.
            </p>
          ) : null}
        </div>
      </header>

      <div style={{ maxHeight: 130, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
        {alertas.map((alerta, indice) => (
          <p
            key={`${alerta.dia}-${alerta.alvo}-${indice}`}
            style={{ margin: 0, fontSize: 12.5, color: "#7F1D1D", lineHeight: 1.6 }}
          >
            Dia {String(alerta.dia).padStart(2, "0")} ({alerta.abrev}) — <strong>{alerta.alvo}</strong>:{" "}
            {alerta.quantidade} de {alerta.minimo} funcionário(s) mínimo trabalhando
          </p>
        ))}
      </div>
    </section>
  );
}
