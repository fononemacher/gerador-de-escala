# Levantamento de Requisitos — Sistema de Gestão de Escalas

Documento de apoio à proposta comercial e ao repasse para a equipe técnica.

**Base**: protótipo funcional em React (este repositório), apresentado ao cliente e aprovado.
**Fontes**: testes sobre o protótipo · reunião de 05/08/2026 (Grupo CRK + Kepha) · decisões registradas após a reunião.

## Como ler este documento

Cada requisito traz uma marca de origem. Ela existe para que ninguém confunda o que já foi decidido com o que ainda é suposição nossa:

| Marca | Significado |
| --- | --- |
| `[V]` | **Validado** — está no protótipo, o cliente viu funcionando e aprovou. |
| `[C]` | **Comprovado** — lacuna ou defeito que testamos e reproduzimos no protótipo. |
| `[D]` | **Decidido** — definido na reunião de 05/08/2026 ou em decisão posterior registrada na seção 10. |
| `[?]` | **Inferido** — proposta nossa, a partir do domínio. **Precisa de confirmação antes de entrar no escopo.** |

Complexidade é relativa (Baixa / Média / Alta), para orientar o dimensionamento. Não são estimativas de esforço — essas cabem à equipe técnica depois que o escopo fechar.

> **Atenção ao volume de `[?]`.** Boa parte deste documento ainda é inferência. O protótipo resolve um problema estreito e bem definido; um sistema de gestão de escalas é bem maior. Fechar preço antes de responder a seção 8 é assumir risco desnecessário.

---

## 1. Contexto

O protótipo monta a escala mensal de uma equipe de varejo a partir de: lista de funcionários, modelo de escala, mínimos de cobertura por dia e por setor, domingos de folga e feriados. Ele gera a grade dia a dia, aponta os dias que ficam abaixo do mínimo, diagnostica configurações impossíveis e exporta em PDF.

É uma página única, sem backend, sem login e sem persistência: fechar o navegador descarta tudo. Foi decisão consciente de protótipo — e é o primeiro item que muda no sistema real.

**Público-alvo** `[D]`: varejo em geral — supermercado, lojista, shopping. Empresas a partir de 7 a 10 colaboradores, faixa em que montar escala à mão deixa de ser viável. As regras entre esses nichos são próximas o bastante para um só produto, desde que a convenção coletiva seja parametrizável (ver RF-20).

### 1.1 O que o protótipo já provou

Vale registrar, porque reduz risco na proposta: o protótipo não é só uma tela. Ele já resolve a parte difícil do domínio.

- Gera escalas em 6 modelos (6×1, 6×2, 5×2, 5×1, 12×36, espanhola), respeitando o teto de dias consecutivos de cada ciclo — testado nas 24 combinações de modelo × configuração.
- Distribui os domingos de folga de forma espaçada entre colegas do mesmo grupo, em vez de todo mundo folgar no mesmo domingo.
- **Diagnostica impossibilidade matemática antes de o usuário culpar o sistema.** Exemplo real: 5 operadores de caixa com mínimo de 5 por dia em 6×1 num mês de 31 dias exigem 155 dias-pessoa, mas 5 pessoas oferecem no máximo 135. O sistema informa que seriam necessários 6 funcionários e que o mínimo sustentável é 4 por dia.

Esse diagnóstico é o diferencial do produto e deve ser preservado e ampliado. É o que separa "o sistema não conseguiu" de "não existe arranjo possível, e o motivo é este".

---

## 2. Limitações conhecidas do protótipo `[C]`

Todas verificadas em teste, não suposições. Entram como requisito no sistema real.

