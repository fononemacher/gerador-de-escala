# Levantamento de Requisitos — Sistema de Gestão de Escalas

Documento de apoio à proposta comercial e ao repasse para a equipe técnica.

**Base**: protótipo funcional em React (este repositório), apresentado ao cliente e aprovado.

## Como ler este documento

Cada requisito traz uma marca de origem. Ela existe para que ninguém confunda o que o cliente já validou com o que ainda é suposição nossa:

| Marca | Significado |
| --- | --- |
| `[V]` | **Validado** — está no protótipo, o cliente viu funcionando e aprovou. |
| `[C]` | **Comprovado** — lacuna ou defeito que testamos e reproduzimos no protótipo. |
| `[?]` | **Inferido** — proposta nossa, a partir do domínio. **Precisa de confirmação do cliente antes de entrar no escopo.** |

Complexidade é relativa (Baixa / Média / Alta), para orientar o dimensionamento. Não são estimativas de esforço — essas cabem à equipe técnica depois que o escopo fechar.

> **Atenção ao volume de `[?]`.** A maior parte deste documento é inferência. O protótipo resolve um problema estreito e bem definido; um sistema de gestão de escalas é bem maior. Fechar preço antes de responder a seção "Perguntas em aberto" é assumir risco desnecessário.

---

## 1. Contexto

O protótipo monta a escala mensal de uma equipe de varejo/supermercado a partir de: lista de funcionários, modelo de escala, mínimos de cobertura por dia e por setor, domingos de folga e feriados. Ele gera a grade dia a dia, aponta os dias que ficam abaixo do mínimo, diagnostica configurações impossíveis e exporta em PDF.

É uma página única, sem backend, sem login e sem persistência: fechar o navegador descarta tudo. Isso foi decisão consciente de protótipo — e é o primeiro item que muda no sistema real.

### 1.1 O que o protótipo já provou

Vale registrar, porque reduz risco na proposta: o protótipo não é só uma tela bonita. Ele já resolve a parte difícil do domínio.

- Gera escalas em 6 modelos (6×1, 6×2, 5×2, 5×1, 12×36, espanhola), respeitando o teto de dias consecutivos de cada ciclo — testado nas 24 combinações de modelo × configuração.
- Distribui os domingos de folga de forma espaçada entre colegas do mesmo grupo, em vez de todo mundo folgar no mesmo domingo.
- **Diagnostica impossibilidade matemática antes de o usuário culpar o sistema.** Exemplo real do protótipo: 5 operadores de caixa com mínimo de 5 por dia em 6×1 num mês de 31 dias exigem 155 dias-pessoa, mas 5 pessoas oferecem no máximo 135. O sistema informa que seriam necessários 6 funcionários e que o mínimo sustentável é 4 por dia.

Esse diagnóstico é o diferencial do produto e deve ser preservado e ampliado. É o que separa "o sistema não conseguiu" de "não existe arranjo possível, e o motivo é este".

---

## 2. Limitações conhecidas do protótipo `[C]`

Todas verificadas em teste, não suposições. Entram como requisito no sistema real.

| # | Limitação | Impacto |
| --- | --- | --- |
| L1 | **Modelo de escala único para toda a equipe.** Não é possível ter o caixa em 6×1 e o administrativo em 5×2 na mesma geração. | Alto — é a limitação mais provável de aparecer no primeiro uso real. |
| L2 | **Turnos não afetam a escala.** O campo existe no cadastro, mas o motor e os alertas ignoram. A cobertura é contada por dia, não por turno. | Alto — uma loja com 3 turnos não consegue exprimir "2 caixas de manhã e 3 à tarde". |
| L3 | **Sem persistência.** Tudo em memória. | Alto — inviabiliza uso real. |
| L4 | **Funcionário incluído depois da geração** aparece na tabela como se trabalhasse todos os dias, mas os alertas o contam como não trabalhando. Tabela e alertas discordam. | Médio — dado incorreto na tela. |
| L5 | **A edição manual não confere os mínimos de domingo.** O teto de dias consecutivos já é reconferido a cada clique; a regra dos domingos não. | Médio |
| L6 | **Regerar a escala descarta as edições manuais.** Não há como travar uma célula ajustada à mão. | Médio — retrabalho garantido no uso mensal. |
| L7 | **Motor heurístico, não otimizador.** Aplica o ciclo, ajusta os domingos e conserta as sequências que estouram. Não busca a melhor solução — pode falhar em atender um mínimo mesmo quando existe arranjo válido. | Alto — ver seção 6.1, é a maior decisão técnica do projeto. |
| L8 | **Ausências não existem.** Férias, atestado, licença e afastamento não são representáveis. | Alto — nenhuma escala real sobrevive sem isso. |
| L9 | **Sem calendário de feriados.** O usuário digita um a um, todo mês. | Baixa |
| L10 | **Uma loja só.** Não há noção de filial, nem de funcionário que atende mais de uma. | A confirmar — depende do porte do cliente. |

