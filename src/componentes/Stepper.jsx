import { Check } from "lucide-react";
import { CORES, cartao } from "../estilos";

const ETAPAS = [
  { numero: 1, rotulo: "Funcionários" },
  { numero: 2, rotulo: "Configuração" },
  { numero: 3, rotulo: "Escala Gerada" },
];

export default function Stepper({ etapaAtual, escalaGerada, onIr }) {
  return (
    <nav style={{ ...cartao, padding: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
      {ETAPAS.map((etapa) => {
        const ativa = etapaAtual === etapa.numero;
        const habilitada = etapa.numero < 3 || escalaGerada;
        const concluida = etapa.numero < etapaAtual;
        return (
          <button
            key={etapa.numero}
            type="button"
            onClick={() => habilitada && onIr(etapa.numero)}
            disabled={!habilitada}
            aria-current={ativa ? "step" : undefined}
            style={{
              flex: "1 1 180px",
              minWidth: 140,
              height: 44,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "0 10px",
              border: ativa ? `1px solid ${CORES.primaria}` : "1px solid transparent",
              borderRadius: 10,
              background: ativa ? CORES.selecionado : "transparent",
              color: habilitada ? CORES.texto : "#BFC5D4",
              fontSize: 13.5,
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: ativa || concluida ? CORES.primaria : "#E7EAF1",
                color: ativa || concluida ? CORES.branco : CORES.textoSecundario,
                fontSize: 11.5,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {concluida ? <Check size={13} /> : etapa.numero}
            </span>
            <span
              style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            >
              {etapa.rotulo}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
