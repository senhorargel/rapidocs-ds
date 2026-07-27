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
- Componentes: Angular (TS) + Flutter (Dart) — Fase 2, já em andamento (ver `ESTADO.md`)
- Hospedagem da vitrine: GitHub Pages (CI); DigitalOcean na Fase 2
- Distribuição: consumo via Git; npm/pub.dev na Fase 2

## Estrutura de pastas
- `tokens/src/` — tokens DTCG: `primitivos.json`, `semanticos.json` + `semanticos.dark.json`,
  `escala.json`, `forma.json`, `tipografia.json`, `text-styles.json`
- `tokens/build/web/` — saídas web geradas (`tokens.css`, `tokens.dark.css`, `tokens.scss`,
  `tokens.typography.css`), versionadas p/ consumo via Git
- `components/angular/` — biblioteca `@rapidocs/ds-angular` (`package.json` + `public-api.ts` + uma pasta por componente)
- `components/flutter/` — pacote Dart `rapidocs_ds` (`pubspec.yaml` + `lib/`); os **tokens Dart gerados moram aqui**, em `lib/src/tokens/`, porque um pacote Dart não importa nada de fora dele
- `assets/icons/` — ícones oficiais em SVG (cópia sincronizada dentro do pacote Flutter)
- `apps/storybook/` — vitrine

## Fluxo dos tokens
Figma → `tokens/src/*.json` → Style Dictionary →
`tokens/build/web/tokens.css` (Angular + vitrine) +
`components/flutter/lib/src/tokens/tokens.dart` (Flutter)

## Convenção de branches
- `main` — produção (vitrine publicada), nunca commitar direto
- `develop` — desenvolvimento, base pras features
- `feature/nome` — uma branch por funcionalidade

## Convenção de commits
- `feat:` nova funcionalidade · `fix:` correção · `chore:` config/deps · `docs:` documentação

## Como rodar localmente
- `corepack pnpm install`
- `corepack pnpm build:tokens` — gera as saídas web (`tokens/build/web/`) **e** os tokens Dart
  dentro do pacote Flutter (`components/flutter/lib/src/tokens/`)
- `corepack pnpm storybook` — abre a vitrine
- Se `pnpm` não estiver no PATH, os scripts da raiz podem falhar (eles chamam `pnpm` direto).
  Atalho: `corepack pnpm --dir tokens run build` · `corepack pnpm --dir apps/storybook run storybook`

## Design System
- Cenário: este projeto É o DS (fonte: Figma "Rapidocs System [Piloto]", primitivos + semânticos)
- **Fundação Figma extraída: SIM, desde 2026-07-21** — não existe mais placeholder em `tokens/src/`.
  O que está lá hoje veio do Figma via MCP: **219 primitivas de cor** + 35 `space` + 23 `size` +
  15 `shape` (`primitivos.json`); **62 semânticas de cor** com descrição, em claro e escuro
  (`semanticos.json` / `semanticos.dark.json` — 61 da extração + `border/brand`, recriado em
  2026-07-23); escala de `padding`/`gap`/`component` (`escala.json`); raio (`forma.json`);
  tipografia (`tipografia.json`: família Archivo, 9 pesos, 23 tamanhos); e os **28 text styles**
  (`text-styles.json`), que geram as 28 classes `.text-*` de `tokens.typography.css`.
- **O que ficou de fora da fundação** (detalhe e status em `.claude/debt.md`):
  - os modos **Rounded** e **Sharp** da coleção `shape` — só o `Default` está no build;
  - o token **`radii/surface`**, que o Figma usa no Alert Large — o código usa `component/s` no lugar;
  - os **text styles em Dart** — só o CSS `.text-*` é gerado, então o componente Flutter ainda
    carrega tamanho/peso/altura de linha como literais;
  - a camada `font-family/Font-Size/*` do Figma (referencia outra biblioteca, cross-library).
- Storybook: Sim — `corepack pnpm storybook`

## Registro vivo (consultar antes de codar)
- **Estado atual + próximo passo + histórico: `ESTADO.md` — LER PRIMEIRO no início de cada sessão**
- Componentes já criados: `.claude/components.md`
- Padrões estabelecidos: `.claude/patterns.md`
- Dívidas técnicas: `.claude/debt.md`
- Histórico de features (sob demanda): `.claude/features-log.md`

## PRD completo
Ver `PRD.md` na raiz.