---

## 3. Requisitos funcionais

### 3.1 Contas, lojas e acesso

| # | Requisito | Origem | Compl. | Fase |
| --- | --- | --- | --- | --- |
| RF-01 | Autenticação de usuários com e-mail e senha, recuperação de senha | `[?]` | Baixa | MVP |
| RF-02 | Perfis de acesso: administrador, gerente de loja, e (se houver) consulta para o funcionário | `[?]` | Média | MVP |
| RF-03 | Cadastro de empresa e de lojas/filiais; escalas pertencem a uma loja | `[?]` | Média | MVP |
| RF-04 | Gerente enxerga e edita apenas as lojas às quais tem acesso | `[?]` | Média | MVP |
| RF-05 | Funcionário alocado em mais de uma loja | `[?]` | Alta | Futuro |

### 3.2 Cadastro da equipe

| # | Requisito | Origem | Compl. | Fase |
| --- | --- | --- | --- | --- |
| RF-06 | Cadastro com nome, função/setor e sexo | `[V]` | Baixa | MVP |
| RF-07 | Edição e remoção de funcionário; limpar equipe inteira com confirmação | `[V]` | Baixa | MVP |
| RF-08 | Cadastro de turno do funcionário, **com efeito sobre a escala** | `[C]` L2 | Alta | MVP |
| RF-09 | Modelo de escala **por funcionário ou por setor**, não único para a equipe | `[C]` L1 | Alta | MVP |
| RF-10 | Dados trabalhistas: matrícula, data de admissão, carga horária contratual, CPF | `[?]` | Baixa | MVP |
| RF-11 | Importação da equipe por planilha (CSV/Excel) | `[?]` | Média | MVP |
| RF-12 | Funcionário inativo/desligado preservando o histórico de escalas | `[?]` | Média | Fase 2 |
| RF-13 | Preferências e restrições individuais (ex.: não pode fechar a loja, prefere folgar sábado) | `[?]` | Alta | Fase 2 |

### 3.3 Regras e configuração da escala

| # | Requisito | Origem | Compl. | Fase |
| --- | --- | --- | --- | --- |
| RF-14 | Modelos 6×1, 6×2, 5×2, 5×1, 12×36 e espanhola | `[V]` | — | MVP |
| RF-15 | Mínimo de cobertura por dia da semana, geral e por setor (modo simples e por dia) | `[V]` | — | MVP |
| RF-16 | Mínimo de domingos de folga por mês, diferenciado por grupo | `[V]` | — | MVP |
| RF-17 | Folgas rotativas ou fixas na semana, com sugestão automática em rodízio | `[V]` | — | MVP |
| RF-18 | Feriados do mês com efeito na escala (`FE` — feriado trabalhado) | `[V]` | — | MVP |
| RF-19 | **Cobertura mínima por turno**, não só por dia | `[C]` L2 | Alta | MVP |
| RF-20 | Calendário de feriados nacionais, estaduais e municipais pré-carregado | `[C]` L9 | Baixa | Fase 2 |
| RF-21 | Perfis de configuração reutilizáveis entre meses ("copiar do mês anterior") | `[?]` | Baixa | MVP |
| RF-22 | Modelos de escala customizados pelo cliente, além dos 6 fixos | `[?]` | Média | Fase 2 |
| RF-23 | Horário de abertura/fechamento por dia da semana (sábado e domingo costumam ter horário reduzido) | `[?]` | Média | Fase 2 |

### 3.4 Ausências e exceções

Módulo inteiro ausente do protótipo. Provavelmente o maior bloco de trabalho novo.

| # | Requisito | Origem | Compl. | Fase |
| --- | --- | --- | --- | --- |
| RF-24 | Registro de férias com período, refletido na escala | `[C]` L8 | Média | MVP |
| RF-25 | Registro de afastamentos: atestado, licença-maternidade, acidente, suspensão | `[C]` L8 | Média | MVP |
| RF-26 | O motor não escala quem está ausente e não conta essa pessoa na cobertura | `[C]` L8 | Média | MVP |
| RF-27 | Alerta quando a ausência derruba a cobertura abaixo do mínimo | `[C]` L8 | Média | MVP |
| RF-28 | Troca de folga entre funcionários, com aprovação do gerente | `[?]` | Alta | Fase 2 |
| RF-29 | Programação de férias com aviso de conflito (dois do mesmo setor no mesmo período) | `[?]` | Alta | Fase 2 |
| RF-30 | Folga compensatória (`FC`) com controle de saldo | `[?]` | Alta | Fase 2 |

