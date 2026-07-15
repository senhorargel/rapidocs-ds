# PRD — Rapidocs DS (Design System)

> Gerado por /brainstorm em 2026-07-15

## 1. Produto
- **Nome:** Rapidocs DS
- **Descrição em 1 linha:** Design System multiplataforma do Rapidocs — tokens de fundação (Figma como fonte da verdade) distribuídos como código para Angular (web) e Flutter (mobile).
- **Problema:** Manter consistência visual (cores, tipografia, espaçamentos, radius) entre o app mobile (Flutter) e a web (Angular) a partir de uma única fonte da verdade no Figma, sem retrabalho manual.
- **Usuário-alvo:** No início, o próprio time do Rapidocs (Argel no design/tokens + 1 dev nos apps). Repo público como vitrine/portfólio; terceiros poderão consumir na Fase 2.
- **Tipo:** MVP (fundação primeiro; componentes depois)
- **Diferencial:** Um único conjunto de tokens gerando saída automática para dois ecossistemas distintos (TypeScript/CSS e Dart).
- **Concorrentes/referências:** Design systems open source (ex: abordagens tipo Material, Radix Tokens) — aqui o foco é o pipeline próprio Figma → multiplataforma.

## 2. Negócio
- **Modelo de receita:** N/A (biblioteca interna / portfólio open source)
- **Monetização desde o dia 1:** Não
- **Volume esperado em 6 meses:** Consumo interno pelos apps do Rapidocs; abertura pública gradual.

## 3. Plataforma
- **Tipo:** Monorepo poliglota — biblioteca/tooling (não é app). Saídas para Web (Angular) e Mobile (Flutter).
- **Regiões/idiomas:** N/A (biblioteca)
- **Offline-first:** N/A
- **Tempo real:** N/A

## 3.1 Design System
- **Cenário:** Este projeto **é** o Design System (fonte: Figma com fundações, variáveis, estilos, tokens primitivos e semânticos já definidos).
- **Fonte da verdade:** Figma, lido via **MCP do Figma** → JSON de tokens (formato DTCG).
- **Fundação no Figma:** Sim (primitivos + semânticos)
- **Storybook:** Sim — vitrine pública com cores/tipografia/espaçamentos na fase de fundação (páginas MDX). Componentes entram depois.

## 4. Recursos técnicos
- **Autenticação:** N/A
- **Roles/permissões:** N/A (Argel = design/tokens; dev = implementação nos apps)
- **Pagamentos:** N/A
- **Uploads:** N/A
- **Integrações externas:** Figma (via MCP) como origem dos tokens
- **IA:** Não
- **Dados sensíveis / LGPD:** Não
- **Notificações:** N/A

## 5. Restrições
- **Time:** Argel (DS/tokens/Figma) + 1 dev (Angular + Flutter nos apps)
- **Prazo MVP:** Esta semana — fundação/tokens gerando código nos dois mundos + Storybook no ar (GitHub Pages)
- **Budget infra/mês:** R$ 0 (Fase 1). DigitalOcean opcional na Fase 2 (~R$ 35/mês)
- **Design System existente:** Sim, é o próprio objeto do projeto
- **Domínio/hospedagem:** GitHub agora (repo público + GitHub Pages pro Storybook). DigitalOcean depois, com o dev.
- **Licença:** MIT (repo público)
- **SEO necessário:** Não (é vitrine técnica, não site de conteúdo)

## 6. Análise crítica
- **Contradição resolvida — distribuição:** pedido inicial de "publicar pra terceiros instalarem" vs. "só a gente por enquanto / não conhece npm". **Decisão:** NÃO publicar em npm/pub.dev agora; consumir o DS **direto do GitHub** (git dependency, suportado por Angular e Flutter). Publicar nas lojas públicas vira **Fase 2**.
- **Contradição resolvida — hospedagem:** "Storybook no ar essa semana" vs. "dev hospeda na DigitalOcean depois". **Decisão:** vitrine essa semana via **GitHub Pages (grátis)**; DigitalOcean fica pra Fase 2 sem bloquear o prazo.
- **Anti over-engineering:** monorepo poliglota NÃO usará Nx/Turborepo/Changesets no início — estrutura por pastas + Style Dictionary resolve.
- **Gargalo principal:** consistência da saída do Figma. Token semântico que não referencia bem o primitivo quebra a geração. **Primeira validação** no /ambiente ou /feature: conferir o JSON de tokens real gerado a partir do Figma.
- **Escopo da semana:** realista para fundação; componentes ficam para depois (já cortado corretamente).

## 7. Stack recomendada
- **Motor de tokens:** Style Dictionary v4 — transforma tokens JSON em CSS/SCSS (Angular) e Dart (Flutter) simultaneamente. Peça central.
- **Formato de tokens:** DTCG (padrão W3C), lido nativamente pelo Style Dictionary.
- **Ingestão:** MCP do Figma → JSON DTCG (requer conector Figma autorizado — feito no /ambiente).
- **Monorepo:** pnpm workspaces + organização por pastas.
  - Estrutura sugerida:
    - `packages/tokens/` — JSON de tokens + config e build do Style Dictionary + saídas web
    - `flutter/rapidocs_tokens/` — pacote Flutter/Dart (saída Dart dos tokens), consumido via git dependency
    - `apps/storybook/` — vitrine (Storybook 8, docs MDX de fundação)
    - `.github/workflows/` — build de tokens + deploy do Storybook no GitHub Pages
- **Vitrine:** Storybook 8 (páginas MDX mostrando cores/tipografia/espaçamentos).
- **Distribuição (Fase 1):** consumo direto via GitHub (git dependency). Publicação manual.
- **Hospedagem da vitrine:** GitHub Pages (grátis); DigitalOcean na Fase 2.
- **Git/CI:** GitHub (repo público, MIT) + GitHub Actions.
- **Linguagens:** TypeScript (tokens/Angular) + Dart (Flutter).

**Custo Fase 1:** R$ 0/mês. **Fase 2 (opcional):** DigitalOcean ~R$ 35/mês; publicação em npm/pub.dev grátis para open source.

**Não recomendado agora:** Nx/Turborepo, publicação em registries, Changesets/versionamento automático.

## 8. Próximos passos
Rodar `/ambiente` para configurar:
- Repositório **GitHub público** `rapidocs-ds` + licença MIT + `.gitignore`
- **Conector Figma (MCP)** autorizado — pré-requisito pra ler os tokens
- **pnpm workspace** + estrutura de pastas (`packages/tokens`, `flutter/rapidocs_tokens`, `apps/storybook`)
- **Style Dictionary** instalado e configurado (pipeline JSON → CSS/SCSS + Dart)
- **Storybook 8** inicial com páginas de docs de fundação
- **GitHub Actions**: build de tokens + deploy do Storybook no GitHub Pages
- `CLAUDE.md` com o contexto do projeto e convenções

Depois do /ambiente: `/feature` para a primeira entrega — ler os tokens do Figma e gerar a fundação nos dois mundos.
