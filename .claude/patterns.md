# Padrões estabelecidos

Formato: `decisão técnica — desde quando vale`

- Tokens em formato DTCG, transformados por Style Dictionary v4 — 2026-07-15
- Nomes de token **espelham fielmente o Figma** (em inglês: `color/`, `content/`, `surface/`, `feedback/`…). O nome do arquivo-fonte é PT (`primitivos`/`semanticos`), mas os caminhos dos tokens seguem o Figma — 2026-07-21 _(corrige a nota anterior que dizia "nomes em português")_
- Separação primitivas × semânticas: `primitivos.json` = escalas cruas de cor; `semanticos.json` = tokens de uso que **referenciam** as primitivas e têm `$description` — 2026-07-21
- Light/dark: as primitivas já trazem `light` e `dark` no caminho (`color.neutral.light.*` / `.dark.*`); as semânticas têm arquivo `semanticos.json` (light, padrão) + `semanticos.dark.json` (override). O build gera `:root` (light) e `[data-theme="dark"]` no CSS — 2026-07-21
- `outputReferences` ligado no build web: no `tokens.css`, as semânticas saem como `var(--primitiva)` (preserva o encadeamento semântica→primitiva) — 2026-07-21
- Extração do Figma: plugin figma-console (Desktop Bridge) → `figma_export_tokens` (DTCG) → script Node de transformação p/ a estrutura limpa. Evita transcrição manual — 2026-07-21
- Build de tokens roda via `node build-tokens.mjs` (duas instâncias do Style Dictionary: light + dark) — 2026-07-21
- `tokens/build/` é versionado no Git (consumo via Git dependency na Fase 1) — 2026-07-15
- Monorepo com pnpm; usar `corepack pnpm` quando pnpm não estiver no PATH — 2026-07-15
