# 🧭 Estado & Evolução — Rapidocs DS

> **Comece por aqui.** Este é o ponto de partida de cada sessão/chat: mostra
> **onde paramos**, qual o **próximo passo** e o **histórico de decisões** do
> design system. Para as regras e como rodar, veja o `CLAUDE.md`; para a visão
> completa, o `PRD.md`. Este arquivo é o *panorama e a trajetória* — os detalhes
> ficam nos arquivos do `.claude/`.
>
> _Última atualização: 2026-07-26_

---

## 📍 Onde paramos (estado atual)

**Fase atual:** Fase 2 começou — **primeiro componente (Alert) feito nas duas plataformas**, na branch `feature/componente-alert` (ainda não mergeada).

- ✅ **Ambiente montado**: monorepo pnpm, Style Dictionary v4, Storybook 8, CI de deploy no GitHub Pages.
- ✅ **Vitrine no ar**: https://senhorargel.github.io/rapidocs-ds/ (republica sozinha a cada push na `main`).
- ✅ **Cores extraídas do Figma** (`feature/fundacao-tokens`): 219 primitivas (light/dark + alpha) + 61 semânticas com descrição — **62 hoje**, com o `border/brand` recriado em 2026-07-23 —, light (`:root`) + dark (`[data-theme="dark"]`), web + Dart.
- ✅ **Espaçamento/tamanho/raio extraídos**: primitivas numéricas (`space`/`size`/`shape`, em px) + escala semântica (`padding`/`gap`/`component`) + forma/raio (modo Default). Arquivos `escala.json` e `forma.json`.
- ✅ **Quirks do Figma corrigidos na fonte**: `yellow/yellow` → `yellow` e `Sucess` → `Success` (renomeados no Figma + re-sincronizados).
- ✅ **Tipografia extraída**: família Archivo, 9 pesos, 23 tamanhos primitivos (`tipografia.json`) + os **28 text styles** (`text-styles.json`) gerando classes CSS `.text-*` (`tokens.typography.css`). Stories de Tipografia na vitrine.
- 🎉 **Fundação (variables + text styles) COMPLETA e PUBLICADA na `main`** — vitrine online atualizada (PRs #2 e #3 mergeados em 2026-07-21).
- ✅ **Logo adicionada**: 4 SVGs em `assets/logo/` (claro/escuro × 2) + story **Fundação/Marca** na vitrine.
- ✅ **Componentes do Figma auditados/corrigidos** (2026-07-23/24): **cores** — 208 bindings errados/órfãos corrigidos (refactor antigo `alert/*`→`feedback/*`, `background/*`→`surface/*` etc. deixou refs mortas), token `border/brand` recriado (Figma + repo); **tipografia** — 257 textos "Archivo solto" vinculados aos text styles do arquivo (Label/*, Caption/10/Bold). Verificação: 0 órfãos, 0 foreground-como-fundo, 0 onFill-errado, 0 texto solto.
- ✅ **Alert / Notification — primeiro componente da Fase 2** (`feature/componente-alert`, 2026-07-26): fiel ao component set `alert-notification 1.0` do Figma (5 status × 2 tamanhos), nas duas plataformas, tudo em token — nenhum valor solto.
  - **Web**: biblioteca `@rapidocs/ds-angular` (`components/angular/`) com `<rds-alert>` e `public-api.ts` como porta de entrada.
  - **App**: pacote Dart `rapidocs_ds` (`components/flutter/`) com `RdsAlert`, `lib/` e `pubspec.yaml` — o dev instala por uma linha e importa pelo nome.
  - **Vitrine**: um item "Alert" com chave de plataforma **Web (Angular) / App (Flutter)** e painel de código para copiar. A prévia de App é simulação com os tokens do Flutter (o Storybook não executa Flutter) e avisa isso na tela.
  - **Ícones oficiais** do Figma em `assets/icons/alert/` (SVG, `currentColor`) — o ícone do status `update` ainda é o "placeholder" da fonte.
- 🔧 **Dois bugs do build de tokens corrigidos** no caminho: o `tokens.dart` não compilava (descrição de token virava comentário de bloco e, como comentário de bloco **aninha** em Dart, engolia 437 das 438 declarações) e as dimensões Dart saíam **16x maiores** (o transformGroup `flutter` do Style Dictionary assume rem). Agora existe uma **trava no build** que falha se a saída Dart ficar inválida.
- ✅ **Rodada de paridade + acessibilidade (2026-07-26)**: web e app passaram a se comportar igual — anel de foco em `content/primary` nas duas (o token `action/focusRing/neutral` dá 1,73–2,16:1 sobre as surfaces de status e foi descartado), link e corpo só existem se tiverem texto, X sem quem escute o evento é anunciado **desativado**, hover em token (`action/hover/onColorSecondary`, no lugar do `opacity: 0.64` da web), alvo de toque do X em 44/40px nas duas, `Tooltip` removido do Flutter (não exigir `Overlay` de quem consome) e link com destino padrão `'#'` que não navega. Regras reutilizáveis em `.claude/patterns.md`.
- ⚠️ **Nada de Dart foi compilado**: Flutter/Dart não estão instalados nesta máquina. Há **11 testes de widget escritos** (`components/flutter/test/rds_alert_test.dart`), mas nunca executados (ver `.claude/debt.md`).
- ✅ **Vitrine alinhada ao produto**: `renderAlert()` segue as mesmas regras de conteúdo das plataformas (corpo/link só se o texto existir) e o X dos exemplos remove o alerta da página com opção "Restaurar exemplo" — a vitrine mostra o comportamento que o produto tem.

## 🎯 Próximo passo

1. **Commitar a exclusão de `tokens/build/dart/`** — hoje ela só existe na área de trabalho;
   o `HEAD` ainda tem os arquivos antigos (quebrados), então um `git checkout .` os devolveria.
2. Fechar a `feature/componente-alert` (`/review` → PR para `develop`).
3. Depois: escolher o **segundo componente** do Figma e repetir o padrão já estabelecido —
   CSS canônico compartilhado entre vitrine e Angular, widget Flutter sobre `RapidocsCores`,
   story com chave Web/App, mais as **regras de paridade** (ver `.claude/patterns.md`).

Pendências que atravessam os próximos componentes (`.claude/debt.md`): contraste
do ícone sobre o fundo abaixo de 3:1 (dívida de fundação), hover praticamente
invisível no tema escuro (`action/hover/onColorSecondary` é preto a 4% nos dois
temas — dívida de fundação), text styles em Dart, `radii/surface` e os modos
Rounded/Sharp não exportados, alvo de toque em 44/40 (abaixo dos 48 do Material,
desvio consciente) e rodar `dart analyze`/`flutter test` no primeiro ambiente com SDK.

## 🗺️ Mapa de leitura (onde está cada coisa)

| Preciso de... | Arquivo |
|---|---|
| Regras do projeto + como rodar | `CLAUDE.md` |
| Visão, roadmap e decisões de escopo | `PRD.md` |
| Padrões técnicos estabelecidos | `.claude/patterns.md` |
| Dívidas técnicas em aberto | `.claude/debt.md` |
| Componentes já criados | `.claude/components.md` |
| Histórico detalhado de features | `.claude/features-log.md` |
| Ver a vitrine (online) | https://senhorargel.github.io/rapidocs-ds/ |

## ✅ Regras de ouro (resumo — fonte completa no `CLAUDE.md`)

- **Token é compartilhado, componente não.** Tokens são uma fonte só; cada plataforma tem seu próprio componente bebendo dos mesmos tokens.
- **Branches:** `main` (produção, nunca commitar direto) · `develop` (base das features) · `feature/nome`.
- **Commits:** `feat:` · `fix:` · `chore:` · `docs:`.

## 📓 Linha do tempo (histórico — mais recente no topo)

- **2026-07-26** — **Paridade e acessibilidade do Alert**: as duas plataformas passaram a se comportar igual, com a decisão registrada em `.claude/patterns.md` para valer nos próximos componentes. Anel de foco em **`content/primary`** nas duas (medido: 16,90–18,44:1 no claro e 8,86–13,84:1 no escuro; o token `action/focusRing/neutral` é preto a 24% e dá **1,73–2,16:1** sobre as surfaces de status — descartado); **link e corpo só existem se tiverem texto**; **X sem quem escute o evento é anunciado desativado** (`dismiss.observed` no Angular, `Semantics(enabled: false)` no Flutter); **hover em token** (`action/hover/onColorSecondary`) no lugar do `opacity: 0.64`; **alvo de toque do X em 44/40px** nas duas, sem mexer no desenho de 20/16 do Figma; **`Tooltip` removido do Flutter** (o DS não deve exigir `Overlay` de quem consome); link com destino padrão `'#'` **não navega**. Também: 11 testes de widget Flutter escritos (não executados, sem SDK) e a documentação do repositório auditada — o `CLAUDE.md` ainda dizia que a fundação do Figma **não** tinha sido extraída, cinco dias depois de ela estar publicada.
- **2026-07-26** — **Fase 2 iniciada**: primeiro componente do DS, o **Alert**, em Angular (`@rapidocs/ds-angular`, `<rds-alert>`) e Flutter (`rapidocs_ds`, `RdsAlert`), mais a story na vitrine com **chave de plataforma Web/App** (um item por componente, não um por linguagem). No caminho: corrigido o bug que impedia o `tokens.dart` de compilar (descrição virava comentário de bloco e, porque comentário de bloco **aninha** em Dart, engolia **437 das 438** declarações) e o fator **16x** nas dimensões Dart; criados os **dois pacotes instaláveis** (`package.json` + `public-api.ts` no Angular; `pubspec.yaml` + `lib/` no Flutter), com os tokens Dart passando a nascer dentro do pacote Flutter.
- **2026-07-24** — Auditoria de **tipografia** dos componentes no Figma: 257 textos estavam com "Archivo solto" (sem text style). Todos vinculados ao text style equivalente (por tamanho+peso): Label/12–18/* e Caption/10/Bold (os 10px SemiBold, sem estilo próprio, mapeados p/ Bold). Verificação: 311/311 textos com estilo, 0 soltos.
- **2026-07-23** — Auditoria de tokens dos componentes no Figma: 161 bindings órfãos (apontando pra tokens deletados de um refactor antigo: `alert/*`, `background/*`, `content/brand`, `border/brand`) + erros de on-color no Botão/Item_tab. Corrigidos **208 bindings**, recriado o token `border/brand` (Figma + repo). Verificação final: 0 órfãos / 0 foreground-como-fundo / 0 onFill-errado. Também: 4 logos em `assets/logo/` + story Fundação/Marca; cores semânticas em tabela na vitrine.
- **2026-07-21** — Fundação levada pra produção: PR #2 (`feature/fundacao-tokens` → `develop`) e PR #3 (`develop` → `main`) mergeados; deploy OK, vitrine online atualizada. `develop` e `main` alinhadas.
- **2026-07-21** — Extraída a **tipografia**: primitivas de fonte (`tipografia.json`: família Archivo, pesos, tamanhos) + 28 text styles (`text-styles.json`) → classes `.text-*` (`tokens.typography.css`), com stories na vitrine. Camada `Font-Size/*` cross-library pulada (ver debt). **Fundação completa.**
- **2026-07-21** — Corrigidos no Figma os quirks `yellow/yellow`→`yellow` (20 vars) e `Sucess`→`Success` (7 vars), re-sincronizados. Extraídos os numéricos: primitivas `space`/`size`/`shape` + `escala.json` (padding/gap/component) + `forma.json` (raio, Default), com story de Escala & Forma na vitrine.
- **2026-07-21** — `feature/fundacao-tokens`: extraída a fundação de **cores** do Figma (219 primitivas + 61 semânticas light/dark com descrições). Gerados `tokens/src/{primitivos,semanticos,semanticos.dark}.json`, novo `build-tokens.mjs` (SD light+dark), saídas web+dart, e vitrine reescrita (lê tokens dinamicamente + toggle de tema). Detalhes: `.claude/features/fundacao-tokens.md`.
- **2026-07-21** — Máquina 2: repositório clonado; criada a pasta `assets/logo/` (aguardando SVG); `gh` CLI instalado e autenticado nesta máquina; criado este `ESTADO.md` como orquestrador de contexto e ligado ao `CLAUDE.md` para leitura automática no início de cada sessão.
- **2026-07-15** — `/brainstorm` gerou o `PRD.md`; `/ambiente` montou a base: monorepo pnpm, Style Dictionary v4 (tokens placeholder de cor), Storybook 8 e CI de deploy no GitHub Pages. Vitrine publicada com sucesso.

## 🔧 Como manter este arquivo (instruções para o Claude)

Ao final de cada sessão de trabalho relevante:
1. Atualize **"Onde paramos"** e **"Próximo passo"**.
2. Adicione **uma linha no topo da "Linha do tempo"** (data — o que foi feito — por quê).
3. Ajuste a data de _"Última atualização"_.

Mantenha enxuto: detalhes técnicos vão para os arquivos do `.claude/` e a visão
para o `PRD.md`. Aqui fica só o panorama e a trajetória.
