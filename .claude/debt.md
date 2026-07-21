# Dívidas técnicas

Formato: `[ ] item — motivo — desde quando` (marcar [x] quando resolvido)

- [x] Tokens em `tokens/src/` são placeholders — ~~substituir pela extração real do Figma via MCP~~ **RESOLVIDO (cores) em 2026-07-21**: 219 primitivas + 61 semânticas extraídas do Figma. Faltam as outras categorias (ver abaixo) — 2026-07-15
- [ ] Extrair as demais variables do Figma: text styles, `scale` (spacing/size/gap/padding/component), `shape`, `font-family`, `.primitive-fonts` — só as cores foram feitas — 2026-07-21
- [x] ~~`color/yellow/yellow/...` com "yellow" duplicado~~ **CORRIGIDO no Figma (20 variáveis renomeadas p/ `color/yellow/...`) e re-sincronizado** — 2026-07-21
- [x] ~~`color/alpha/Sucess/...` grafado "Sucess"~~ **CORRIGIDO no Figma (7 vars → "Success") e re-sincronizado** — 2026-07-21
- [ ] Modos `Rounded` e `Sharp` da coleção `shape` não estão no build — só o `Default` (forma.json). Wire quando precisar do tema de arredondamento — 2026-07-21
- [ ] Observação: `scale` e `shape` usam ambos o prefixo `component/*` no Figma (sizing vs raio). Não colidem no CSS (sufixos diferentes: numérico vs t-shirt), mas é ambíguo — avaliar renomear na fonte — 2026-07-21
- [~] 9 variáveis `font-family/Font-Size/*` (Caption, Label, Title Mobile) referenciam outra biblioteca do Figma (cross-library) — **contornado**: modelamos a tipografia via primitivas locais (`.primitive-fonts`) + os 28 text styles (valores concretos); a camada semântica `Font-Size/*` foi pulada. Reavaliar se essa biblioteca externa for integrada — 2026-07-21
- [ ] Text styles no Dart: só o CSS (`tokens.typography.css`, classes `.text-*`) foi gerado; falta gerar `TextStyle`s no Dart (Fase 2, quando começarem os componentes Flutter) — 2026-07-21
- [ ] Scripts raiz `build:tokens`/`storybook`/`build:storybook` chamam `pnpm` direto (sem corepack) — falham localmente se pnpm não está no PATH (no CI funciona). Local: usar `corepack pnpm --dir <pacote> run <script>` — 2026-07-21
- [ ] Flutter/Dart não instalados — necessário só quando começar os componentes Flutter (Fase 2) — 2026-07-15
- [ ] Publicação em npm/pub.dev — Fase 2 — 2026-07-15
