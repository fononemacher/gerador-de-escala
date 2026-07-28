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

Cadastro da equipe (nome, função, sexo e turno opcional). A aplicação já inicia com 30 funcionários pré-cadastrados. É possível editar e remover registros; a edição carrega os dados de volta no formulário e atualiza o mesmo registro ao salvar.

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
- Filtro por setor e ordenação por nome ou por setor — o filtro afeta apenas a exibição; alertas, resumo e cobertura dominical continuam considerando toda a equipe
- Resumo da escala e cobertura de cada domingo do mês

### Status

| Status | Significado |
| --- | --- |
| `T` | Trabalho |
| `F` | Folga |
| `FE` | Feriado Trabalhado |
| `FC` | Folga Compensatória |

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
```
