# Rapidocs DS

## O que é esse projeto
Design System multiplataforma do Rapidocs: uma fonte da verdade no Figma gera
tokens de fundação consumidos por Angular (web) e Flutter (mobile).

## Usuário-alvo
Time do Rapidocs (Argel = design/tokens; +1 dev = implementação nos apps).
Repo público como vitrine; terceiros consomem na Fase 2.

## Regra de ouro do DS
Token é compartilhado, componente não é. Tokens são uma fonte só; cada
plataforma tem seu próprio código de componente bebendo dos mesmos tokens.

## Stack
- Fonte da verdade: Figma (lido via MCP → JSON DTCG)
- Motor de tokens: Style Dictionary v4 (`tokens/`)
- Monorepo: pnpm workspaces (usar `corepack pnpm` se pnpm não estiver no PATH)
- Vitrine: Storybook 8 (`apps/storybook/`)
- Componentes: Angular (TS) + Flutter (Dart) — Fase 2
- Hospedagem da vitrine: GitHub Pages (CI); DigitalOcean na Fase 2
- Distribuição: consumo via Git; npm/pub.dev na Fase 2

## Estrutura de pastas
- `tokens/src/` — tokens DTCG (primitivos.json, semanticos.json)
- `tokens/build/` — saídas geradas: `web/` (css, scss) e `dart/` (versionadas p/ consumo via Git)
- `components/angular/` — componentes Angular (Fase 2)
- `components/flutter/` — componentes Flutter (Fase 2)
- `apps/storybook/` — vitrine

## Fluxo dos tokens
Figma → `tokens/src/*.json` → Style Dictionary → `web/tokens.css` (Angular) + `dart/tokens.dart` (Flutter)

## Convenção de branches
- `main` — produção (vitrine publicada), nunca commitar direto
- `develop` — desenvolvimento, base pras features
- `feature/nome` — uma branch por funcionalidade

## Convenção de commits
- `feat:` nova funcionalidade · `fix:` correção · `chore:` config/deps · `docs:` documentação

## Como rodar localmente
- `corepack pnpm install`
- `corepack pnpm build:tokens` — gera css/scss + dart
- `corepack pnpm storybook` — abre a vitrine

## Design System
- Cenário: este projeto É o DS (fonte: Figma com primitivos + semânticos)
- Fundação Figma extraída: NÃO ainda — placeholders em `tokens/src/`; extração real no /feature via MCP
- Storybook: Sim — `corepack pnpm storybook`

## Registro vivo (consultar antes de codar)
- **Estado atual + próximo passo + histórico: `ESTADO.md` — LER PRIMEIRO no início de cada sessão**
- Componentes já criados: `.claude/components.md`
- Padrões estabelecidos: `.claude/patterns.md`
- Dívidas técnicas: `.claude/debt.md`
- Histórico de features (sob demanda): `.claude/features-log.md`

## PRD completo
Ver `PRD.md` na raiz.
