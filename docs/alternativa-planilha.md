# Alternativa: a planilha como estado do sistema

Avaliação de uma variante de arquitetura para a Fase 1, com escopo e esforço revisados.

**Documentos relacionados**: [`requisitos.md`](./requisitos.md) · [`estimativa.md`](./estimativa.md)

---

## 1. A proposta

Em vez de o sistema guardar equipe, configuração e escalas em banco de dados, **a planilha carrega todo o estado**. O sistema deixa de ser um lugar onde os dados moram e passa a ser um processador: recebe um arquivo, gera a escala, devolve outro arquivo.

O ciclo mensal fica assim:

1. O usuário preenche a equipe e a configuração numa planilha (a primeira vez, a partir de um modelo em branco).
2. Sobe o arquivo no sistema.
3. O sistema lê, valida, gera a escala e devolve **uma nova planilha** contendo a escala **e** os dados que a originaram.
4. No mês seguinte o usuário abre essa mesma planilha, ajusta o que mudou — quem entrou, quem saiu, quem está de férias — troca o mês e sobe de novo.

A saída de um mês é a entrada do mês seguinte. O arquivo do cliente é o histórico dele.

---

## 2. Por que preserva o modelo de negócio

Esta é a diferença decisiva em relação à ideia de fazer tudo dentro do Excel com macros:

**A geração continua atrás da porta que a Kepha controla.** O cliente só obtém a escala subindo o arquivo no sistema. Controle de acesso, licenciamento e cobrança por CNPJ continuam viáveis — que é exatamente o que uma planilha autônoma destruiria, transformando um produto recorrente em venda única.

Há ainda um ganho jurídico relevante: **sem dados pessoais armazenados no servidor**, a superfície de LGPD encolhe muito. Se o processamento for transitório — lê, gera, devolve, descarta — a Kepha deixa de ser guardiã dos dados dos funcionários dos clientes dos seus clientes.

---

## 3. Escopo e esforço revisados

| Bloco | Original | Revisado | O que muda |
| --- | ---: | ---: | --- |
| 0 · Fundação | 40–64 | 24–36 | Sem banco e sem migrations; permanecem hospedagem, deploy e ambientes |
| 1 · Acesso e multiempresa | 48–72 | 8–20 | Vira um portão de acesso; some o isolamento de dados por empresa |
| 2 · Equipe | 48–68 | 30–45 | Somem as telas de cadastro; **leitor e validação ganham peso** |
| 3 · Configuração | 60–88 | 25–40 | As regras continuam; as telas e a persistência somem |
| 4 · Ausências | 76–108 | 25–40 | Viram colunas da planilha, lidas na geração |
| 5 · Motor | 72–108 | **72–108** | **Intacto** |
| 6 · Alertas e recomendações | 44–64 | 40–60 | Praticamente igual |
| 7 · Escala: salvar, estados, auditoria | 44–64 | **0** | A planilha é o histórico |
| 8 · Saída | 20–28 | 30–45 | **Cresce**: a planilha vira o artefato central e precisa ser re-importável |
| 9 · Testes, QA e homologação | 92–140 | 60–95 | Superfície menor, mas o round-trip exige teste pesado |
| | **544–804** | **314–489** | |
| Gestão e coordenação (10–15%) | 55–120 | 31–73 | |
| **Total** | **~600–925** | **~345–560** | **redução de cerca de 40%** |

**Calendário**: 2 a 3,5 meses com um desenvolvedor (contra 4 a 6); 1,5 a 2 meses com dois.

A estimativa mantém a mesma confiança de ±30% da original, pelos mesmos motivos — as perguntas em aberto da §8 do `requisitos.md` continuam em aberto.

---

## 4. Especificação da pasta de trabalho

Uma única pasta de trabalho, que é saída de um mês e entrada do seguinte.

### Abas de entrada — o usuário edita

**`Equipe`**

| Coluna | Conteúdo | Observação |
| --- | --- | --- |
| ID | Identificador estável | Gerado pelo sistema. **Não editar.** |
| Nome | Nome completo | |
| Setor | Função/setor | Normalizado pelo sistema |
| Sexo | M ou F | Usado na regra de domingos da convenção |
| Turno | Manhã, Tarde, Noite, Integral | Registrado, sem efeito na geração da Fase 1 |
| Situação | Ativo, Férias, Afastado, Desligado | |
| Ausência de | Data inicial | Obrigatória se a situação não for Ativo |
| Ausência até | Data final | |
| Folga fixa | Segunda a Sábado | Usada apenas quando o modo de folgas é "fixas" |

**`Configuração`** — pares de chave e valor: mês, ano, modelo de escala, modo de folgas, mínimo de domingos de folga para homens e para mulheres. Abaixo, um bloco de feriados com dia e nome.

**`Mínimos`**

| Setor | Turno | Seg | Ter | Qua | Qui | Sex | Sáb | Dom |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Uma linha por setor, mais uma linha especial `Equipe total` para o mínimo geral. A coluna **Turno** já existe preenchida com `Todos` — é a preparação de arquitetura descrita em `requisitos.md` §7.3, que torna a inclusão futura de turnos uma questão de acrescentar linhas, não de mudar o formato.

