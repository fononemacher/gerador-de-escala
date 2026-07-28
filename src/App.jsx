import { useEffect, useState } from "react";
import Cabecalho from "./componentes/Cabecalho";
import Stepper from "./componentes/Stepper";
import EtapaConfiguracao from "./etapas/EtapaConfiguracao";
import EtapaEscala from "./etapas/EtapaEscala";
import EtapaFuncionarios from "./etapas/EtapaFuncionarios";
import { ANOS, FUNCIONARIOS_INICIAIS } from "./constantes";
import { CORES, FONTE } from "./estilos";
import { gerarEscala } from "./logica/gerarEscala";
import { objetoSemana } from "./utils";

const hoje = new Date();
const ANO_INICIAL = ANOS.includes(hoje.getFullYear()) ? hoje.getFullYear() : ANOS[0];

const CONFIG_INICIAL = {
  tipoEscala: "6x1",
  minimoGeral: objetoSemana(0),
  minimosSetor: {},
  mes: hoje.getMonth(),
  ano: ANO_INICIAL,
  minDomingosHomens: 0,
  minDomingosMulheres: 0,
  modoFolgas: "rotativas",
  folgasFixas: {},
  feriados: [],
};

/** Estado global da aplicacao vive aqui e desce por props. Nada e persistido. */
export default function App() {
  const [etapa, setEtapa] = useState(1);
  const [funcionarios, setFuncionarios] = useState(FUNCIONARIOS_INICIAIS);
  const [config, setConfig] = useState(CONFIG_INICIAL);
  const [escala, setEscala] = useState(null);

  // Cada etapa comeca do topo — caso contrario os avisos do inicio da pagina
  // passam despercebidos ao vir de uma etapa longa.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [etapa]);

  function gerar() {
    const { dias, mapa } = gerarEscala({
      funcionarios,
      tipoEscala: config.tipoEscala,
      mes: config.mes,
      ano: config.ano,
      modoFolgas: config.modoFolgas,
      folgasFixas: config.folgasFixas,
      minDomingosHomens: config.minDomingosHomens,
      minDomingosMulheres: config.minDomingosMulheres,
      feriados: config.feriados,
    });

    setEscala({ dias, mapa, tipoEscala: config.tipoEscala, mes: config.mes, ano: config.ano });
    setEtapa(3);
  }

  return (
    <div style={{ minHeight: "100vh", background: CORES.fundo, fontFamily: FONTE }}>
      <Cabecalho />

      <main
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "20px 16px 48px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <Stepper etapaAtual={etapa} escalaGerada={Boolean(escala)} onIr={setEtapa} />

        {etapa === 1 ? (
          <EtapaFuncionarios
            funcionarios={funcionarios}
            setFuncionarios={setFuncionarios}
            onAvancar={() => setEtapa(2)}
          />
        ) : null}

        {etapa === 2 ? (
          <EtapaConfiguracao
            funcionarios={funcionarios}
            config={config}
            setConfig={setConfig}
            onVoltar={() => setEtapa(1)}
            onGerar={gerar}
          />
        ) : null}

        {etapa === 3 && escala ? (
          <EtapaEscala
            escala={escala}
            setEscala={setEscala}
            funcionarios={funcionarios}
            config={config}
            onVoltar={() => setEtapa(2)}
          />
        ) : null}
      </main>
    </div>
  );
}
