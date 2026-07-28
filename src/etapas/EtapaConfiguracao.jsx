import { useCallback, useEffect, useMemo } from "react";
import { ArrowLeft, Wand2 } from "lucide-react";
import CardFeriados from "./config/CardFeriados";
import CardMinimoGeral from "./config/CardMinimoGeral";
import CardMinimoSetor from "./config/CardMinimoSetor";
import CardModoFolgas from "./config/CardModoFolgas";
import CardPeriodo from "./config/CardPeriodo";
import CardTipoEscala from "./config/CardTipoEscala";
import { botaoPrimario, botaoSecundario } from "../estilos";
import { DIAS_SEMANA } from "../constantes";
import { objetoSemana, setoresDaEquipe } from "../utils";

const SETOR_PADRAO = { simples: 0, avancado: false, porDia: objetoSemana(0) };

export default function EtapaConfiguracao({
  funcionarios,
  config,
  setConfig,
  onVoltar,
  onGerar,
}) {
  const setores = useMemo(() => setoresDaEquipe(funcionarios), [funcionarios]);

  const contagemPorSetor = useMemo(() => {
    const contagem = {};
    funcionarios.forEach((f) => {
      contagem[f.funcao] = (contagem[f.funcao] || 0) + 1;
    });
    return contagem;
  }, [funcionarios]);

  // Sugere um dia de folga para quem ainda nao tem, distribuindo a equipe em rodizio
  // pela semana. Escolhas ja feitas manualmente nunca sao sobrescritas.
  const sugerirFolgasFixas = useCallback(() => {
    setConfig((atual) => {
      const sugestoes = { ...atual.folgasFixas };
      funcionarios.forEach((funcionario, indice) => {
        if (sugestoes[funcionario.id] === undefined || sugestoes[funcionario.id] === "") {
          sugestoes[funcionario.id] = DIAS_SEMANA[indice % DIAS_SEMANA.length].valor;
        }
      });
      return { ...atual, folgasFixas: sugestoes };
    });
  }, [funcionarios, setConfig]);

  useEffect(() => {
    if (config.modoFolgas === "fixas") sugerirFolgasFixas();
  }, [config.modoFolgas, sugerirFolgasFixas]);

  function alterarCampo(campo, valor) {
    setConfig((atual) => ({ ...atual, [campo]: valor }));
  }

  function alterarMinimoGeral(dia, valor) {
    setConfig((atual) => ({ ...atual, minimoGeral: { ...atual.minimoGeral, [dia]: valor } }));
  }

  function atualizarSetor(setor, alteracao) {
    setConfig((atual) => {
      const anterior = atual.minimosSetor[setor] || SETOR_PADRAO;
      return {
        ...atual,
        minimosSetor: {
          ...atual.minimosSetor,
          [setor]: { ...anterior, ...alteracao(anterior) },
        },
      };
    });
  }

  function alterarSimples(setor, valor) {
    atualizarSetor(setor, () => ({ simples: valor }));
  }

  function alternarAvancado(setor) {
    // Ao ativar o modo avancado, os sete campos herdam o valor simples ja definido.
    atualizarSetor(setor, (anterior) =>
      anterior.avancado
        ? { avancado: false }
        : { avancado: true, porDia: objetoSemana(Number(anterior.simples) || 0) }
    );
  }

  function alterarPorDia(setor, dia, valor) {
    atualizarSetor(setor, (anterior) => ({ porDia: { ...anterior.porDia, [dia]: valor } }));
  }

  function selecionarModo(modo) {
    alterarCampo("modoFolgas", modo);
  }

  function alterarFolgaFixa(idFuncionario, dia) {
    setConfig((atual) => ({
      ...atual,
      folgasFixas: { ...atual.folgasFixas, [idFuncionario]: dia },
    }));
  }

  function adicionarFeriado(feriado) {
    setConfig((atual) => ({
      ...atual,
      feriados: [...atual.feriados, feriado].sort((a, b) => a.dia - b.dia),
    }));
  }

  function removerFeriado(feriado) {
    setConfig((atual) => ({
      ...atual,
      feriados: atual.feriados.filter(
        (item) => !(item.dia === feriado.dia && item.nome === feriado.nome)
      ),
    }));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <CardTipoEscala
        tipoEscala={config.tipoEscala}
        onSelecionar={(id) => alterarCampo("tipoEscala", id)}
      />

      <CardMinimoGeral minimoGeral={config.minimoGeral} onAlterar={alterarMinimoGeral} />

      <CardMinimoSetor
        setores={setores}
        contagemPorSetor={contagemPorSetor}
        minimosSetor={config.minimosSetor}
        onAlterarSimples={alterarSimples}
        onAlternarAvancado={alternarAvancado}
        onAlterarPorDia={alterarPorDia}
      />

      <CardPeriodo
        mes={config.mes}
        ano={config.ano}
        minDomingosHomens={config.minDomingosHomens}
        minDomingosMulheres={config.minDomingosMulheres}
        onAlterar={alterarCampo}
      />

      <CardModoFolgas
        modoFolgas={config.modoFolgas}
        folgasFixas={config.folgasFixas}
        funcionarios={funcionarios}
        onSelecionarModo={selecionarModo}
        onAlterarFolgaFixa={alterarFolgaFixa}
        onSugerirNovamente={sugerirFolgasFixas}
      />

      <CardFeriados
        feriados={config.feriados}
        onAdicionar={adicionarFeriado}
        onRemover={removerFeriado}
      />

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <button type="button" style={botaoSecundario} onClick={onVoltar}>
          <ArrowLeft size={16} />
          Voltar
        </button>
        <button type="button" style={botaoPrimario} onClick={onGerar}>
          <Wand2 size={16} />
          Gerar Escala
        </button>
      </div>
    </div>
  );
}