| # | Limitação | Impacto |
| --- | --- | --- |
| L1 | **Modelo de escala único para toda a equipe.** Não é possível ter o açougue em 6×1 e o administrativo em 5×2 na mesma geração. | Alto — e ainda sem resposta do cliente (pergunta 1 da seção 8). |
| L2 | **Turnos não afetam a escala.** O campo existe no cadastro, mas o motor e os alertas ignoram. A cobertura é contada por dia, não por turno. | Alto — mitigado pelo achado da seção 7.3. |
| L3 | **Sem persistência.** Tudo em memória. | Alto — inviabiliza uso real. |
| L4 | **Funcionário incluído depois da geração** aparece na tabela como se trabalhasse todos os dias, mas os alertas o contam como não trabalhando. Tabela e alertas discordam. | Médio — resolvido por RF-30. |
| L5 | **A edição manual não confere os mínimos de domingo.** O teto de dias consecutivos já é reconferido a cada clique; a regra dos domingos não. | Médio |
| L6 | **Regerar a escala descarta as edições manuais.** Não há como travar uma célula ajustada à mão. | Médio — retrabalho garantido no uso mensal. |
| L7 | **Motor heurístico, não otimizador.** Aplica o ciclo, ajusta os domingos e conserta as sequências que estouram. Não busca solução — pode deixar um mínimo em falta mesmo quando existe arranjo válido. | Alto — ver 7.1. |
| L8 | **Ausências não existem.** Férias, atestado, licença e afastamento não são representáveis. | Alto — foi a primeira preocupação levantada pelo cliente na reunião. |
| L9 | **Sem calendário de feriados.** O usuário digita um a um, todo mês. Na demonstração da reunião o agente errou um feriado de setembro. | Baixa |
| L10 | **Uma empresa só.** Não há noção de CNPJ, filial nem isolamento de dados entre clientes. | Alto — ver 3.1. |

---

## 3. Requisitos funcionais

### 3.1 Contas, empresas e acesso

| # | Requisito | Origem | Compl. | Fase |
| --- | --- | --- | --- | --- |
| RF-01 | Autenticação com e-mail e senha, recuperação de senha | `[D]` | Baixa | MVP |
| RF-02 | Cadastro de empresa por **CNPJ**; a licença e a escala pertencem a um CNPJ | `[D]` | Média | MVP |
| RF-03 | **Isolamento de dados entre empresas**: nenhum usuário enxerga dados de outro CNPJ | `[D]` | Média | MVP |
| RF-04 | Funcionário pertence a um CNPJ e **não é compartilhado entre CNPJs** — transferência exige alteração contratual, fora do escopo do sistema | `[D]` | Baixa | MVP |
| RF-05 | Perfis de acesso além do administrador da empresa (ex.: gerente que só mexe no próprio setor) | `[?]` | Média | A definir |

> **Nota sobre licenciamento.** Isolamento de dados (RF-03) é requisito agora, independente de preço. Cota — teto de colaboradores ou de usuários por licença — **não** é requisito: o modelo de negócio ainda está em definição. Com o isolamento pronto, incluir limite depois é barato.

### 3.2 Cadastro da equipe

| # | Requisito | Origem | Compl. | Fase |
| --- | --- | --- | --- | --- |
| RF-06 | Cadastro com nome, função/setor e sexo | `[V]` | Baixa | MVP |
| RF-07 | Edição e remoção de funcionário; limpar equipe inteira com confirmação | `[V]` | Baixa | MVP |
| RF-08 | Campo de turno persistido no cadastro, **sem efeito sobre a geração no MVP** (ver 7.3) | `[D]` | Baixa | MVP |
| RF-09 | Modelo de escala **por setor**, não único para a equipe | `[C]` L1 | Alta | MVP¹ |
| RF-10 | Dados trabalhistas: matrícula, data de admissão, carga horária contratual | `[?]` | Baixa | MVP |
| RF-11 | Importação da equipe por planilha (CSV/Excel) | `[?]` | Média | MVP |
| RF-12 | Funcionário inativo/desligado preservando o histórico de escalas | `[D]` | Média | MVP |
| RF-13 | Preferências e restrições individuais (ex.: não pode fechar a loja, prefere folgar sábado) | `[?]` | Alta | Futuro |

¹ Depende da resposta à pergunta 1 da seção 8. Se o cliente não precisar, cai para Fase 2.

### 3.3 Regras e configuração da escala