### 3.5 Geração da escala

| # | Requisito | Origem | Compl. | Fase |
| --- | --- | --- | --- | --- |
| RF-31 | Gerar a escala do mês respeitando modelo, domingos, folgas fixas e feriados | `[V]` | — | MVP |
| RF-32 | Respeitar o teto de dias consecutivos do ciclo escolhido | `[V]` | — | MVP |
| RF-33 | Distribuir os domingos de folga espaçadamente entre colegas | `[V]` | — | MVP |
| RF-34 | **Atender os mínimos sempre que exista solução** (ver 6.1) | `[C]` L7 | Alta | MVP |
| RF-35 | Preservar edições manuais ao regerar (célula travada) | `[C]` L6 | Média | MVP |
| RF-36 | Gerar considerando o fim do mês anterior, para não emendar sequências na virada | `[?]` | Média | Fase 2 |
| RF-37 | Distribuir feriados e sábados de forma justa ao longo do ano, não só do mês | `[?]` | Alta | Futuro |

### 3.6 Conferências e alertas

O protótipo já tem três níveis e eles devem ser mantidos — é o que o cliente elogiou.

| # | Requisito | Origem | Compl. | Fase |
| --- | --- | --- | --- | --- |
| RF-38 | Alerta de cobertura: dias abaixo do mínimo, por setor e geral | `[V]` | — | MVP |
| RF-39 | Diagnóstico de viabilidade: acusa configuração matematicamente impossível, com a causa e a sugestão de correção | `[V]` | — | MVP |
| RF-40 | Alerta de jornada: dias consecutivos acima do teto, reconferido a cada edição manual | `[V]` | — | MVP |
| RF-41 | Conferir os mínimos de domingo também na edição manual | `[C]` L5 | Baixa | MVP |
| RF-42 | Corrigir a divergência entre tabela e alertas para quem entra depois da geração | `[C]` L4 | Baixa | MVP |
| RF-43 | Alertar setor de uma pessoa só com exigência diária — impossível por definição (a folga dela é o furo) | `[C]` | Baixa | MVP |
| RF-44 | Conferências de conformidade trabalhista (ver 6.2) | `[?]` | Alta | A definir |

### 3.7 Edição, versionamento e publicação

| # | Requisito | Origem | Compl. | Fase |
| --- | --- | --- | --- | --- |
| RF-45 | Edição célula a célula alternando o status | `[V]` | — | MVP |
| RF-46 | Filtro por setor e ordenação por nome ou setor | `[V]` | — | MVP |
| RF-47 | Salvar a escala do mês e reabrir depois | `[C]` L3 | Média | MVP |
| RF-48 | Estados da escala: rascunho → publicada → encerrada | `[?]` | Média | MVP |
| RF-49 | Histórico de alterações: quem mudou o quê e quando | `[?]` | Média | MVP |
| RF-50 | Comparar a escala publicada com a versão anterior | `[?]` | Média | Fase 2 |
| RF-51 | Notificar os funcionários quando a escala for publicada ou alterada | `[?]` | Alta | Fase 2 |
| RF-52 | Consulta da própria escala pelo funcionário (web ou app) | `[?]` | Alta | Fase 2 |

### 3.8 Saída e relatórios

| # | Requisito | Origem | Compl. | Fase |
| --- | --- | --- | --- | --- |
| RF-53 | PDF com uma semana por página, quebra por volume de equipe, feriados e resumos | `[V]` | — | MVP |
| RF-54 | Exportação em Excel/CSV | `[?]` | Baixa | MVP |
| RF-55 | Totais por funcionário: dias trabalhados, folgas, feriados, folgas em domingo, maior sequência | `[V]` | — | MVP |
| RF-56 | Relatório consolidado por período e por loja | `[?]` | Média | Fase 2 |
| RF-57 | Indicadores de gestão: cobertura média, domingos por pessoa, distribuição de folgas | `[?]` | Média | Fase 2 |

### 3.9 Integrações

Nenhuma foi confirmada. Cada uma muda o custo de forma relevante.

