import { Info, Pin, RefreshCw, Shuffle } from "lucide-react";
import Cartao from "../../componentes/Cartao";
import { CORES, entrada } from "../../estilos";
import { DIAS_SEMANA } from "../../constantes";

const OPCOES = [
  {
    id: "rotativas",
    rotulo: "Rotativas",
    descricao: "As folgas variam a cada semana entre diferentes dias (seg–sáb).",
    icone: RefreshCw,
    cor: "#1D4ED8",
  },
  {
    id: "fixas",
    rotulo: "Fixas na semana",
    descricao: "Cada funcionário folga sempre no mesmo dia da semana.",
    icone: Pin,
    cor: "#DC2626",
  },
];

export default function CardModoFolgas({
  modoFolgas,
  folgasFixas,
  funcionarios,
  onSelecionarModo,
  onAlterarFolgaFixa,
  onSugerirNovamente,
}) {
  return (
    <Cartao
      titulo="5. Modo de Folgas (exceto domingos)"
      subtitulo="Define como as folgas de segunda a sábado são distribuídas."
      icone={<Shuffle size={16} />}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 10,
        }}
      >
        {OPCOES.map((opcao) => {
          const Icone = opcao.icone;
          const selecionado = modoFolgas === opcao.id;
          return (
            <button
              key={opcao.id}
              type="button"
              onClick={() => onSelecionarModo(opcao.id)}
              aria-pressed={selecionado}
              style={{
                textAlign: "left",
                display: "flex",
                gap: 10,
                padding: "14px",
                borderRadius: 12,
                border: selecionado
                  ? `2px solid ${CORES.primaria}`
                  : `1px solid ${CORES.bordaInput}`,
                background: selecionado ? CORES.selecionado : CORES.branco,
              }}
            >
              <Icone size={18} color={opcao.cor} style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: CORES.texto }}>
                  {opcao.rotulo}
                </span>
                <span
                  style={{
                    display: "block",
                    marginTop: 3,
                    fontSize: 11.5,
                    color: CORES.textoSecundario,
                    fontWeight: 500,
                    lineHeight: 1.5,
                  }}
                >
                  {opcao.descricao}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          gap: 10,
          padding: 12,
          borderRadius: 10,
          background: CORES.infoFundo,
          border: `1px solid ${CORES.infoBorda}`,
        }}
      >
        <Info size={16} color={CORES.info} style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ margin: 0, fontSize: 12.5, color: "#1E3A8A", lineHeight: 1.55 }}>
          <strong>Domingos sempre oscilam:</strong> Independente do modo escolhido, os domingos de
          folga são distribuídos de forma equilibrada entre os funcionários conforme o mínimo
          configurado acima.
        </p>
      </div>

      {modoFolgas === "fixas" ? (
        <div
          style={{
            marginTop: 14,
            border: `1px solid ${CORES.borda}`,
            borderRadius: 12,
            padding: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <strong style={{ fontSize: 13, color: CORES.texto }}>Dia fixo de folga</strong>
              <p style={{ margin: "3px 0 0", fontSize: 11.5, color: CORES.textoSecundario }}>
                Sugerimos um dia para cada funcionário em rodízio; ajuste como preferir.
              </p>
            </div>
            <button
              type="button"
              onClick={onSugerirNovamente}
              style={{
                marginLeft: "auto",
                height: 34,
                padding: "0 12px",
                borderRadius: 8,
                border: `1px solid ${CORES.bordaInput}`,
                background: CORES.branco,
                color: CORES.label,
                fontSize: 12,
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <RefreshCw size={13} />
              Sugerir novamente
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 10,
            }}
          >
            {funcionarios.map((funcionario) => (
              <label
                key={funcionario.id}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    fontSize: 12.5,
                    color: CORES.texto,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={funcionario.nome}
                >
                  {funcionario.nome}
                </span>
                <select
                  style={{ ...entrada, width: 120, height: 36 }}
                  value={folgasFixas[funcionario.id] ?? ""}
                  onChange={(e) => onAlterarFolgaFixa(funcionario.id, Number(e.target.value))}
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  {DIAS_SEMANA.map((dia) => (
                    <option key={dia.valor} value={dia.valor}>
                      {dia.rotulo}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>
      ) : null}
    </Cartao>
  );
}
