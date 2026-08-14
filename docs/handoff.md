# Handoff — Gerador de Escalas de Trabalho

Estado do projeto em **12/08/2026**, para continuação em outra sessão.

---

## 1. O que é

Aplicação React de página única que monta escalas mensais de funcionários no varejo (supermercado), considerando folgas, domingos, feriados e cobertura mínima por setor. Nasceu como protótipo, foi aprovada pelo cliente e agora existe um levantamento de requisitos e uma estimativa para transformá-la em produto.

Há duas frentes vivas em paralelo:

- **Técnica** — o protótipo neste repositório.
- **Comercial** — proposta de parceria entre a **Kepha** (desenvolve) e o **Grupo CRK** (carteira de clientes contábeis, conhecimento de folha).

---

## 2. Onde está cada coisa

### Repositório

| Caminho | Conteúdo |
| --- | --- |
| `src/` | Aplicação React + Vite (JavaScript, sem TypeScript) |
| `src/logica/` | Motor e conferências: `gerarEscala.js`, `alertas.js`, `viabilidade.js`, `jornada.js`, `documentoEscala.js` |
| `docs/requisitos.md` | Levantamento de requisitos completo, já revisado com a reunião e as decisões posteriores |
| `docs/estimativa.md` | Estimativa de esforço da Fase 1 (600–925h) |
| `docs/alternativa-planilha.md` | Variante de arquitetura em avaliação: a planilha carrega o estado, sem banco de dados (345–560h) |
| `README.md` | Instalação, uso, alertas, limite de dias consecutivos, distribuição de domingos, PDF |

**Branch**: todo o trabalho está na **`main`**, tip `4f59113`.

> **Atenção**: existe uma branch remota obsoleta `claude/gerador-escalas-trabalho-d1h5ly`, parada em `bb70a65` (commit inicial). O dono do repositório quer excluí-la e não consegui fazer isso por aqui (o push de exclusão falha com `send-pack: unexpected disconnect` e não há ferramenta de remoção de branch disponível). Um *stop hook* desta sessão compara contra essa branch e reporta "commits não enviados" a cada rodada — **é falso positivo**; não faça push para ela.

### Fora do repositório (perdidos ao encerrar a sessão)

Estes artefatos foram entregues ao usuário como arquivo, mas **os scripts que os geram estão no scratchpad e não sobrevivem**:

| Artefato | Observação |
| --- | --- |
| Proposta comercial `.docx` V1.0 e V1.1 | Gerada a partir do arquivo de referência da Kepha, preservando capa, cabeçalho, estilos e fontes |
| `Escala_Agosto_2026.xlsx` | Escala dos 30 pré-cadastrados, com abas Escala, Resumo e Cobertura |
| Parser do bloco `###ESCALA-INICIO###` | Converte a saída do agente de WhatsApp em `funcionarios` + `config` |
| Scripts de teste com Playwright | Verificação do app e da paginação do PDF |

Se algum deles precisar ser regerado com frequência, **vale versionar os scripts** antes de fechar a sessão.

---

## 3. Estado do código

### Funciona e está testado

- Geração em 6 modelos (6×1, 6×2, 5×2, 5×1, 12×36, espanhola), respeitando o teto de dias consecutivos do ciclo — **24/24 combinações testadas**.
- Distribuição espaçada dos domingos de folga por grupo de sexo.
- Três níveis de alerta: cobertura (vermelho), viabilidade (âmbar), jornada (vermelho).
- Diagnóstico de viabilidade com limite superior de melhor caso — **nunca acusa falso positivo**.
- Edição manual das células reconferindo o teto de dias consecutivos.
- PDF: uma semana por página (domingo a sábado), quebra por volume de equipe, feriados marcados, páginas de resumo. Paginação verificada contando páginas reais do PDF, não `<section>`.
- 30 funcionários pré-cadastrados em `src/constantes.js`.

### Defeitos abertos

