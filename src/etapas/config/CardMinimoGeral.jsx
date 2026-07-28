import { UsersRound } from "lucide-react";
import Campo from "../../componentes/Campo";
import Cartao from "../../componentes/Cartao";
import EntradaNumero from "../../componentes/EntradaNumero";
import { ABREV_DIAS, ORDEM_SEMANA } from "../../constantes";

export default function CardMinimoGeral({ minimoGeral, onAlterar }) {
  return (
    <Cartao
      titulo="2. Mínimo Geral de Funcionários por Dia da Semana"
      subtitulo="Quantas pessoas, somando todos os setores, precisam estar trabalhando. Use 0 para não exigir mínimo."
      icone={<UsersRound size={16} />}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(84px, 1fr))",
          gap: 10,
        }}
      >
        {ORDEM_SEMANA.map((dia) => (
          <Campo key={dia} label={ABREV_DIAS[dia]}>
            <EntradaNumero
              valor={minimoGeral[dia]}
              onChange={(valor) => onAlterar(dia, valor)}
              aria-label={`Mínimo geral para ${ABREV_DIAS[dia]}`}
            />
          </Campo>
        ))}
      </div>
    </Cartao>
  );
}