| # | Requisito | Origem | Compl. | Fase |
| --- | --- | --- | --- | --- |
| RF-14 | Modelos 6×1, 6×2, 5×2, 5×1, 12×36 e espanhola | `[V]` | — | MVP |
| RF-15 | Mínimo de cobertura por dia da semana, geral e por setor (modo simples e por dia) | `[V]` | — | MVP |
| RF-16 | Mínimo de domingos de folga por mês, diferenciado por grupo | `[V]` | — | MVP |
| RF-17 | Folgas rotativas ou fixas na semana, com sugestão automática em rodízio | `[V]` | — | MVP |
| RF-18 | Feriados do mês com efeito na escala (`FE` — feriado trabalhado) | `[V]` | — | MVP |
| RF-19 | **Convenção coletiva como parâmetro**: os mínimos de domingo de folga por grupo saem da convenção da empresa, não de constante no código | `[D]` | Média | MVP |
| RF-20 | Calendário de feriados nacionais, estaduais e municipais pré-carregado, de fonte de dados — nunca gerado por IA | `[C]` L9 | Baixa | Fase 2 |
| RF-21 | Reaproveitar a configuração do mês anterior ("copiar do mês passado") | `[D]` | Baixa | MVP |
| RF-22 | **Cobertura mínima por turno** — mínimo por dia da semana × setor × turno | `[D]` | Média | Fase 2 |
| RF-23 | Horário de abertura/fechamento por dia da semana | `[?]` | Média | Futuro |

### 3.4 Ausências e movimentação de pessoal

Módulo inteiro ausente do protótipo, e a primeira preocupação que o cliente levantou espontaneamente na reunião.

| # | Requisito | Origem | Compl. | Fase |
| --- | --- | --- | --- | --- |
| RF-24 | Registro de férias com período, refletido na escala | `[D]` | Média | MVP |
| RF-25 | Registro de afastamentos: atestado, licença-maternidade, acidente, suspensão | `[D]` | Média | MVP |
| RF-26 | Admissão e demissão com data de vigência | `[D]` | Média | MVP |
| RF-27 | O motor não escala quem está ausente e não o conta na cobertura | `[D]` | Média | MVP |
| RF-28 | Alerta quando a ausência derruba a cobertura abaixo do mínimo | `[D]` | Média | MVP |
| RF-29 | **Revisão de equipe na virada do mês**: ao iniciar a escala, o sistema apresenta a equipe do mês anterior e pergunta o que mudou — entradas, saídas, férias, afastamentos e mudanças de turno | `[D]` | Média | MVP |
| RF-30 | **A escala do mês guarda a composição usada na geração** (quem estava ativo, em qual setor, em qual turno). Reabrir um mês passado mostra a realidade daquele mês, não a de hoje | `[D]` | Média | MVP |
| RF-31 | Troca de folga entre funcionários, com aprovação do gestor | `[?]` | Alta | Fase 2 |
| RF-32 | Programação de férias com aviso de conflito (dois do mesmo setor no mesmo período) | `[?]` | Alta | Fase 2 |
| RF-33 | Folga compensatória (`FC`) com controle de saldo | `[?]` | Alta | Fase 2 |

> RF-30 resolve três problemas de uma vez: o histórico de turno (que muda na virada do mês), o funcionário desligado que precisa continuar aparecendo nos meses passados, e o defeito L4.

### 3.5 Geração da escala

| # | Requisito | Origem | Compl. | Fase |
| --- | --- | --- | --- | --- |
| RF-34 | Gerar a escala do mês respeitando modelo, domingos, folgas fixas e feriados | `[V]` | — | MVP |
| RF-35 | Respeitar o teto de dias consecutivos do ciclo escolhido | `[V]` | — | MVP |
| RF-36 | Distribuir os domingos de folga espaçadamente entre colegas | `[V]` | — | MVP |
| RF-37 | **Atender o máximo possível das regras configuradas** — o motor busca solução, não apenas aplica o ciclo (ver 7.1 e 7.2) | `[D]` | Alta | MVP |
| RF-38 | Preservar edições manuais ao regerar (célula travada) | `[C]` L6 | Média | MVP |
| RF-39 | Puxar a escala do mês anterior para dar sequência, sem emendar sequências de trabalho na virada | `[D]` | Média | MVP |
| RF-40 | Distribuir feriados e datas especiais de forma justa ao longo do ano | `[?]` | Alta | Futuro |

### 3.6 Conferências, alertas e recomendações

O protótipo já tem três níveis e eles devem ser mantidos — é o que o cliente elogiou.