| # | Requisito | Origem | Compl. | Fase |
| --- | --- | --- | --- | --- |
| RF-58 | Importação/exportação com o sistema de folha de pagamento | `[?]` | Alta | A definir |
| RF-59 | Integração com relógio de ponto (previsto × realizado) | `[?]` | Alta | A definir |
| RF-60 | Distribuição da escala por WhatsApp | `[?]` | Alta | A definir |
| RF-61 | Coleta dos dados via agente de IA no WhatsApp (roteiro e prompt já desenhados nesta conversa) | `[?]` | Alta | Futuro |

---

## 4. Requisitos não funcionais

| # | Requisito | Observação |
| --- | --- | --- |
| RNF-01 | Volume: definir o teto de funcionários por loja e de lojas por empresa | Muda a arquitetura. 30 pessoas e 3.000 pessoas são projetos diferentes. |
| RNF-02 | Tempo de geração da escala aceitável na interação (alvo: poucos segundos) | Restringe a escolha do motor — ver 6.1. |
| RNF-03 | Uso em celular e tablet | O protótipo já é responsivo; a grade mensal em tela pequena é o ponto sensível. |
| RNF-04 | LGPD: dados pessoais de funcionários, incluindo sexo | Base legal, retenção, anonimização e direito de acesso precisam de posição do cliente. |
| RNF-05 | Trilha de auditoria de alterações na escala | Escala é documento com efeito trabalhista. |
| RNF-06 | Backup e retenção do histórico | Definir por quantos anos. |
| RNF-07 | Disponibilidade e janela de manutenção | Escala se mexe mais no fim do mês. |
| RNF-08 | Navegadores suportados | |
| RNF-09 | Acessibilidade | Definir se há exigência formal. |

---

## 5. Fora de escopo (proposto)

Registrar o que **não** entra é tão importante quanto o que entra:

- Controle de ponto e apuração de horas — o sistema planeja, não apura.
- Folha de pagamento.
- Recrutamento, avaliação de desempenho, treinamento.
- Gestão de tarefas ou produtividade dentro do turno.

---

## 6. Decisões técnicas que mudam o custo

Estas três precisam de decisão antes de qualquer número na proposta.

### 6.1 Motor: heurística ou otimizador `[C]` L7

O protótipo aplica o ciclo da escala sobre o calendário, ajusta os domingos e conserta as sequências que estouram o teto. É rápido, previsível e explicável — mas **não busca solução**. Ele pode deixar um dia abaixo do mínimo mesmo quando existe um arranjo que atenderia tudo.

Isso ficou visível em teste: numa configuração aprovada pelo diagnóstico de viabilidade, um domingo saiu com 1 operadora de caixa onde o mínimo era 3. Não era impossível — foi desencaixe da rotação.

Três caminhos:

| Caminho | O que entrega | Custo |
| --- | --- | --- |
| **A. Manter a heurística** e melhorar o ajuste fino | Escala boa na maioria dos casos; o gerente corrige o resto na mão | Baixo |
| **B. Heurística + busca local** (troca folgas até fechar os mínimos) | Atende os mínimos na grande maioria dos casos, sem garantia formal | Médio |
| **C. Solver de restrições** (CP-SAT / OR-Tools ou equivalente) | Garante a melhor solução possível dado o conjunto de regras; absorve turnos, ausências e preferências sem reescrita | Alto |

Recomendação: **C**, se turnos (RF-19) e preferências individuais (RF-13) entrarem no escopo. Com turnos, o número de combinações cresce muito e a heurística por ciclo deixa de dar conta — construir B agora e migrar para C depois custa os dois. Se o escopo ficar restrito a "um turno, mínimos por dia", **A ou B** resolvem e economizam bem.

### 6.2 Conformidade trabalhista: até onde o sistema se compromete `[?]`

O protótipo **não promete conformidade legal** — e essa decisão foi deliberada. O sistema real precisa de posição explícita do cliente, porque muda tanto o produto quanto a responsabilidade:

1. **Só planeja** e deixa a conformidade com o RH/contabilidade do cliente. (menor risco)
2. **Alerta** sobre situações de risco (sequências longas, intervalo entre jornadas, domingos seguidos) como aviso, sem afirmar conformidade.
3. **Garante** o cumprimento das regras — exige validação jurídica das regras implementadas e assume responsabilidade.

Ponto específico a levar ao jurídico do cliente: o protótipo trata domingos de folga por **sexo** (campos separados para homens e mulheres), o que reflete uma prática do comércio. Manter essa regra no produto exige respaldo jurídico formal e afeta o modelo de dados.

**Recomendação: opção 2.** Entrega valor real ao gerente sem transformar a software house em responsável solidária por passivo trabalhista.

### 6.3 Turnos: a decisão que mais amplia o escopo `[C]` L2

