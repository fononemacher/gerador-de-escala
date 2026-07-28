import { useState } from "react";
import { PartyPopper, Plus, X } from "lucide-react";
import Badge from "../../componentes/Badge";
import Campo from "../../componentes/Campo";
import Cartao from "../../componentes/Cartao";
import EntradaNumero from "../../componentes/EntradaNumero";
import { CORES, botaoPrimario, botaoIcone, entrada } from "../../estilos";

export default function CardFeriados({ feriados, onAdicionar, onRemover }) {
  const [dia, setDia] = useState(1);
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");

  function adicionar() {
    const texto = nome.trim();
    if (!texto) {
      setErro("Informe o nome do feriado.");
      return;
    }
    setErro("");
    onAdicionar({ dia: Number(dia), nome: texto });
    setNome("");
  }

  return (
    <Cartao
      titulo="6. Feriados do Mês"
      subtitulo="Dias marcados como feriado aparecem na escala como FE (Feriado Trabalhado) para quem estiver escalado."
      icone={<PartyPopper size={16} />}
    >
      {feriados.length === 0 ? (
        <p style={{ margin: "0 0 14px", fontSize: 13, color: CORES.textoSecundario }}>
          Nenhum feriado neste mês.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          {feriados.map((feriado) => (
            <div
              key={`${feriado.dia}-${feriado.nome}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                border: `1px solid ${CORES.borda}`,
                borderRadius: 10,
              }}
            >
              <Badge
                texto={`DIA ${String(feriado.dia).padStart(2, "0")}`}
                fundo="#FEF9C3"
                cor="#A16207"
              />
              <span style={{ fontSize: 13, color: CORES.texto, minWidth: 0 }}>{feriado.nome}</span>
              <button
                type="button"
                onClick={() => onRemover(feriado)}
                aria-label={`Remover feriado ${feriado.nome}`}
                title={`Remover feriado ${feriado.nome}`}
                style={{ ...botaoIcone, color: CORES.erro, marginLeft: "auto" }}
              >
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
        <Campo label="Dia" largura={90}>
          <EntradaNumero valor={dia} onChange={setDia} min={1} max={31} />
        </Campo>
        <Campo label="Nome do feriado" flex="3 1 220px">
          <input
            style={entrada}
            type="text"
            placeholder="Ex.: Independência do Brasil"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && adicionar()}
          />
        </Campo>
        <button type="button" style={botaoPrimario} onClick={adicionar}>
          <Plus size={16} />
          Adicionar
        </button>
      </div>

      {erro ? (
        <p style={{ margin: "10px 0 0", fontSize: 12.5, color: CORES.erro, fontWeight: 500 }}>
          {erro}
        </p>
      ) : null}
    </Cartao>
  );
}
