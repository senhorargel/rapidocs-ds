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

**Fase atual:** Fase 1 — Fundação (tokens). Cores extraídas do Figma; faltam as demais variables.

- ✅ **Ambiente montado**: monorepo pnpm, Style Dictionary v4, Storybook 8, CI de deploy no GitHub Pages.
- ✅ **Vitrine no ar**: https://senhorargel.github.io/rapidocs-ds/ (republica sozinha a cada push na `main`).
- ✅ **Cores extraídas do Figma** (`feature/fundacao-tokens`): 219 primitivas (escalas light/dark + alpha) + 61 semânticas com descrição de uso, referenciando as primitivas. Build gera light (`:root`) e dark (`[data-theme="dark"]`) para web + Dart. Vitrine reescrita mostra tudo com toggle de tema.
- ⏳ **Faltam as outras variables**: text styles, `scale` (espaçamento/tamanho), `shape`, `font-family`.
- 🕒 **Componentes (Angular/Flutter)**: não iniciados — são Fase 2.
- 📁 **Pasta `assets/logo/`** criada, aguardando o SVG da logo.

## 🎯 Próximo passo

**Extrair as demais variables do Figma**, na mesma abordagem das cores: começar
pelos **text styles / tipografia** (`font-family`, `.primitive-fonts`, tamanhos)
e depois `scale` (espaçamento/tamanho/gap) e `shape` (raio de borda). Ao final,
rebuild e conferir na vitrine.

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