Sem turnos, cobertura é "quantas pessoas no dia". Com turnos, é "quantas pessoas em cada faixa de horário de cada dia" — e isso atravessa praticamente tudo: cadastro, configuração de mínimos, motor, alertas, grade na tela, PDF e relatórios.

Não é um campo a mais; é uma dimensão a mais em todas as estruturas. Se o cliente opera em mais de um turno — e um supermercado normalmente opera —, isso é MVP, não Fase 2. Vale confirmar cedo, porque muda o dimensionamento inteiro do projeto.

---

## 7. Perguntas em aberto — pauta para o cliente

O que precisa ser respondido antes de fechar escopo e preço. Agrupadas por impacto.

**Impacto alto (mudam a arquitetura)**

1. Quantas lojas? Quantos funcionários por loja, hoje e na projeção de 2 anos?
2. A loja opera em quantos turnos? A cobertura mínima varia por turno? *(define RF-19 e a seção 6.3)*
3. Funcionários de setores diferentes usam modelos de escala diferentes? *(define RF-09)*
4. Qual a expectativa sobre conformidade legal: planejar, alertar ou garantir? *(seção 6.2)*
5. Funcionário terá acesso ao sistema para consultar a própria escala? *(define RF-52 e o volume de usuários)*

**Impacto médio (mudam módulos inteiros)**

6. Como férias e afastamentos são controlados hoje? Há sistema de onde importar?
7. Existe troca de folga entre funcionários? Como é autorizada hoje?
8. A escala publicada muda no meio do mês? Com que frequência? Quem pode alterar?
9. Como a escala chega ao funcionário hoje — mural, WhatsApp, grupo, impressa?
10. Existe sistema de ponto? Qual? Há interesse em comparar previsto × realizado?
11. Existe sistema de folha? Qual? Há troca de dados prevista?
12. Há regra de rodízio de feriados e datas especiais ao longo do ano, ou o controle é mensal?

**Impacto menor (afinam o escopo)**

13. Há restrições individuais recorrentes a respeitar (menor aprendiz, estudante, restrição médica)?
14. O horário de funcionamento varia por dia da semana?
15. Quais relatórios o gerente ou o dono precisa ver — e para decidir o quê?
16. Quem administra o sistema no cliente? Haverá mais de um perfil de acesso?
17. Existe algum relatório ou planilha atual que o sistema precisa substituir? *(pedir uma cópia — é a melhor fonte de requisitos que existe)*

**Comerciais / de projeto**

18. Há prazo alvo? Existe data-âncora (início de exercício, auditoria, expansão)?
19. O protótipo aprovado será a base do produto ou haverá redesenho de interface?
20. Modelo de entrega: SaaS multiempresa ou instalação dedicada para este cliente?

---

## 8. Faseamento sugerido

Proposta de recorte, a ajustar depois das respostas da seção 7.

**Fase 1 — MVP operacional.** O protótipo vira sistema: contas e lojas, persistência, equipe com modelo de escala por setor, turnos, ausências (férias e afastamento), geração, os três níveis de alerta, edição com trava, publicação, PDF e Excel.
*Critério de pronto: o gerente monta e publica a escala do mês sem sair do sistema e sem planilha paralela.*

**Fase 2 — Gestão.** Trocas de folga com aprovação, programação de férias, acesso do funcionário, notificação de publicação, calendário de feriados, relatórios consolidados e indicadores.

**Fase 3 — Integrações e inteligência.** Ponto, folha, distribuição por WhatsApp, agente de coleta por IA, otimização anual de feriados e datas especiais.

O corte da Fase 1 é deliberadamente conservador: entrega o ciclo completo de uma escala de verdade. Um MVP mais enxuto — sem turnos ou sem ausências — corre o risco de não ser usável no dia a dia, e um sistema que não substitui a planilha atual não é adotado.

---

## 9. Riscos

| Risco | Mitigação |
| --- | --- |
| Turnos entrarem como "detalhe" e explodirem o escopo no meio do projeto | Decidir na primeira reunião (pergunta 2) |
| Escolha do motor travar a evolução (heurística que não absorve turnos e preferências) | Decidir 6.1 junto com 6.3, não depois |
| Expectativa de conformidade legal não explicitada | Fechar 6.2 por escrito na proposta |
| Regras informais não documentadas ("aqui sempre foi assim") aparecerem só na homologação | Pedir a planilha atual e as escalas dos últimos 3 meses (pergunta 17) |
| Cliente comparar o sistema com o protótipo e estranhar o que ficou para a Fase 2 | Anexar o faseamento à proposta, com o que cada fase entrega |
