# Rapidocs DS

Design System multiplataforma do **Rapidocs**. Uma fonte da verdade no Figma
gera tokens de fundação consumidos por **Angular** (web) e **Flutter** (mobile).

> **Regra de ouro:** token é compartilhado, componente não é.
> Os tokens são únicos; os componentes de cada plataforma bebem dos mesmos tokens.

## Estrutura

```
rapidocs-ds/
├── tokens/                # Fonte da verdade — JSON (DTCG) + Style Dictionary
│   ├── src/                 primitivos.json + semanticos.json
│   └── build/               saidas geradas: web/ (css, scss) e dart/
├── components/
│   ├── angular/           # Componentes Angular (TypeScript) — Fase 2
│   └── flutter/           # Componentes Flutter (Dart) — Fase 2
└── apps/
    └── storybook/         # Vitrine do Design System
```

## Fluxo dos tokens

```
Figma ──(MCP)──► tokens/src/*.json ──(Style Dictionary)──► web/tokens.css  ─► Angular
                                                          └ dart/tokens.dart ─► Flutter
```

## Como rodar

```bash
# Gerar os tokens (css/scss + dart)
pnpm build:tokens

# Rodar a vitrine (Storybook)
pnpm storybook
```

> Este projeto usa **pnpm** via corepack. Se `pnpm` não estiver no PATH,
> use `corepack pnpm <comando>`.

## Consumo

Enquanto o DS não é publicado em npm/pub.dev (Fase 2), os apps consomem
direto deste repositório via dependência Git.

## Licença

MIT
