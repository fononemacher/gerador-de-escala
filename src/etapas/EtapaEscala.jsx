import { useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, LayoutGrid, Sun, Users } from "lucide-react";
import BannerAlertas from "./escala/BannerAlertas";
import CoberturaDominical from "./escala/CoberturaDominical";
import TabelaEscala from "./escala/TabelaEscala";
import Campo from "../componentes/Campo";
import Cartao from "../componentes/Cartao";
import PainelViabilidade from "../componentes/PainelViabilidade";
import ResumoCard from "../componentes/ResumoCard";
import { CORES, botaoSecundario, entrada, tituloCartao } from "../estilos";
import { CICLO_STATUS, MESES, TIPOS_ESCALA } from "../constantes";
import { calcularAlertas, coberturaDominical } from "../logica/alertas";
import { analisarViabilidade } from "../logica/viabilidade";
import { ordenarPorNome, setoresDaEquipe } from "../utils";

export default function EtapaEscala({ escala, setEscala, funcionarios, config, onVoltar }) {
  const [filtroSetor, setFiltroSetor] = useState("todos");
  const [ordenacao, setOrdenacao] = useState("nome");

  const { dias, mapa } = escala;
  const modelo = TIPOS_ESCALA.find((tipo) => tipo.id === escala.tipoEscala) || TIPOS_ESCALA[0];
  const setores = useMemo(() => setoresDaEquipe(funcionarios), [funcionarios]);

  // Alertas e cobertura consideram sempre a equipe inteira — o filtro e apenas visual.
  const { lista: alertas, diasComAlerta } = useMemo(
    () =>
      calcularAlertas({
        dias,
        mapa,
        funcionarios,
        minimosSetor: config.minimosSetor,
        minimoGeral: config.minimoGeral,
      }),
    [dias, mapa, funcionarios, config.minimosSetor, config.minimoGeral]
  );

  const domingos = useMemo(
    () => coberturaDominical({ dias, mapa, funcionarios, diasComAlerta }),
    [dias, mapa, funcionarios, diasComAlerta]
  );

  // Explica por que certos dias ficaram em falta quando a exigencia era impossivel.
  const problemasDeViabilidade = useMemo(
    () => analisarViabilidade({ funcionarios, config }),
    [funcionarios, config]
  );

  const funcionariosExibidos = useMemo(() => {
    const filtrados =
      filtroSetor === "todos" ? funcionarios : funcionarios.filter((f) => f.funcao === filtroSetor);
    if (ordenacao === "setor") {
      return [...filtrados].sort(
        (a, b) =>
          a.funcao.localeCompare(b.funcao, "pt-BR") || a.nome.localeCompare(b.nome, "pt-BR")
      );
    }
    return ordenarPorNome(filtrados);
  }, [funcionarios, filtroSetor, ordenacao]);

  function alternarStatus(idFuncionario, dia) {
    setEscala((atual) => {
      const statusAtual = atual.mapa[idFuncionario]?.[dia] || "T";
      const proximo = CICLO_STATUS[(CICLO_STATUS.indexOf(statusAtual) + 1) % CICLO_STATUS.length];
      return {
        ...atual,
        mapa: {
          ...atual.mapa,
          [idFuncionario]: { ...atual.mapa[idFuncionario], [dia]: proximo },
        },
      };
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 style={{ ...tituloCartao, fontSize: 17 }}>
        3. Escala Gerada — {MESES[escala.mes]} {escala.ano} — {modelo.rotulo.toUpperCase()}
      </h2>

      <PainelViabilidade problemas={problemasDeViabilidade} contexto="escala" />

      <BannerAlertas alertas={alertas} configViavel={problemasDeViabilidade.length === 0} />

      <Cartao estilo={{ padding: 14 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
          <Campo label="Filtrar por setor" flex="2 1 220px">
            <select
              style={entrada}
              value={filtroSetor}
              onChange={(e) => setFiltroSetor(e.target.value)}
            >
              <option value="todos">Todos os setores</option>
              {setores.map((setor) => (
                <option key={setor} value={setor}>
                  {setor}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Ordenar por" flex="1 1 180px">
            <select style={entrada} value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)}>
              <option value="nome">Ordem alfabética</option>
              <option value="setor">Setor</option>
            </select>
          </Campo>

          <span
            style={{
              fontSize: 12.5,
              color: CORES.textoSecundario,
              marginLeft: "auto",
              paddingBottom: 12,
            }}
          >
            Exibindo {funcionariosExibidos.length} de {funcionarios.length} funcionário(s)
          </span>
        </div>
      </Cartao>

      <TabelaEscala
        dias={dias}
        funcionarios={funcionariosExibidos}
        mapa={mapa}
        diasComAlerta={diasComAlerta}
        onAlternarStatus={alternarStatus}
      />

      <div>
        <h3 style={{ ...tituloCartao, fontSize: 14, marginBottom: 10 }}>Resumo da Escala</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          <ResumoCard
            icone={<Users size={17} />}
            valor={funcionarios.length}
            rotulo="Funcionários na escala"
          />
          <ResumoCard icone={<CalendarDays size={17} />} valor={dias.length} rotulo="Dias no mês" />
          <ResumoCard
            icone={<LayoutGrid size={17} />}
            valor={modelo.rotulo}
            rotulo="Modelo da escala"
          />
          <ResumoCard icone={<Sun size={17} />} valor={domingos.length} rotulo="Domingos no mês" />
        </div>
      </div>

      <CoberturaDominical domingos={domingos} />

      <div>
        <button type="button" style={botaoSecundario} onClick={onVoltar}>
          <ArrowLeft size={16} />
          Voltar para Configuração
        </button>
      </div>
    </div>
  );
}