| # | Requisito | Origem | Compl. | Fase |
| --- | --- | --- | --- | --- |
| RF-41 | Alerta de cobertura: dias abaixo do mínimo, por setor e geral | `[V]` | — | MVP |
| RF-42 | Diagnóstico de viabilidade: acusa configuração matematicamente impossível, com a causa e a sugestão de correção | `[V]` | — | MVP |
| RF-43 | Alerta de jornada: dias consecutivos acima do teto, reconferido a cada edição manual | `[V]` | — | MVP |
| RF-44 | **Recomendação de correção na falha de cobertura**: quando um dia ficar em falta sem que a configuração seja impossível, indicar o caminho — qual folga trocar, qual funcionário mover de dia, ou qual mínimo cederia com menor impacto | `[D]` | Alta | MVP |
| RF-45 | Conferir os mínimos de domingo também na edição manual | `[C]` L5 | Baixa | MVP |
| RF-46 | Corrigir a divergência entre tabela e alertas para quem entra depois da geração | `[C]` L4 | Baixa | MVP |
| RF-47 | Alertar setor de uma pessoa só com exigência diária — impossível por definição, a folga dela é o furo | `[C]` | Baixa | MVP |

> **RF-44 e RF-37 são o mesmo investimento.** Para recomendar "mova fulano do dia 12 para o dia 14" o sistema precisa avaliar alternativas — exatamente a máquina de busca que RF-37 exige. Dimensionar junto.

### 3.7 Edição, versionamento e publicação

| # | Requisito | Origem | Compl. | Fase |
| --- | --- | --- | --- | --- |
| RF-48 | Edição célula a célula alternando o status | `[V]` | — | MVP |
| RF-49 | Filtro por setor e ordenação por nome ou setor | `[V]` | — | MVP |
| RF-50 | Salvar a escala do mês e reabrir depois | `[D]` | Média | MVP |
| RF-51 | Estados da escala: rascunho → publicada → encerrada | `[?]` | Média | MVP |
| RF-52 | Histórico de alterações: quem mudou o quê e quando | `[D]` | Média | MVP |
| RF-53 | Comparar a escala publicada com a versão anterior | `[?]` | Média | Fase 2 |
| RF-54 | Distribuição da escala ao funcionário (impressa, WhatsApp ou mural) | `[?]` | Média | Fase 2 |

> **Acesso do funcionário ao sistema está fora de escopo** `[D]`. Isso não elimina a **distribuição** (RF-54): ele continua precisando receber a escala, só não por login próprio.

### 3.8 Saída e relatórios

| # | Requisito | Origem | Compl. | Fase |
| --- | --- | --- | --- | --- |
| RF-55 | PDF com uma semana por página, quebra por volume de equipe, feriados e resumos | `[V]` | — | MVP |
| RF-56 | Exportação em Excel/CSV | `[?]` | Baixa | MVP |
| RF-57 | Totais por funcionário: dias trabalhados, folgas, feriados, folgas em domingo, maior sequência | `[V]` | — | MVP |
| RF-58 | Filtro por setor e por turno nos relatórios e no PDF | `[D]` | Baixa | Fase 2 |
| RF-59 | Relatório consolidado por período e por empresa | `[?]` | Média | Fase 2 |

### 3.9 Canal WhatsApp (agente de IA)

Demonstrado na reunião. Roteiro e prompt do agente já desenhados; a saída é um bloco de texto estruturado que alimenta o sistema.

| # | Requisito | Origem | Compl. | Fase |
| --- | --- | --- | --- | --- |
| RF-60 | Coleta conversacional dos dados da escala, por texto ou áudio | `[V]` | Média | Fase 2 |
| RF-61 | Número único compartilhado, com reconhecimento da empresa pelo número do remetente | `[D]` | Média | Fase 2 |
| RF-62 | Bloqueio de quem não é cliente, com desvio para o comercial | `[D]` | Baixa | Fase 2 |
| RF-63 | Regras fixas por empresa, para não repetir as mesmas respostas todo mês | `[D]` | Média | Fase 2 |

---

## 4. Requisitos não funcionais

