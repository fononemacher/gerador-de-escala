import { Sliders } from "lucide-react";
import Badge from "../../componentes/Badge";
import Campo from "../../componentes/Campo";
import Cartao from "../../componentes/Cartao";
import EntradaNumero from "../../componentes/EntradaNumero";
import { CORES } from "../../estilos";
import { ABREV_DIAS, ORDEM_SEMANA } from "../../constantes";
import { coresFuncao } from "../../utils";

export default function CardMinimoSetor({
  setores,
  contagemPorSetor,
  minimosSetor,
  onAlterarSimples,
  onAlternarAvancado,
  onAlterarPorDia,
}) {
  return (
    <Cartao
      titulo="3. Mínimo de Funcionários por Setor"
      subtitulo="Defina quantas pessoas de cada função precisam estar trabalhando. Use o modo avançado para variar por dia da semana."
      icone={<Sliders size={16} />}
    >
      {setores.length === 0 ? (
        <p style={{ margin: 0, fontSize: 13, color: CORES.textoSecundario }}>
          Nenhum setor identificado. Cadastre funcionários na etapa 1.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {setores.map((setor) => {
            const cores = coresFuncao(setor);
            const config = minimosSetor[setor] || {};
            const avancado = Boolean(config.avancado);

            return (
              <div
                key={setor}
                style={{
                  border: `1px solid ${CORES.borda}`,
                  borderRadius: 10,
                  padding: 12,
                  background: avancado ? "#FAFBFE" : CORES.branco,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 10,
                  }}
                >
                  <Badge texto={setor} fundo={cores.fundo} cor={cores.texto} />
                  <span style={{ fontSize: 12, color: CORES.textoSecundario }}>
                    {contagemPorSetor[setor]} funcionário(s)
                  </span>

                  <span style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
                    <button
                      type="button"
                      onClick={() => onAlternarAvancado(setor)}
                      aria-pressed={avancado}
                      style={{
                        height: 32,
                        padding: "0 12px",
                        borderRadius: 8,
                        border: `1px solid ${avancado ? CORES.primaria : CORES.bordaInput}`,
                        background: avancado ? CORES.primaria : CORES.branco,
                        color: avancado ? CORES.branco : CORES.label,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      Avançado
                    </button>
                    <EntradaNumero
                      valor={config.simples ?? 0}
                      onChange={(valor) => onAlterarSimples(setor, valor)}
                      aria-label={`Mínimo de funcionários para ${setor}`}
                      estilo={{ width: 76 }}
                    />
                  </span>
                </div>

                {avancado ? (
                  <div
                    style={{
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: `1px dashed ${CORES.borda}`,
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(72px, 1fr))",
                      gap: 8,
                    }}
                  >
                    {ORDEM_SEMANA.map((dia) => (
                      <Campo key={dia} label={ABREV_DIAS[dia]}>
                        <EntradaNumero
                          valor={config.porDia?.[dia] ?? 0}
                          onChange={(valor) => onAlterarPorDia(setor, dia, valor)}
                          aria-label={`Mínimo de ${setor} em ${ABREV_DIAS[dia]}`}
                          estilo={{ height: 36 }}
                        />
                      </Campo>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </Cartao>
  );
}