| # | Defeito | Situação |
| --- | --- | --- |
| D1 | **Funcionário adicionado depois da geração** aparece na tabela como se trabalhasse todos os dias (`mapa[id]?.[dia] \|\| "T"`), mas os alertas o contam como não trabalhando (`undefined` → false). Tabela e alertas discordam. | Identificado e reproduzido. Nunca foi pedido para corrigir. |
| D2 | **A edição manual não confere os mínimos de domingo.** O teto de dias consecutivos já é reconferido a cada clique; a regra dos domingos não. | Irmão do defeito já corrigido em `48a2363`. |

### Detalhes do motor que custaram trabalho a estabelecer

- `maxDiasSeguidos(ciclo)` duplica o ciclo para contar a sequência que atravessa a virada.
- `limitarDiasSeguidos` roda como **passo final** da geração. Dois casos furam o ciclo: domingo de trabalho obrigatório no meio da sequência, e o modo "fixas" que só folga no dia escolhido.
- Quando o dia excedente é um domingo já definido pela regra dos domingos, a folga **recua um dia**, para não desfazer a distribuição dominical.
- Nas folgas rotativas o ciclo caminha com o calendário (`ciclo[(indice + dia - 1) % ciclo.length]`). Uma tentativa anterior de fazer o ciclo pular domingos foi revertida: inflava as folgas para 7–8 por mês.

---

## 4. Contexto comercial

### Reunião de 05/08/2026 (Grupo CRK + Kepha)

Transcrição automática, com ruído e atribuição de falas errada em vários trechos — tratar citações com cautela. O que ficou estabelecido está em `docs/requisitos.md` §10 (registro de decisões).

**Achado mais importante**: o **turno é definido em contrato** e só muda na virada do mês. Isso significa que o motor nunca escolhe quem trabalha de manhã ou de tarde — a equipe se **particiona** por turno e o motor roda igual em cada partição. É o que mantém a inclusão de turnos barata, e derrubou a necessidade de um solver.

**Números de mercado coletados** (ver `docs/requisitos.md` §6): concorrência real são sistemas de cartão-ponto; escala montada à mão custa R$ 250/h e leva até 2h — até R$ 500 por cliente, por mês.

### Modelo de negócio proposto

Dois cenários, ambos na proposta `.docx`:

| | Cenário 1 | Cenário 2 |
| --- | --- | --- |
| Custo de desenvolvimento | CRK parcela menor · Kepha parcela maior | 50% · 50% |
| Recuperação do investimento | 100% da receita à Kepha até quitar | Não existe |
| Divisão no regime | 50% · 50% | CRK com a fatia maior |

Valores todos "a definir" — o modelo de negócio ainda está sendo fechado.

### Ajustes pendentes na proposta

- `[NOME DO DESTINATÁRIO]` na capa.
- `[A CONFIRMAR]` na tabela de responsabilidades (assumido que o CRK executa implantação e treinamento).
- `CRK [%] · Kepha [%]` no Cenário 2.
- Nome comercial do produto (hoje: "Sistema de Gestão de Escalas").
- **Data da proposta está 10/08/2026; hoje é 12/08.**
- Cidade: usei "Dois Vizinhos" (endereço da Kepha); a proposta de referência usava Curitiba.

---

## 5. Agente de IA no WhatsApp

Roteiro de conversa e prompt de sistema completos foram redigidos (10 fases, regras de áudio, regras invioláveis). **Não estão versionados** — estão apenas no histórico da conversa.

A saída do agente é um bloco de texto colável:

```
###ESCALA-INICIO###
LOJA / MES / ESCALA / FOLGAS / DOMINGOS-FOLGA-HOMENS / DOMINGOS-FOLGA-MULHERES
EQUIPE:        <nome> | <setor> | <M ou F>
MINIMO-GERAL:  Seg <n> | ... | Dom <n>
MINIMO-SETOR:  <setor> | <n>   ou   <setor> | Seg <n> | ...
FOLGA-FIXA:    <nome> | <Segunda a Sábado>
FERIADOS:      <dia> | <nome>
###ESCALA-FIM###
```