| # | Requisito | Observação |
| --- | --- | --- |
| RNF-01 | **Volume**: dezenas de empresas × dezenas de funcionários | Base real levantada na reunião: clientes de 5 a 65 colaboradores por CNPJ; um grupo com 4 CNPJs (50, 65, ~60 e um novo); ~50 clientes na largada. Não exige arquitetura pesada. |
| RNF-02 | Tempo de geração aceitável na interação (alvo: poucos segundos) | Restringe a escolha do motor — ver 7.1. |
| RNF-03 | **Tabela de cobertura mínima com chave `empresa · setor · turno · dia_semana`** desde o MVP, com turno em "todos" enquanto o recurso não existir | Decisão de arquitetura — ver 7.3. Custo zero agora, migração cara depois. |
| RNF-04 | Uso em celular e tablet | O protótipo já é responsivo; a grade mensal em tela pequena é o ponto sensível. |
| RNF-05 | LGPD: dados pessoais de funcionários, incluindo sexo | Base legal, retenção e direito de acesso precisam de posição do cliente. |
| RNF-06 | Trilha de auditoria de alterações na escala | Escala é documento com efeito trabalhista. |
| RNF-07 | Backup e retenção do histórico | Definir por quantos anos. |
| RNF-08 | Hospedagem, domínio e infraestrutura | **Em aberto**: não foi definido quem hospeda. Tem custo recorrente e entra na proposta. |
| RNF-09 | Disponibilidade e janela de manutenção | Escala se mexe mais no fim do mês. |

---

## 5. Fora de escopo `[D]`

Registrar o que **não** entra é tão importante quanto o que entra. Todos os itens abaixo foram levantados e descartados.

| Item | Motivo |
| --- | --- |
| **Integração com eSocial** | Plataformas de governo impõem atrito incompatível com a praticidade exigida; e parte dos empresários mantém colaborador sem registro formal, então a base oficial não descreve a equipe que precisa entrar na escala. |
| **Integração com sistema de folha** (ex.: API do Domínio) | O produto se vende para além da carteira do escritório, e não se pode assumir que todo escritório tem API aberta. |
| **Acesso do funcionário ao sistema** | Decisão do cliente. |
| **Cota de colaboradores/usuários por licença** | Modelo de negócio ainda em definição. |
| **Modelos de escala editáveis pelo cliente sem deploy** | Levantado como hipótese, não confirmado como requisito. |
| **Funcionário compartilhado entre CNPJs** | Transferência exige alteração contratual. |
| Controle de ponto e apuração de horas | O sistema planeja, não apura. |
| Folha de pagamento, recrutamento, avaliação de desempenho | — |

**Adjacências mencionadas, fora deste produto**: regulamento interno e manual de ética; atividades por colaborador a partir da CBO; agente de triagem de dúvidas trabalhistas. Relevantes para o posicionamento comercial, não para o escopo da escala.

---

## 6. Contexto de mercado

Levantado na reunião. Serve à proposta comercial, não ao escopo técnico.

| Referência | Valor |
| --- | --- |
| Concorrência real | Sistemas de **cartão-ponto** que embutem escala (IGS, Sólides, Tech Smart, Vancode) — não softwares de escala |
| Cartão-ponto, 5 funcionários | ~R$ 70–80/mês |
| Implantação (padrão do mercado) | R$ 990 |
| Software por colaborador | R$ 9,50, caindo para R$ 4,00 acima de 110 colaboradores |
| Escala montada à mão hoje | R$ 250/hora, até 2 horas por escala |

O último número é o argumento de venda mais forte disponível: **uma escala manual custa até R$ 500 em hora técnica, todo mês, por cliente.**

Modelo de cobrança em discussão: mensalidade por CNPJ, com implantação e treinamento à parte, seguindo o padrão do mercado de ponto. Três formatos de parceria foram pedidos: projeto 100% de um lado, meio a meio, ou mensalidade.

---

## 7. Decisões técnicas

### 7.1 Motor: heurística, busca local ou solver `[C]` L7

O protótipo aplica o ciclo da escala sobre o calendário, ajusta os domingos e conserta as sequências que estouram o teto. É rápido, previsível e explicável — mas **não busca solução**. Pode deixar um dia abaixo do mínimo mesmo quando existe arranjo que atenderia tudo.

Ficou visível em teste: numa configuração aprovada pelo diagnóstico de viabilidade, um domingo saiu com 1 operadora de caixa onde o mínimo era 3. Não era impossível — foi desencaixe da rotação.

