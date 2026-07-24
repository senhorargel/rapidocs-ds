# 🧭 Estado & Evolução — Rapidocs DS

> **Comece por aqui.** Este é o ponto de partida de cada sessão/chat: mostra
> **onde paramos**, qual o **próximo passo** e o **histórico de decisões** do
> design system. Para as regras e como rodar, veja o `CLAUDE.md`; para a visão
> completa, o `PRD.md`. Este arquivo é o *panorama e a trajetória* — os detalhes
> ficam nos arquivos do `.claude/`.
>
> _Última atualização: 2026-07-21_

---

## 📍 Onde paramos (estado atual)

**Fase atual:** Fase 1 concluída — fundação completa e publicada; componentes do Figma auditados/corrigidos. Pronto para a Fase 2 (componentes de código).

- ✅ **Ambiente montado**: monorepo pnpm, Style Dictionary v4, Storybook 8, CI de deploy no GitHub Pages.
- ✅ **Vitrine no ar**: https://senhorargel.github.io/rapidocs-ds/ (republica sozinha a cada push na `main`).
- ✅ **Cores extraídas do Figma** (`feature/fundacao-tokens`): 219 primitivas (light/dark + alpha) + 61 semânticas com descrição, light (`:root`) + dark (`[data-theme="dark"]`), web + Dart.
- ✅ **Espaçamento/tamanho/raio extraídos**: primitivas numéricas (`space`/`size`/`shape`, em px) + escala semântica (`padding`/`gap`/`component`) + forma/raio (modo Default). Arquivos `escala.json` e `forma.json`.
- ✅ **Quirks do Figma corrigidos na fonte**: `yellow/yellow` → `yellow` e `Sucess` → `Success` (renomeados no Figma + re-sincronizados).
- ✅ **Tipografia extraída**: família Archivo, 9 pesos, 23 tamanhos primitivos (`tipografia.json`) + os **28 text styles** (`text-styles.json`) gerando classes CSS `.text-*` (`tokens.typography.css`). Stories de Tipografia na vitrine.
- 🎉 **Fundação (variables + text styles) COMPLETA e PUBLICADA na `main`** — vitrine online atualizada (PRs #2 e #3 mergeados em 2026-07-21).
- ✅ **Logo adicionada**: 4 SVGs em `assets/logo/` (claro/escuro × 2) + story **Fundação/Marca** na vitrine.
- ✅ **Componentes do Figma auditados/corrigidos** (2026-07-23): 208 bindings errados/órfãos corrigidos (refactor antigo `alert/*`→`feedback/*`, `background/*`→`surface/*` etc. deixou refs mortas), token `border/brand` recriado no Figma + sincronizado no repo. Arquivo 100% correto (0 órfãos, 0 foreground-como-fundo, 0 onFill errado).
- 🕒 **Componentes de código (Angular/Flutter)**: não iniciados — são Fase 2.

## 🎯 Próximo passo

Fundação publicada. Começar a **Fase 2 — componentes** (Angular primeiro, depois
Flutter) consumindo estes tokens: `components/angular/` usa `@rapidocs/tokens/css`
(+ `/css-typography`); `components/flutter/` usa `RapidocsTokens` do Dart.
Pontos abertos antes/durante: ver `.claude/debt.md` (raio Rounded/Sharp, text styles no Dart, etc.).

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