### Abas de saída — o sistema escreve

| Aba | Conteúdo |
| --- | --- |
| `Escala` | A grade: uma linha por funcionário, uma coluna por dia |
| `Resumo` | Totais por funcionário, em fórmula viva |
| `Cobertura` | Trabalhando por dia, total e por setor, em fórmula viva |
| `Alertas` | Tipo, alvo, dia, situação e recomendação de correção |
| `Instruções` | O que editar e o que não tocar |
| `_meta` (oculta) | Versão do formato, data de geração, mês de referência e verificação de integridade |

`Resumo` e `Cobertura` em fórmula — e não em valores — já foi validado na prática: a planilha gerada nesta sessão usa `COUNTIF`, `COUNTIFS`, `SUMPRODUCT` e uma coluna auxiliar de sequência corrida, e recalcula sozinha quando uma célula da escala é editada à mão.

---

## 5. Regras do round-trip

- **O sistema lê**: `Equipe`, `Configuração`, `Mínimos` e os **últimos dias da aba `Escala`**.
- **O sistema escreve**: todas as abas.
- **O usuário edita**: apenas as três abas de entrada.

Ler o fim da escala anterior resolve de graça um requisito que, no modelo com banco, exigia consulta ao histórico: **não emendar sequência de trabalho na virada do mês** (RF-39).

### Validações obrigatórias na leitura

A qualidade destas mensagens define o volume de suporte. Cada erro deve apontar aba, linha e coluna.

- ID ausente, duplicado ou desconhecido
- Nome ou setor em branco
- Sexo fora de M/F; situação fora da lista
- Ausência com data final anterior à inicial, ou fora do mês de referência
- Mês, ano ou modelo de escala inválidos
- Modo "fixas" com funcionário sem folga fixa definida
- Mínimo exigido maior que o tamanho do setor
- Versão do formato desconhecida

O diagnóstico de viabilidade já existente (`src/logica/viabilidade.js`) cobre a última verificação e vai além dela, apontando quantas pessoas seriam necessárias e qual o mínimo sustentável.

---

## 6. Riscos e mitigação

| Risco | Mitigação |
| --- | --- |
| **O formato de saída vira contrato de dados.** Toda mudança futura precisa ler os arquivos antigos. | Número de versão na aba `_meta` desde a primeira entrega, e migração na leitura |
| **Excel é hostil como entrada**: célula mesclada, data virando texto, espaço no fim do nome, linha inserida no meio. | Leitor tolerante e validação barulhenta. É o item onde não vale cortar orçamento. |
| **"O arquivo não carrega" vira o chamado de suporte nº 1.** | Mensagens acionáveis com aba, linha e coluna, e um botão de baixar modelo em branco |
| **Identificação por nome quebra em silêncio.** Já reproduzido em teste: um nome digitado com uma palavra a menos deixou o funcionário sem folga fixa, com 5 dias a mais de trabalho que os colegas e **nenhum alerta**. | Coluna de ID estável, gerada pelo sistema, com aviso explícito de não editar |
| **Se o cliente perde o arquivo, perdeu o histórico.** Não há backup. | Guardar as últimas gerações no servidor por alguns dias — reintroduz um armazenamento mínimo, mas temporário |
| **Duas pessoas editando cópias diferentes divergem** sem ninguém perceber. | Aceitável para empresa pequena; precisa estar escrito no contrato |

### O que esta alternativa não resolve

Não há histórico centralizado, não há acesso simultâneo, não há trilha de auditoria e não há backup do lado da Kepha. São requisitos que o cliente levantou na reunião e que aqui deixam de ser atendidos — a troca é consciente, em favor de prazo e custo.

---

## 7. O que não muda

Motor, os três níveis de alerta, o diagnóstico de viabilidade e a exportação em PDF permanecem iguais. A **qualidade da escala não é afetada** por esta decisão de arquitetura: ela depende do bloco 5, que fica intacto, e da prova de conceito da busca local recomendada em `estimativa.md` §3.

---

## 8. Caminho de evolução

Não é beco sem saída. Se o produto crescer e passar a exigir banco de dados, **o formato da planilha vira o importador**: os clientes migram subindo o último arquivo gerado. É degrau, não desvio.

Há ainda convergência com o agente de WhatsApp, que já foi desenhado para produzir um bloco de texto com o estado inteiro da escala. É a mesma ideia em outro formato — o agente pode passar a gerar a planilha diretamente, em vez de as duas frentes competirem.

---

## 9. Decisão

A adoção desta alternativa depende de aceitar explicitamente a troca:

**Ganha-se** cerca de 40% do prazo e do custo, uma superfície de LGPD muito menor e um caminho de venda mais rápido.

**Perde-se** histórico centralizado, auditoria, acesso simultâneo e backup — com o risco operacional transferido para o cuidado do cliente com o próprio arquivo.

Para o porte de cliente descrito na reunião — empresas de 5 a 65 colaboradores, uma pessoa por empresa montando a escala uma vez por mês — a troca parece favorável. Para um grupo com várias lojas e mais de um gestor, menos.