| Caminho | O que entrega | Custo |
| --- | --- | --- |
| **A. Heurística atual** com ajuste fino | Escala boa na maioria dos casos; o gestor corrige o resto na mão | Baixo |
| **B. Heurística + busca local** (troca folgas até fechar os mínimos) | Atende os mínimos na grande maioria dos casos, sem garantia formal | Médio |
| **C. Solver de restrições** (CP-SAT / OR-Tools ou equivalente) | Melhor solução possível dado o conjunto de regras | Alto |

**Recomendação: B.** A decisão de conformidade (7.2) exige "o máximo que der", o que A não entrega. C deixou de ser necessário porque turnos saíram do MVP e, sendo contratuais, não explodem o espaço de busca (7.3). C volta à mesa apenas se preferências individuais (RF-13) entrarem.

B também é o que viabiliza RF-44: recomendar uma correção é avaliar alternativas, que é a mesma máquina.

### 7.2 Conformidade trabalhista `[D]`

Posição definida:

> **O sistema não assume responsabilidade por regra errada.** Deve entregar a escala o mais dentro das configurações definidas pelo cliente quanto for possível. Quando alguma regra não for cumprida, precisa **avisar** e, sempre que possível, **recomendar como resolver**.

Consequências práticas:

1. É requisito funcional do motor, não só postura jurídica — vira RF-37.
2. Falha de cobertura silenciosa passa a ser defeito. Hoje o dia fica vermelho e o sistema cala; RF-44 fecha essa lacuna.
3. Contratualmente, a proposta deve dizer que o sistema **apoia** o cumprimento das regras configuradas pelo cliente, sem certificar conformidade legal.

A regra de domingos de folga por grupo vem da **convenção coletiva** e varia entre elas — por isso RF-19 a trata como parâmetro, não como constante. É também o que permite atender varejo em geral sem reescrever regra por nicho.

### 7.3 Turnos: contratuais, e o que isso muda `[D]`

**Premissa registrada**: o turno de cada funcionário é definido em contrato. Ele pode mudar, mas **apenas na virada do mês** — dentro de um mês é constante.

Isso é o que mantém o custo baixo. O caso caro do escalonamento multi-turno é aquele em que o motor **escolhe** quem faz manhã e quem faz tarde; não é o caso aqui. Como o turno é dado do funcionário, a equipe se **particiona** por turno e o motor roda praticamente igual em cada partição. A célula da escala continua sendo "trabalha ou folga" — o turno pertence ao funcionário, não ao dia.

Por isso turnos ficam para a **Fase 2**, com três preparações no MVP que custam quase nada agora e são caras depois:

1. **Chave da tabela de mínimos já com turno** (RNF-03), preenchida com "todos" enquanto o recurso não existir. Incluir turno depois vira inserir linha, não migrar schema.
2. **Campo de turno persistido no cadastro** (RF-08). Quando o recurso entrar, o histórico já existe e ninguém recadastra 60 pessoas.
3. **Conferência de cobertura dirigida por lista de regras**, não por casos escritos à mão. Turno vira mais uma regra, não uma reescrita de alertas, viabilidade e PDF.

**O que não fazer agora**: tela de turno atrás de flag; turno na célula da escala (seria errado, não só prematuro); abstração genérica de dimensões arbitrárias de cobertura.

**Risco da premissa**: se algum cliente de fato rodar pessoas entre turnos dentro do mês, o problema deixa de ser particionável e nenhuma preparação de arquitetura resolve — vira outro projeto. O seguro mais barato não é código flexível, é manter a premissa confirmada.

---

## 8. Perguntas em aberto

O que ainda precisa de resposta antes de fechar escopo e preço.

**Impacto alto**

1. **Numa mesma empresa, setores diferentes usam escalas diferentes** (açougue 6×1, administrativo 5×2)? Levantado na reunião e não respondido. É a limitação L1 e define se RF-09 é MVP.
2. Quais são as regras de convenção coletiva a parametrizar, e onde elas estão documentadas? *(o conhecimento hoje está concentrado em uma pessoa — extraí-lo é atividade de projeto com custo)*
3. Quem hospeda a infraestrutura? *(RNF-08, custo recorrente na proposta)*

