import { useEffect, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import Legenda from "../../componentes/Legenda";
import { CORES, cartao } from "../../estilos";
import { SIMBOLO_SEXO, STATUS } from "../../constantes";

const LARGURA_NOME = 220;
const LARGURA_DIA = 46;
const ALTURA_LEGENDA = 45;

export default function TabelaEscala({ dias, funcionarios, mapa, diasComAlerta, onAlternarStatus }) {
  const refLegenda = useRef(null);
  // O cabecalho gruda logo abaixo da legenda; em telas estreitas a legenda quebra
  // em mais de uma linha, entao o deslocamento acompanha a altura real dela.
  const [topoCabecalho, setTopoCabecalho] = useState(ALTURA_LEGENDA);

  useEffect(() => {
    const elemento = refLegenda.current;
    if (!elemento) return undefined;
    const medir = () => setTopoCabecalho(elemento.offsetHeight || ALTURA_LEGENDA);
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      style={{
        ...cartao,
        padding: 0,
        maxHeight: "65vh",
        overflow: "auto",
        position: "relative",
      }}
    >
      <Legenda refExterna={refLegenda} />

      <table style={{ borderCollapse: "separate", borderSpacing: 0, width: "max-content" }}>
        <thead>
          <tr>
            <th
              style={{
                position: "sticky",
                top: topoCabecalho,
                left: 0,
                zIndex: 4,
                width: LARGURA_NOME,
                minWidth: LARGURA_NOME,
                textAlign: "left",
                padding: "8px 12px",
                background: CORES.primaria,
                color: CORES.branco,
                fontSize: 11.5,
                fontWeight: 600,
                borderBottom: `1px solid ${CORES.borda}`,
              }}
            >
              Funcionário
            </th>

            {dias.map((dia) => {
              const comAlerta = diasComAlerta.has(dia.numero);
              const domingo = dia.diaSemana === 0;
              const fundo = comAlerta ? "#DC2626" : domingo ? CORES.domingo : "#F7F8FC";
              const cor = comAlerta || domingo ? CORES.branco : CORES.label;

              return (
                <th
                  key={dia.numero}
                  style={{
                    position: "sticky",
                    top: topoCabecalho,
                    zIndex: 3,
                    width: LARGURA_DIA,
                    minWidth: LARGURA_DIA,
                    padding: "6px 2px",
                    background: fundo,
                    color: cor,
                    borderBottom: `1px solid ${CORES.borda}`,
                    borderLeft: `1px solid ${CORES.borda}`,
                  }}
                  title={
                    comAlerta
                      ? `Dia ${dia.numero} não atinge algum mínimo configurado`
                      : `Dia ${dia.numero} (${dia.abrev})`
                  }
                >
                  <span style={{ position: "relative", display: "block" }}>
                    {comAlerta ? (
                      <AlertTriangle
                        size={9}
                        style={{ position: "absolute", top: -3, right: 0 }}
                      />
                    ) : null}
                    <span style={{ display: "block", fontSize: 12.5, fontWeight: 700 }}>
                      {dia.numero}
                    </span>
                    <span style={{ display: "block", fontSize: 9.5, fontWeight: 600, opacity: 0.85 }}>
                      {dia.abrev}
                    </span>
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {funcionarios.map((funcionario, indice) => {
            const fundoLinha = indice % 2 === 0 ? CORES.branco : CORES.linhaAlternada;
            return (
              <tr key={funcionario.id}>
                <th
                  scope="row"
                  style={{
                    position: "sticky",
                    left: 0,
                    zIndex: 2,
                    width: LARGURA_NOME,
                    minWidth: LARGURA_NOME,
                    textAlign: "left",
                    padding: "6px 12px",
                    background: fundoLinha,
                    borderBottom: `1px solid ${CORES.borda}`,
                    borderRight: `1px solid ${CORES.borda}`,
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: 12.5,
                      color: CORES.texto,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: LARGURA_NOME - 24,
                    }}
                    title={funcionario.nome}
                  >
                    {funcionario.nome}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: 10.5,
                      fontWeight: 500,
                      color: CORES.textoSecundario,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: LARGURA_NOME - 24,
                    }}
                  >
                    {funcionario.funcao.toLowerCase()} {SIMBOLO_SEXO[funcionario.sexo] || ""}
                  </span>
                </th>

                {dias.map((dia) => {
                  const status = mapa[funcionario.id]?.[dia.numero] || "T";
                  const visual = STATUS[status] || STATUS.T;
                  const domingo = dia.diaSemana === 0;
                  return (
                    <td
                      key={dia.numero}
                      style={{
                        // Colunas de domingo ganham uma moldura rosa para se destacarem.
                        padding: domingo ? "0 3px" : 0,
                        background: domingo ? CORES.domingoFundo : fundoLinha,
                        borderBottom: `1px solid ${CORES.borda}`,
                        borderLeft: `1px solid ${CORES.borda}`,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => onAlternarStatus(funcionario.id, dia.numero)}
                        title={`${funcionario.nome} — dia ${dia.numero}: ${visual.rotulo} (clique para alternar)`}
                        style={{
                          width: "100%",
                          height: 38,
                          border: "none",
                          background: visual.fundo,
                          color: visual.texto,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {visual.sigla}
                      </button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
