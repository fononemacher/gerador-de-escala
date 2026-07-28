import { CalendarDays } from "lucide-react";
import Campo from "../../componentes/Campo";
import Cartao from "../../componentes/Cartao";
import { entrada } from "../../estilos";
import { ANOS, MESES, OPCOES_DOMINGOS } from "../../constantes";

export default function CardPeriodo({
  mes,
  ano,
  minDomingosHomens,
  minDomingosMulheres,
  onAlterar,
}) {
  return (
    <Cartao
      titulo="4. Período e Domingos"
      subtitulo="Escolha o mês da escala e quantos domingos de folga cada grupo deve ter no mínimo."
      icone={<CalendarDays size={16} />}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 12,
        }}
      >
        <Campo label="Mês">
          <select style={entrada} value={mes} onChange={(e) => onAlterar("mes", Number(e.target.value))}>
            {MESES.map((nome, indice) => (
              <option key={nome} value={indice}>
                {nome}
              </option>
            ))}
          </select>
        </Campo>

        <Campo label="Ano">
          <select style={entrada} value={ano} onChange={(e) => onAlterar("ano", Number(e.target.value))}>
            {ANOS.map((valor) => (
              <option key={valor} value={valor}>
                {valor}
              </option>
            ))}
          </select>
        </Campo>

        <Campo label="Mínimo de domingos de folga — Homens">
          <select
            style={entrada}
            value={minDomingosHomens}
            onChange={(e) => onAlterar("minDomingosHomens", Number(e.target.value))}
          >
            {OPCOES_DOMINGOS.map((opcao) => (
              <option key={opcao.valor} value={opcao.valor}>
                {opcao.rotulo}
              </option>
            ))}
          </select>
        </Campo>

        <Campo label="Mínimo de domingos de folga — Mulheres">
          <select
            style={entrada}
            value={minDomingosMulheres}
            onChange={(e) => onAlterar("minDomingosMulheres", Number(e.target.value))}
          >
            {OPCOES_DOMINGOS.map((opcao) => (
              <option key={opcao.valor} value={opcao.valor}>
                {opcao.rotulo}
              </option>
            ))}
          </select>
        </Campo>
      </div>
    </Cartao>
  );
}