**Impacto médio**

4. Haverá perfil de gerente com acesso restrito ao próprio setor, ou basta um login por empresa? *(RF-05)*
5. Existe troca de folga entre funcionários? Como é autorizada hoje? *(RF-31)*
6. A escala publicada muda no meio do mês? Com que frequência, e quem pode alterar? *(RF-51)*
7. Como a escala chega ao funcionário hoje — mural, impressa, WhatsApp? *(RF-54)*
8. Interesse em comparar previsto × realizado com o sistema de ponto? *(é onde a concorrência embute escala hoje)*

**Insumos a coletar**

9. **2 ou 3 escalas reais montadas para clientes**, do jeito que foram entregues. É a melhor fonte de requisito disponível e ainda não foi pedida.
10. Feedback dos 3 clientes que estão testando o protótipo.

**Comerciais**

11. Prazo alvo e data-âncora.
12. Formato da parceria entre as partes.

---

## 9. Faseamento

**Fase 1 — MVP operacional.** O protótipo vira sistema: login, empresa por CNPJ com isolamento de dados, equipe persistida, ausências e movimentação de pessoal, revisão de equipe na virada do mês, geração com busca local, os três níveis de alerta mais a recomendação de correção, edição com trava, publicação, histórico, PDF e Excel.
*Critério de pronto: o gestor monta e publica a escala do mês sem sair do sistema e sem planilha paralela, e no mês seguinte parte do que já existe.*

**Fase 2 — Alcance.** Turnos, canal WhatsApp, calendário de feriados, distribuição ao funcionário, trocas de folga, programação de férias, relatórios consolidados.

**Fase 3 — Integrações e inteligência.** Ponto (previsto × realizado), otimização anual de feriados e datas especiais, preferências individuais.

O corte da Fase 1 é conservador de propósito: entrega o ciclo completo de uma escala real. Um MVP sem ausências não é usável no dia a dia — e um sistema que não substitui a planilha atual não é adotado.

---

## 10. Registro de decisões

| Data | Decisão | Origem |
| --- | --- | --- |
| 05/08/2026 | Público-alvo é varejo em geral, empresas a partir de ~7–10 colaboradores | Reunião |
| 05/08/2026 | Licença e escala por CNPJ; funcionário não atravessa CNPJs | Reunião |
| 05/08/2026 | Ausências e movimentação de pessoal são requisito de primeira ordem | Reunião |
| 05/08/2026 | Sem integração com eSocial nem com sistema de folha | Reunião |
| 05/08/2026 | Turnos ficam para a Fase 2 | Reunião |
| 05/08/2026 | Mínimos de domingo vêm da convenção coletiva e variam | Reunião |
| Pós-reunião | Sem responsabilidade por regra errada; melhor esforço + aviso + recomendação | Decisão registrada |
| Pós-reunião | Acesso do funcionário ao sistema fora de escopo | Decisão registrada |
| Pós-reunião | Cota por licença não é requisito; modelo de negócio em aberto | Decisão registrada |
| Pós-reunião | Modelos de escala editáveis sem deploy e perfil de gerente por setor voltam a ser hipótese | Decisão registrada |
| Pós-reunião | Turno é contratual e muda apenas na virada do mês | Decisão registrada |

---

## 11. Riscos

| Risco | Mitigação |
| --- | --- |
| **Prazo comercial descolado do produto** — há intenção de vender de imediato, e o MVP atual não salva nada. Vender antes da persistência gera promessa que o produto não cumpre no segundo mês. | Alinhar o discurso comercial ao que a Fase 1 entrega, com data |
| Premissa do turno contratual se mostrar falsa em algum cliente | Confirmar antes de fechar escopo (7.3) |
| Regras de convenção coletiva concentradas em uma pessoa | Tratar a extração como atividade de projeto, com tempo alocado |
| Escala com escalas diferentes por setor aparecer no primeiro uso real | Responder a pergunta 1 antes de estimar |
| Escopo adjacente (regulamento, atividades, agente de dúvidas) se misturar ao da escala | Manter a separação da seção 5 na proposta |
| Cliente comparar o sistema com o protótipo e estranhar o que ficou para a Fase 2 | Anexar o faseamento à proposta |
