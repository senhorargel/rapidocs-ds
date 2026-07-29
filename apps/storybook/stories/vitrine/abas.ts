/**
 * Abas da página de componente — o "one page" da vitrine.
 *
 * Toda página de componente tem as MESMAS abas (Visão Geral · Regras de uso ·
 * Código · Acessibilidade) e, dentro da aba Código, um seletor de linguagem
 * (Angular · Flutter). Este módulo é a folha de estilo compartilhada por todas
 * elas: o componente novo copia o markup do `Alert.mdx` e importa este CSS.
 *
 * POR QUE CSS PURO (rádio + `:checked`) E NÃO JAVASCRIPT:
 * a vitrine roda em `@storybook/html-vite` e o React não é dependência direta
 * deste pacote — então não há como usar estado de componente aqui. A troca de
 * aba é feita por `<input type="radio">` escondido + `<label>`, que o navegador
 * já resolve sozinho: funciona sem script, sobrevive ao build estático do
 * GitHub Pages e é operável por teclado (Tab entra no grupo, as setas trocam de
 * aba — comportamento nativo de grupo de rádio).
 *
 * O rádio fica invisível mas NÃO usa `display:none` (que o tiraria do foco):
 * ele é posicionado fora da vista com opacidade zero, e o anel de foco é
 * desenhado no `<label>` correspondente via `:focus-visible`.
 */

/**
 * CSS das abas. Use em MDX assim:
 *
 * ```mdx
 * import { ABAS_CSS } from '../vitrine/abas';
 * <style>{ABAS_CSS}</style>
 * ```
 *
 * Contrato do markup (ver `Alert.mdx`): dentro de `.rds-abas` vêm primeiro os
 * `<input type="radio">` (um por aba, com `id` = `aba-<slug>`), depois a barra
 * `.rds-abas__barra` com um `<label htmlFor>` por aba, e depois um
 * `.rds-abas__painel` por aba com `data-aba="<slug>"`. Os seletores abaixo usam
 * o combinador `~`, então essa ORDEM importa.
 */
export const ABAS_CSS = `
/* ── Grupo de abas ──────────────────────────────────────────────────────── */
.rds-abas {
  position: relative;
  font-family: var(--familia-archivo), ui-sans-serif, system-ui, sans-serif;
  color: var(--content-primary);
  margin: 0 0 40px;
}

/* Rádio fora da vista, mas ainda focável (por isso não é display:none). */
.rds-abas > input[type='radio'] {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
  margin: 0;
}

/* ── Barra das abas ─────────────────────────────────────────────────────── */
.rds-abas__barra {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 6px;
  margin: 0 0 28px;
  border: 1px solid var(--border-primary);
  border-radius: var(--component-m);
  background: var(--surface-secondary);
}

.rds-abas__barra label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: var(--component-xs);
  font-size: var(--tamanho-14);
  font-weight: var(--peso-semibold);
  line-height: 1.45;
  color: var(--content-secondary);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.rds-abas__barra label:hover {
  background: var(--action-hover-on-color-secondary);
  color: var(--content-primary);
}

/* ── Painéis ────────────────────────────────────────────────────────────── */
.rds-abas__painel { display: none; }

/* Aba ativa: pinta o rótulo e mostra o painel correspondente.
   (Um par de regras por aba — o CSS não tem como derivar o slug.) */
#aba-visao:checked   ~ .rds-abas__barra label[for='aba-visao'],
#aba-regras:checked  ~ .rds-abas__barra label[for='aba-regras'],
#aba-codigo:checked  ~ .rds-abas__barra label[for='aba-codigo'],
#aba-a11y:checked    ~ .rds-abas__barra label[for='aba-a11y'] {
  background: var(--surface-primary);
  color: var(--content-primary);
  box-shadow: 0 1px 2px var(--color-alpha-dark-8);
}

#aba-visao:checked   ~ .rds-abas__painel[data-aba='visao'],
#aba-regras:checked  ~ .rds-abas__painel[data-aba='regras'],
#aba-codigo:checked  ~ .rds-abas__painel[data-aba='codigo'],
#aba-a11y:checked    ~ .rds-abas__painel[data-aba='a11y'] {
  display: block;
}

/* Foco de teclado: o rádio está invisível, então o anel vai no rótulo. */
#aba-visao:focus-visible  ~ .rds-abas__barra label[for='aba-visao'],
#aba-regras:focus-visible ~ .rds-abas__barra label[for='aba-regras'],
#aba-codigo:focus-visible ~ .rds-abas__barra label[for='aba-codigo'],
#aba-a11y:focus-visible   ~ .rds-abas__barra label[for='aba-a11y'] {
  outline: 2px solid var(--content-primary);
  outline-offset: 2px;
}

/* ── Seletor de linguagem (dentro da aba Código) ────────────────────────── */
.rds-langs { position: relative; margin: 0 0 24px; }

.rds-langs > input[type='radio'] {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
  margin: 0;
}

.rds-langs__barra {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  margin: 0 0 24px;
  border: 1px solid var(--border-primary);
  border-radius: var(--component-s);
  background: var(--surface-secondary);
}

.rds-langs__barra label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--component-2xs);
  font-size: var(--tamanho-14);
  font-weight: var(--peso-semibold);
  color: var(--content-secondary);
  cursor: pointer;
  user-select: none;
}

.rds-langs__barra label:hover {
  background: var(--action-hover-on-color-secondary);
  color: var(--content-primary);
}

.rds-langs__painel { display: none; }

#lang-angular:checked ~ .rds-langs__barra label[for='lang-angular'],
#lang-flutter:checked ~ .rds-langs__barra label[for='lang-flutter'] {
  background: var(--surface-primary);
  color: var(--content-primary);
  box-shadow: 0 1px 2px var(--color-alpha-dark-8);
}

#lang-angular:checked ~ .rds-langs__painel[data-lang='angular'],
#lang-flutter:checked ~ .rds-langs__painel[data-lang='flutter'] {
  display: block;
}

#lang-angular:focus-visible ~ .rds-langs__barra label[for='lang-angular'],
#lang-flutter:focus-visible ~ .rds-langs__barra label[for='lang-flutter'] {
  outline: 2px solid var(--content-primary);
  outline-offset: 2px;
}

/* ── Cartões de "faça / não faça" (aba Regras de uso) ───────────────────── */
.rds-regras {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 24px 0 32px;
}

.rds-regra {
  border: 1px solid var(--border-primary);
  border-radius: var(--component-s);
  padding: 20px;
  background: var(--surface-primary);
}

.rds-regra__titulo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  font-size: var(--tamanho-14);
  font-weight: var(--peso-bold);
}

.rds-regra--faca  .rds-regra__titulo { color: var(--feedback-success-on-surface); }
.rds-regra--evite .rds-regra__titulo { color: var(--feedback-error-on-surface); }

.rds-regra ul { margin: 0; padding-left: 20px; }
.rds-regra li {
  font-size: var(--tamanho-14);
  line-height: 1.6;
  color: var(--content-secondary);
  margin: 0 0 8px;
}

/* ── Aviso/observação em destaque ───────────────────────────────────────── */
.rds-nota {
  border-left: 3px solid var(--brand-fill);
  background: var(--brand-surface);
  border-radius: var(--component-2xs);
  padding: 16px 20px;
  margin: 24px 0;
  font-size: var(--tamanho-14);
  line-height: 1.6;
  color: var(--content-primary);
}
`;
