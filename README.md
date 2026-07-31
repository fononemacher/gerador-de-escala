# Gerador de Escalas de Trabalho

Aplicação web de página única para montar escalas mensais de funcionários no contexto de varejo/supermercado, considerando folgas, domingos, feriados e cobertura mínima por setor.

## Stack

- React 18 + Vite (JavaScript)
- Ícones: [lucide-react](https://lucide.dev/)
- Estilização com CSS-in-JS via prop `style` (sem Tailwind e sem bibliotecas de UI)
- Sem backend: todo o estado vive em memória (`useState`), sem `localStorage` ou `sessionStorage`

## Instalação

```bash
npm install
```

## Execução

```bash
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

Outros comandos:

```bash
npm run build     # gera a versão de produção em dist/
npm run preview   # serve o build de produção localmente
```

## Como usar

A aplicação tem 3 etapas, navegáveis pelo stepper no topo.

### 1. Funcionários

Cadastro da equipe (nome, função, sexo e turno opcional). A aplicação começa sem ninguém cadastrado — a equipe é montada pelo próprio usuário. É possível editar e remover registros; a edição carrega os dados de volta no formulário e atualiza o mesmo registro ao salvar.

O botão **Limpar todos os funcionários**, no topo do card, esvazia a lista inteira. Como não há desfazer nem persistência, ele pede confirmação em dois passos antes de apagar.

### 2. Configuração

Seis blocos de configuração:

1. **Tipo de escala** — 6×1, 6×2, 5×2, 5×1, 12×36 ou Espanhola. O modelo escolhido vale para toda a equipe.
2. **Mínimo geral por dia da semana** — quantas pessoas, somando todos os setores, precisam trabalhar em cada dia da semana (0 = sem exigência).
3. **Mínimo por setor** — um valor único por função ou, no modo **Avançado**, um valor para cada dia da semana (ex.: 3 operadores de caixa em dias úteis, 2 no fim de semana).
4. **Período e domingos** — mês, ano e o mínimo de domingos de folga por mês para homens e mulheres.
5. **Modo de folgas** — *rotativas* (as folgas variam a cada semana) ou *fixas na semana* (cada funcionário folga sempre no mesmo dia). No modo fixo o sistema sugere um dia para cada funcionário em rodízio, sem sobrescrever escolhas manuais. Independente do modo, os domingos de folga sempre oscilam.
6. **Feriados do mês** — dias que, quando caírem em dia de trabalho, aparecem como `FE` (Feriado Trabalhado).

### 3. Escala Gerada

Tabela com um dia por coluna e um funcionário por linha:

- Legenda e cabeçalho fixos no topo, coluna de funcionários fixa à esquerda
- Cada clique em uma célula alterna o status no ciclo `T → F → FE → FC → T`
- Banner de alertas listando os dias que não atingem os mínimos (por setor e geral)
- Painel âmbar de **viabilidade** quando a configuração é impossível de cumprir (ver abaixo)
- Filtro por setor e ordenação por nome ou por setor — o filtro afeta apenas a exibição; alertas, resumo e cobertura dominical continuam considerando toda a equipe
- Resumo da escala e cobertura de cada domingo do mês
- Botão **Gerar PDF** (ver abaixo)

### Status

| Status | Significado |
| --- | --- |
| `T` | Trabalho |
| `F` | Folga |
| `FE` | Feriado Trabalhado |
| `FC` | Folga Compensatória |

## PDF da escala

O botão **Gerar PDF**, na etapa 3, monta o documento e abre a caixa de impressão do navegador — o PDF sai pela opção *Salvar como PDF* (ou vai direto para a impressora, se a escala for para o quadro de avisos). Não há dependência de bibliotecas de PDF: o documento é HTML com CSS de impressão, o que mantém as cores e a identidade da tela.

Estrutura do documento (`src/logica/documentoEscala.js`):

- **Uma semana por página**, de domingo a sábado. Os dias que pertencem ao mês vizinho aparecem como colunas cinzas sem número, de modo que todas as páginas tenham as mesmas 7 colunas e fiquem alinhadas quando empilhadas.
- Equipes grandes rendem **várias páginas por semana** (20 funcionários por página), numeradas como "Página 1 de 2".
- Feriados ganham `*` no número do dia e a lista dos nomes no rodapé da página.
- **Páginas de resumo** ao final: os quatro cartões da tela, a tabela de totais por funcionário (dias trabalhados, folgas, feriados trabalhados, folgas em domingo e maior sequência de trabalho), a cobertura dominical e, quando existirem, os avisos de viabilidade, de jornada e de cobertura mínima.

A tabela do PDF respeita o filtro de setor e a ordenação escolhidos na tela — dá para imprimir só o açougue, por exemplo. Já os totais da equipe e a cobertura dominical continuam olhando todo mundo, como nos painéis.

## Alertas: dois níveis

Nem toda configuração tem solução — às vezes não existe arranjo de folgas que atenda aos mínimos definidos. A aplicação separa os dois casos:

| Painel | Quando aparece | O que significa |
| --- | --- | --- |
| **Âmbar — viabilidade** | Na etapa 2 (enquanto configura) e no topo da etapa 3 | Nenhuma combinação de folgas atenderia esses mínimos. É preciso mudar a configuração ou a equipe. |
| **Vermelho — cobertura** | Na etapa 3 | Dias específicos que ficaram abaixo do mínimo na escala gerada. Se não houver problema de viabilidade, é só desencaixe da rotação e dá para ajustar clicando nas células. |
| **Vermelho — jornada** | Na etapa 3, acima dos demais | Funcionários que passaram do teto de dias consecutivos de trabalho. Como a geração respeita o teto, isso normalmente vem da edição manual das células. Os dias em excesso ficam contornados em vermelho na tabela. |

O diagnóstico de viabilidade (`src/logica/viabilidade.js`) faz três verificações, sempre no **melhor cenário possível** — só acusa impossibilidade quando ela é matematicamente certa, nunca por suposição:

1. **Equipe insuficiente** — o mínimo exigido é maior que o número de pessoas do grupo.
2. **Domingos inviáveis** — as folgas dominicais obrigatórias derrubam a cobertura abaixo do mínimo do domingo.
3. **Capacidade do mês estourada** — a soma dos mínimos de todos os dias excede os dias-pessoa que a equipe consegue trabalhar. É o caso mais comum: cabe em cada dia isolado, mas não no mês, porque a folga semanal é um custo inescapável.

Exemplo real: 5 operadores de caixa com mínimo de 5 por dia em escala 6×1 num mês de 31 dias exige 155 dias-pessoa, mas 5 pessoas oferecem no máximo 135 — impossível. A mensagem informa quantos funcionários seriam necessários (6) e qual o mínimo sustentável com a equipe atual (4 por dia).

## Limite de dias consecutivos

Nenhum funcionário trabalha mais dias seguidos do que o ciclo escolhido permite: 5 no 5×2 e no 5×1, 6 no 6×1, 6×2 e na espanhola, 1 no 12×36. O teto sai do próprio ciclo (a maior sequência de `T`, considerando também a emenda entre um ciclo e o seguinte).

Dois pontos furavam o ciclo e por isso a regra é aplicada como passo final da geração, em `limitarDiasSeguidos`:

- um **domingo de trabalho obrigatório** entra no meio da sequência quando a folga do ciclo cairia justamente nele;
- o modo **fixas na semana** folga só no dia escolhido, o que daria 6 dias seguidos mesmo numa escala de 5.

Quando a sequência estoura, entra uma folga. Se o dia excedente for um domingo já definido pela regra dos domingos, a folga recua um dia, para não desfazer a distribuição dominical.

A edição manual das células não passa pela geração e por isso poderia furar esse teto sem aviso. Para cobrir isso, `src/logica/jornada.js` reconfere o limite sobre a escala como ela está na tela — a qualquer clique — e alimenta o banner de jornada e o contorno vermelho das células em excesso.

## Distribuição dos domingos

As folgas dominicais são espaçadas ao longo do mês, evitando domingos consecutivos: divide-se o total de domingos pelo mínimo configurado para obter o passo entre uma folga e a seguinte, e aplica-se um deslocamento derivado da posição do funcionário dentro do grupo do mesmo sexo — assim, colegas folgam em domingos diferentes e a loja permanece coberta. A lógica está em `src/logica/gerarEscala.js`.

## Estrutura do projeto

```
src/
  App.jsx                     estado global da aplicação e navegação entre etapas
  constantes.js               dados iniciais, tipos de escala, status e paletas
  estilos.js                  cores e estilos base compartilhados
  utils.js                    helpers (slug, iniciais, cores por função, dias do mês)
  componentes/                Campo, Badge, Legenda, ResumoCard, Cartao, Cabecalho, Stepper, EntradaNumero
  etapas/
    EtapaFuncionarios.jsx
    EtapaConfiguracao.jsx     orquestra os 6 cards de configuração
    EtapaEscala.jsx
    config/                   cards da etapa 2
    escala/                   banner de alertas, tabela e cobertura dominical
  logica/
    gerarEscala.js            geração da escala do mês
    alertas.js                conferência de cobertura mínima
    jornada.js                teto de dias consecutivos sobre a escala atual
    viabilidade.js            diagnóstico de configuração impossível
    documentoEscala.js        documento de impressão (PDF) da escala
```
