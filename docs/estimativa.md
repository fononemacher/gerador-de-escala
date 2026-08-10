# Estimativa de Esforço — Fase 1 (MVP), sem turnos

Estimativa de planejamento para dimensionar a proposta. **Não é base de contrato fechado**: quem for construir precisa revalidar, e as premissas abaixo estão explícitas justamente para tornar isso possível.

Escopo derivado de [`requisitos.md`](./requisitos.md), Fase 1, com turnos removidos e as preparações de arquitetura mantidas.

---

## 1. Premissas

Sem elas o número não significa nada.

1. **O protótipo é a base, sem redesenho de interface.** As telas das 3 etapas, o motor de geração, os três níveis de alerta, o diagnóstico de viabilidade e o PDF já existem e estão testados. Isso equivale a 150–250h já entregues, que não aparecem no total abaixo.
2. **Stack**: front React reaproveitado do protótipo + API própria + banco relacional.
3. **Equipe**: 1 desenvolvedor pleno/sênior full-stack. As horas são de desenvolvimento, não de calendário.
4. **Fora do escopo**: turnos, canal WhatsApp, billing, calendário automático de feriados, distribuição da escala ao funcionário, integrações e perfis de acesso granulares.
5. **Dentro do escopo**: as três preparações para turnos descritas em `requisitos.md` §7.3 — chave de turno na tabela de regras de cobertura, campo de turno persistido e conferência de cobertura dirigida por lista de regras.

---

## 2. Estimativa por bloco

| # | Bloco | Mín. | Máx. |
| --- | --- | ---: | ---: |
| 0 | Fundação: projeto, banco, migrations, ambientes, CI/CD, deploy, modelagem de dados | 40 | 64 |
| 1 | Autenticação, empresa por CNPJ e isolamento de dados | 48 | 72 |
| 2 | Cadastro de equipe persistido, campos trabalhistas, desligamento, importação por planilha | 48 | 68 |
| 3 | Configuração da escala, convenção coletiva parametrizável, copiar do mês anterior, tabela de regras com chave de turno | 60 | 88 |
| 4 | Ausências e movimentação: férias, afastamentos, admissão/demissão, revisão na virada do mês, snapshot da composição | 76 | 108 |
| 5 | Motor: portar para o backend, busca local, células travadas, sequência entre meses | 72 | 108 |
| 6 | Alertas e recomendação de correção | 44 | 64 |
| 7 | Escala: salvar/reabrir, estados, histórico e auditoria | 44 | 64 |
| 8 | Saída: PDF e Excel/CSV | 20 | 28 |
| 9 | Testes automatizados, QA, homologação, responsividade, documentação | 92 | 140 |
| | **Subtotal desenvolvimento** | **544** | **804** |
| | Gestão e coordenação (10–15%) | 55 | 120 |
| | **Total** | **~600** | **~925** |

### Calendário

| Equipe | Prazo |
| --- | --- |
| 1 desenvolvedor | 4 a 6 meses |
| 2 desenvolvedores | 2,5 a 3,5 meses |

Não é linear: os blocos 4 e 5 têm dependência entre si.

### Itens fora do total

| Item | Observação |
| --- | --- |
| **Escala diferente por setor** (RF-09) | **+16 a 24h.** Depende da pergunta 1 de `requisitos.md` §8, ainda sem resposta. Fora do total por não ser escopo confirmado. |
| **Levantamento das regras de convenção coletiva** | Trabalho de análise, não de desenvolvimento. Não dimensionável sem saber quantas convenções entram. |

---

## 3. Onde a estimativa pode furar

Três pontos concentram o risco.

**Busca local no motor (40–60h dentro do bloco 5).** É o item mais incerto. Se o conjunto de restrições se mostrar mais entrelaçado do que aparenta — folgas fixas somadas a mínimo de domingo somadas ao teto de dias consecutivos —, pode passar de 80h. **Recomendação: uma prova de conceito de duas semanas antes de fechar preço.** Ela derruba boa parte da incerteza da proposta inteira.

**Ausências (bloco 4).** Varia com a quantidade de tipos e de regras. A faixa cobre o essencial; controle de saldo de folga compensatória, por exemplo, está fora.

**Homologação (bloco 9).** Costuma ser subestimada em produto que substitui planilha: o usuário compara com o que fazia à mão e encontra diferenças que viram discussão de regra, não de defeito.

Com 12 perguntas ainda abertas no levantamento, esta estimativa deve ser tratada como **±30%**. Serve para decidir se o projeto é viável e em que ordem de grandeza.

---

## 4. Cortes possíveis

Em ordem de menor dano, caso o escopo precise caber em menos.

| Corte | Economia | Avaliação |
| --- | ---: | --- |
| Importação por planilha (cadastro manual no início) | 20–28h | Aceitável |
| Exportação Excel/CSV (somente PDF) | 12–16h | Aceitável |
| Auditoria detalhada → apenas data e autor da última alteração | 10–16h | Aceitável |
| Recomendação de correção → somente o alerta, sem sugestão | 24–36h | **Não recomendado** |

Os três primeiros somam ~50h e quase não afetam o uso diário.

O quarto não é recomendado: a recomendação de correção reaproveita a mesma busca do motor, então o ganho é pequeno diante do que se perde. É justamente o comportamento que sustenta a posição de "avisar e sugerir" definida em `requisitos.md` §7.2, e o que diferencia o produto do concorrente de cartão-ponto.
