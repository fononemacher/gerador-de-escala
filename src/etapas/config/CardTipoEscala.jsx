import { CalendarRange } from "lucide-react";
import Cartao from "../../componentes/Cartao";
import { CORES } from "../../estilos";
import { TIPOS_ESCALA } from "../../constantes";

export default function CardTipoEscala({ tipoEscala, onSelecionar }) {
  return (
    <Cartao
      titulo="1. Tipo de Escala"
      subtitulo="O modelo escolhido vale para todos os funcionários."
      icone={<CalendarRange size={16} />}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 10,
        }}
      >
        {TIPOS_ESCALA.map((tipo) => {
          const selecionado = tipo.id === tipoEscala;
          return (
            <button
              key={tipo.id}
              type="button"
              onClick={() => onSelecionar(tipo.id)}
              aria-pressed={selecionado}
              style={{
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: 12,
                border: selecionado
                  ? `2px solid ${CORES.primaria}`
                  : `1px solid ${CORES.bordaInput}`,
                background: selecionado ? CORES.selecionado : CORES.branco,
              }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: 15,
                  fontWeight: 700,
                  color: CORES.texto,
                }}
              >
                {tipo.rotulo}
              </span>
              <span
                style={{
                  display: "block",
                  marginTop: 3,
                  fontSize: 11.5,
                  color: CORES.textoSecundario,
                  fontWeight: 500,
                }}
              >
                {tipo.descricao}
              </span>
            </button>
          );
        })}
      </div>
    </Cartao>
  );
}
