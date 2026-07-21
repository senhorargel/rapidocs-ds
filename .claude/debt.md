# Dívidas técnicas

Formato: `[ ] item — motivo — desde quando` (marcar [x] quando resolvido)

- [x] Tokens em `tokens/src/` são placeholders — ~~substituir pela extração real do Figma via MCP~~ **RESOLVIDO (cores) em 2026-07-21**: 219 primitivas + 61 semânticas extraídas do Figma. Faltam as outras categorias (ver abaixo) — 2026-07-15
- [ ] Extrair as demais variables do Figma: text styles, `scale` (spacing/size/gap/padding/component), `shape`, `font-family`, `.primitive-fonts` — só as cores foram feitas — 2026-07-21
- [ ] Quirks no Figma a corrigir na fonte (espelhados fiéis por ora): grupo `color/yellow/yellow/...` tem "yellow" duplicado; `color/alpha/Sucess/...` está grafado "Sucess". Corrigir no Figma e re-sincronizar — 2026-07-21
- [ ] Scripts raiz `build:tokens`/`storybook`/`build:storybook` chamam `pnpm` direto (sem corepack) — falham localmente se pnpm não está no PATH (no CI funciona). Local: usar `corepack pnpm --dir <pacote> run <script>` — 2026-07-21
- [ ] Flutter/Dart não instalados — necessário só quando começar os componentes Flutter (Fase 2) — 2026-07-15
- [ ] Publicação em npm/pub.dev — Fase 2 — 2026-07-15