**Teste de round-trip já executado.** O formato carrega todos os 10 campos de `config` sem perda. Três falhas apareceram, todas no roteiro do agente, não no formato:

1. Setor de uma pessoa só com mínimo diário é sempre inviável — o agente precisa dessa aritmética antes de fechar o bloco.
2. Nome em `FOLGA-FIXA` divergente da `EQUIPE` falha em silêncio: a pessoa fica sem dia fixo e trabalha até o limitador agir, sem nenhum alerta.
3. O agente entregou bloco com mínimo de domingo impossível — dá para checar na conversa.

---

## 6. Peculiaridades do ambiente

| Item | Situação |
| --- | --- |
| **LibreOffice** | **Quebrado.** Não carrega arquivo nenhum, nem `.txt`. Impede renderizar `.docx` para conferência visual e impede o `recalc.py` de calcular fórmulas de `.xlsx`. Verificação teve que ser feita por inspeção direta do XML e do pacote. |
| **Assinatura de commits** | O assinador (`gpg.ssh.program` → `/tmp/code-sign`) não emite assinatura. `--amend --reset-author` e `--amend -S` saem ambos `sig=N`. Não repetir o procedimento: só reescreve hashes já publicados. |
| **Playwright** | Funciona. Importar como `import pw from "..."; const { chromium } = pw;` — o named export falha. |
| **esbuild** | Usado para empacotar os módulos ESM do app e rodar a lógica sob Node nos testes. |
| **Google Fonts** | Bloqueado pela rede do sandbox — gera `ERR_CONNECTION_RESET` no console. Pré-existente, inofensivo. |

---

## 7. Próximos passos

### Bloqueando o orçamento

1. **Uma mesma empresa usa escalas diferentes por setor?** (açougue 6×1, administrativo 5×2). Levantado na reunião e **não respondido**. Define se RF-09 é MVP.
2. **Confirmar a premissa do turno contratual** com a especialista de folha.
3. **Quem hospeda a infraestrutura** — custo recorrente que entra na proposta.
4. **Prova de conceito da busca local do motor** (2 semanas). É a maior incerteza técnica e derruba boa parte do risco da estimativa.
5. **Decidir entre a arquitetura com banco de dados e a alternativa da planilha** (`docs/alternativa-planilha.md`). A segunda corta ~40% do prazo em troca de histórico centralizado, auditoria, acesso simultâneo e backup. A decisão muda o escopo inteiro e precisa vir antes do orçamento final.

### Insumos a coletar

5. **2 ou 3 escalas reais** montadas para clientes, do jeito que foram entregues. Melhor fonte de requisito disponível e ainda não pedida.
6. Retorno dos 3 clientes que estão testando o protótipo.

### Técnico, quando pedirem

7. Corrigir D1 e D2 (seção 3).
8. Versionar o parser do bloco do WhatsApp como "Importar bloco" na Etapa 1.
9. Versionar o prompt do agente de WhatsApp.

---

## 8. Como rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

Para exercitar a lógica fora do navegador, empacote os módulos com esbuild e importe sob Node — foi assim que os testes do motor, da paginação do PDF e do parser foram feitos.

---

## 9. Convenções do projeto

- JavaScript puro, sem TypeScript. Estilo via prop `style` (CSS-in-JS), sem Tailwind e sem biblioteca de UI.
- Todo o estado em `useState` no `App.jsx`, descendo por props. **Sem `localStorage`, `sessionStorage` ou qualquer armazenamento do navegador.**
- Sem `<form>` com submit nativo — apenas `onClick` / `onChange`.
- Nomes de variáveis e textos de interface em português.
- Comentários apenas onde a lógica não é óbvia — sobretudo na distribuição dos domingos e no limitador de dias seguidos.
