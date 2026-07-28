import { useState } from "react";
import { ArrowRight, Pencil, Plus, Save, Trash2, Users, X } from "lucide-react";
import Badge from "../componentes/Badge";
import Campo from "../componentes/Campo";
import Cartao from "../componentes/Cartao";
import { CORES, botaoPrimario, botaoIcone, entrada, botaoDesabilitado } from "../estilos";
import { CORES_SEXO, SEXOS, TURNOS } from "../constantes";
import { coresFuncao, gerarId, iniciais } from "../utils";

const FORM_VAZIO = { nome: "", funcao: "", sexo: "Masculino", turno: "" };

export default function EtapaFuncionarios({ funcionarios, setFuncionarios, onAvancar }) {
  const [formulario, setFormulario] = useState(FORM_VAZIO);
  const [erro, setErro] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [confirmandoLimpeza, setConfirmandoLimpeza] = useState(false);

  const emEdicao = editandoId !== null;

  function alterar(campo, valor) {
    setFormulario((atual) => ({ ...atual, [campo]: valor }));
  }

  function confirmar() {
    const nome = formulario.nome.trim();
    const funcao = formulario.funcao.trim();

    if (!nome || !funcao) {
      setErro("Informe o nome e a função do funcionário para continuar.");
      return;
    }
    setErro("");

    if (emEdicao) {
      setFuncionarios((lista) =>
        lista.map((item) =>
          item.id === editandoId ? { ...item, nome, funcao, sexo: formulario.sexo, turno: formulario.turno } : item
        )
      );
      setEditandoId(null);
    } else {
      const base = gerarId(nome) || `funcionario-${Date.now()}`;
      let id = base;
      let sufixo = 2;
      while (funcionarios.some((item) => item.id === id)) {
        id = `${base}-${sufixo}`;
        sufixo += 1;
      }
      setFuncionarios((lista) => [
        ...lista,
        { id, nome, funcao, sexo: formulario.sexo, turno: formulario.turno },
      ]);
    }

    setFormulario(FORM_VAZIO);
  }

  function editar(funcionario) {
    setEditandoId(funcionario.id);
    setErro("");
    setFormulario({
      nome: funcionario.nome,
      funcao: funcionario.funcao,
      sexo: funcionario.sexo,
      turno: funcionario.turno || "",
    });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setFormulario(FORM_VAZIO);
    setErro("");
  }

  function remover(id) {
    setFuncionarios((lista) => lista.filter((item) => item.id !== id));
    if (id === editandoId) cancelarEdicao();
  }

  function limparTodos() {
    setFuncionarios([]);
    setConfirmandoLimpeza(false);
    cancelarEdicao();
  }

  function aoPressionarTecla(evento) {
    if (evento.key === "Enter") confirmar();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Cartao
        titulo="1. Funcionários"
        subtitulo="Cadastre a equipe que fará parte da escala. Nome e função são obrigatórios."
        icone={<Users size={16} />}
        acao={
          funcionarios.length > 0 ? (
            <BotaoLimparTudo
              quantidade={funcionarios.length}
              confirmando={confirmandoLimpeza}
              onPedirConfirmacao={() => setConfirmandoLimpeza(true)}
              onCancelar={() => setConfirmandoLimpeza(false)}
              onConfirmar={limparTodos}
            />
          ) : null
        }
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
          <Campo label="Nome do funcionário" flex="3 1 220px">
            <input
              style={entrada}
              type="text"
              placeholder="Ex.: Maria Souza Lima"
              value={formulario.nome}
              onChange={(e) => alterar("nome", e.target.value)}
              onKeyDown={aoPressionarTecla}
            />
          </Campo>

          <Campo label="Função / Cargo" flex="3 1 200px">
            <input
              style={entrada}
              type="text"
              placeholder="Ex.: Operador De Caixa"
              value={formulario.funcao}
              onChange={(e) => alterar("funcao", e.target.value)}
              onKeyDown={aoPressionarTecla}
            />
          </Campo>

          <Campo label="Sexo" flex="1 1 130px">
            <select
              style={entrada}
              value={formulario.sexo}
              onChange={(e) => alterar("sexo", e.target.value)}
              onKeyDown={aoPressionarTecla}
            >
              {SEXOS.map((sexo) => (
                <option key={sexo} value={sexo}>
                  {sexo}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Turno" flex="1 1 140px">
            <select
              style={entrada}
              value={formulario.turno}
              onChange={(e) => alterar("turno", e.target.value)}
              onKeyDown={aoPressionarTecla}
            >
              {TURNOS.map((turno) => (
                <option key={turno.valor} value={turno.valor}>
                  {turno.rotulo}
                </option>
              ))}
            </select>
          </Campo>

          <button type="button" style={botaoPrimario} onClick={confirmar}>
            {emEdicao ? <Save size={15} /> : <Plus size={16} />}
            {emEdicao ? "Salvar" : "Adicionar"}
          </button>
        </div>

        {erro ? (
          <p style={{ margin: "10px 0 0", fontSize: 12.5, color: CORES.erro, fontWeight: 500 }}>
            {erro}
          </p>
        ) : null}

        {emEdicao ? (
          <button
            type="button"
            onClick={cancelarEdicao}
            style={{
              marginTop: 10,
              padding: 0,
              border: "none",
              background: "none",
              color: CORES.info,
              fontSize: 12.5,
              fontWeight: 600,
              textDecoration: "underline",
            }}
          >
            Cancelar edição
          </button>
        ) : null}

        <div style={{ marginTop: 18, borderTop: `1px solid ${CORES.borda}`, paddingTop: 6 }}>
          {funcionarios.length === 0 ? (
            <p
              style={{
                margin: 0,
                padding: "28px 0",
                textAlign: "center",
                fontSize: 13,
                color: CORES.textoSecundario,
              }}
            >
              Nenhum funcionário cadastrado ainda.
            </p>
          ) : (
            funcionarios.map((funcionario) => (
              <LinhaFuncionario
                key={funcionario.id}
                funcionario={funcionario}
                emEdicao={funcionario.id === editandoId}
                onEditar={() => editar(funcionario)}
                onRemover={() => remover(funcionario.id)}
              />
            ))
          )}
        </div>

        <footer
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: `1px solid ${CORES.borda}`,
            fontSize: 12.5,
            color: CORES.textoSecundario,
          }}
        >
          {funcionarios.length} funcionário(s) cadastrado(s)
        </footer>
      </Cartao>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={onAvancar}
          disabled={funcionarios.length === 0}
          style={{
            ...botaoPrimario,
            ...(funcionarios.length === 0 ? botaoDesabilitado : {}),
          }}
        >
          Avançar para Configuração
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

/**
 * Limpeza da lista inteira. Como a acao nao tem desfazer e o estado nao e
 * persistido, exige confirmacao em dois passos no proprio lugar do botao.
 */
function BotaoLimparTudo({ quantidade, confirmando, onPedirConfirmacao, onCancelar, onConfirmar }) {
  const botaoCompacto = {
    height: 32,
    padding: "0 12px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  };

  if (!confirmando) {
    return (
      <button
        type="button"
        onClick={onPedirConfirmacao}
        style={{
          ...botaoCompacto,
          border: `1px solid ${CORES.bordaInput}`,
          background: CORES.branco,
          color: CORES.label,
        }}
      >
        <Trash2 size={14} />
        Limpar todos os funcionários
      </button>
    );
  }

  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        flexWrap: "wrap",
        gap: 8,
        marginLeft: "auto",
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 600, color: CORES.erro }}>
        Remover os {quantidade} funcionários?
      </span>
      <button
        type="button"
        onClick={onConfirmar}
        style={{
          ...botaoCompacto,
          border: `1px solid ${CORES.erro}`,
          background: CORES.erro,
          color: CORES.branco,
        }}
      >
        <Trash2 size={14} />
        Sim, limpar tudo
      </button>
      <button
        type="button"
        onClick={onCancelar}
        style={{
          ...botaoCompacto,
          border: `1px solid ${CORES.bordaInput}`,
          background: CORES.branco,
          color: CORES.label,
        }}
      >
        Cancelar
      </button>
    </span>
  );
}

function LinhaFuncionario({ funcionario, emEdicao, onEditar, onRemover }) {
  const cores = coresFuncao(funcionario.funcao);
  const coresSexo = CORES_SEXO[funcionario.sexo] || CORES_SEXO.Masculino;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10,
        padding: "10px 10px",
        marginTop: 8,
        borderRadius: 10,
        border: `1px solid ${emEdicao ? CORES.edicaoBorda : "transparent"}`,
        background: emEdicao ? CORES.edicaoFundo : "transparent",
      }}
    >
      <span
        style={{
          width: 34,
          height: 34,
          borderRadius: 999,
          background: CORES.selecionado,
          color: CORES.primaria,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {iniciais(funcionario.nome)}
      </span>

      <span
        style={{
          flex: "2 1 180px",
          minWidth: 0,
          fontSize: 13.5,
          fontWeight: 600,
          color: CORES.texto,
        }}
      >
        {funcionario.nome}
      </span>

      <span style={{ display: "flex", flexWrap: "wrap", gap: 6, flex: "3 1 260px" }}>
        <Badge texto={funcionario.funcao} fundo={cores.fundo} cor={cores.texto} />
        <Badge texto={funcionario.sexo} fundo={coresSexo.fundo} cor={coresSexo.texto} />
        {funcionario.turno ? (
          <Badge texto={funcionario.turno} fundo="#F1F3F8" cor={CORES.label} />
        ) : null}
      </span>

      <span style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
        <button
          type="button"
          onClick={onEditar}
          title={`Editar ${funcionario.nome}`}
          aria-label={`Editar ${funcionario.nome}`}
          style={botaoIcone}
        >
          <Pencil size={14} />
        </button>
        <button
          type="button"
          onClick={onRemover}
          title={`Remover ${funcionario.nome}`}
          aria-label={`Remover ${funcionario.nome}`}
          style={{ ...botaoIcone, color: CORES.erro }}
        >
          <X size={15} />
        </button>
      </span>
    </div>
  );
}
