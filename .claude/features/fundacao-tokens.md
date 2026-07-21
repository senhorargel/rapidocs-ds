# feature/fundacao-tokens

**Data:** 2026-07-21 · **Escopo:** fundação de **cores** (primeira entrega de conteúdo real)

## O que foi feito
Extração das cores do Figma "Rapidocs System [Piloto]" (coleções `.primitives` e `semantic-colors`) e materialização como tokens DTCG + saídas de build + vitrine.

## Fonte (Figma)
- `.primitives` (modo único `value`) → **219 primitivas de cor**: escalas `color/{hue}/{light|dark}/{100..1000}` para blue, neutral, brand, purple, green, orange, pink, yellow, red + alpha (`color/alpha/*`).
- `semantic-colors` (modos `light` + `dark`) → **61 semânticas** com `$description`, referenciando primitivas (algumas referenciam outras semânticas, ex.: `action/active` → `brand/fill`).

## Arquivos gerados/alterados
- `tokens/src/primitivos.json` — 219 primitivas (hex; alpha em hex8).
- `tokens/src/semanticos.json` — 61 semânticas (light) com `$description` + referências.
- `tokens/src/semanticos.dark.json` — 61 semânticas (dark).
- `tokens/build-tokens.mjs` — novo build (substitui `style-dictionary.config.mjs`); 2 instâncias SD (light + dark).
- `tokens/build/web/tokens.css` (`:root`) + `tokens.dark.css` (`[data-theme="dark"]`) + `tokens.scss`.
- `tokens/build/dart/tokens.dart` (`RapidocsColors`) + `tokens.dark.dart` (`RapidocsColorsDark`).
- `apps/storybook/stories/Fundacao.stories.ts` — lê os tokens dinamicamente (escalas + semânticas c/ descrição).
- `apps/storybook/.storybook/preview.ts` — importa CSS light+dark + toggle de tema.

## Como foi extraído
Plugin figma-console (Desktop Bridge) → `figma_export_tokens` (DTCG, dry-run p/ inspeção, depois real) → script Node `scratchpad/transform-tokens.mjs` que limpa a estrutura (remove raiz de coleção, metadados e floats; reescreve refs `{primitives.x}`→`{x}`).

## Correções aplicadas no Figma
- `color/yellow/yellow/*` → `color/yellow/*`: 20 variáveis renomeadas no Figma e re-sincronizadas (aliases por ID preservados) — 2026-07-21.

## Pendências (ver debt.md)
- Demais variables: text styles, `scale`, `shape`, `font-family`, `.primitive-fonts`.
- Quirk do Figma a corrigir na fonte: `color/alpha/Sucess` (grafia "Sucess").
