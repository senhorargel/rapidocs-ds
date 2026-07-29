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
  > **Nota de migração (2026-07-26):** este caminho **não existe mais**. Os tokens Dart passaram a
  > ser gerados dentro do pacote Flutter, em `components/flutter/lib/src/tokens/tokens.dart` e
  > `tokens.dark.dart`, e as classes hoje se chamam **`RapidocsTokens`** e **`RapidocsTokensDark`**
  > (o nome já havia mudado de `RapidocsColors` para `RapidocsTokens` ainda em 2026-07-21, quando o
  > build passou a emitir também as dimensões). A linha acima fica como registro do que valia na
  > data desta feature. Detalhes em `.claude/patterns.md` e `.claude/debt.md`.
- `apps/storybook/stories/Fundacao.stories.ts` — lê os tokens dinamicamente (escalas + semânticas c/ descrição).
- `apps/storybook/.storybook/preview.ts` — importa CSS light+dark + toggle de tema.

## Como foi extraído
Plugin figma-console (Desktop Bridge) → `figma_export_tokens` (DTCG, dry-run p/ inspeção, depois real) → script Node `scratchpad/transform-tokens.mjs` que limpa a estrutura (remove raiz de coleção, metadados e floats; reescreve refs `{primitives.x}`→`{x}`).

## Extensões (mesma feature, 2026-07-21)
- **Numérico**: primitivas `space`/`size`/`shape` (px) em `primitivos.json`; `escala.json` (padding/gap/component → referenciam size/space); `forma.json` (raio por componente, modo Default). Story "Escala & Forma".
- **Tipografia**: `tipografia.json` (família Archivo, 9 pesos, 23 tamanhos) + `text-styles.json` (28 text styles `typography`) → classes `.text-*` em `tokens.typography.css`. Story "Tipografia".
- Build (`build-tokens.mjs`): light Dart agora é `RapidocsTokens`; formato customizado `css/typography-classes` p/ os text styles.

## Correções aplicadas no Figma
- `color/yellow/yellow/*` → `color/yellow/*`: 20 variáveis renomeadas no Figma e re-sincronizadas (aliases por ID preservados) — 2026-07-21.
- `color/alpha/Sucess/*` → `color/alpha/Success/*`: 7 variáveis renomeadas no Figma — 2026-07-21.

## Pendências (ver debt.md)
- Demais variables: text styles, `scale`, `shape`, `font-family`, `.primitive-fonts`.
- Quirk do Figma a corrigir na fonte: `color/alpha/Sucess` (grafia "Sucess").
