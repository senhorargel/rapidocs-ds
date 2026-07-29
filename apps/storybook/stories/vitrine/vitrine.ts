/**
 * Utilidades compartilhadas das stories da vitrine.
 *
 * Aqui mora só o que é da MOLDURA da vitrine — escape de texto, o CSS comum, as
 * legendas das galerias e a moldura de celular. Este arquivo não sabe nada sobre
 * Alert nem sobre nenhum componente específico: serve para todos.
 *
 * A escolha da linguagem (Angular ou Flutter) NÃO é feita aqui nem na barra de
 * ferramentas — ela é um seletor DENTRO da página de documentação de cada
 * componente (a aba "Código" do `.mdx`). A barra de cima só tem o Tema.
 */

const SANS = 'font-family:var(--familia-archivo),ui-sans-serif,system-ui,sans-serif';
const MONO = 'font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace';

/**
 * Escapa texto para entrar em HTML sem virar marcação.
 *
 * Serve principalmente para os textos que o designer digita nos controles: o
 * Angular interpola com `{{ }}`, que mostra `<b>x</b>` como texto literal; sem
 * escapar aqui a vitrine renderizaria negrito e ensinaria errado.
 */
export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ═════════════════════════════════════════════════════════════════════════════
// Aparência da vitrine (moldura de celular, legendas, botões)
//
// Só token — nenhuma cor solta e nenhum valor numérico de fallback: os tokens
// existem, e num repositório cuja regra é "sem cor solta" o fallback é código
// morto que esconde token faltando.
// ═════════════════════════════════════════════════════════════════════════════

const CSS_VITRINE = `
/* ---- Moldura de celular (prévia "como fica no app") ---- */
.rds-fone {
  box-sizing: border-box;
  width: 375px;
  max-width: 100%;
  padding: var(--padding-xs);
  border: 1px solid var(--border-primary);
  border-radius: var(--component-3xl);
  background: var(--surface-secondary);
}
.rds-fone__barra {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--padding-2xs) 0 var(--padding-xs);
}
.rds-fone__pilula {
  width: var(--size-64);
  height: var(--size-4);
  border-radius: var(--shape-100);
  background: var(--border-primary);
}
.rds-fone__tela {
  box-sizing: border-box;
  padding: var(--padding-s);
  border: 1px solid var(--border-secondary);
  border-radius: var(--component-2xl);
  background: var(--surface-primary);
}
/* A nota de honestidade dentro da moldura: curta, e sempre visível. */
.rds-fone__selo {
  ${SANS};
  display: block;
  padding: var(--padding-2xs) var(--padding-xs) var(--padding-xs);
  font-size: 10px;
  line-height: 1.45;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: var(--content-tertiary);
  text-align: center;
}
.rds-fone__nota {
  ${SANS};
  margin: var(--padding-xs) 0 0;
  max-width: 375px;
  font-size: 11px;
  line-height: 1.5;
  color: var(--content-secondary);
}
.rds-fone__nota strong { color: var(--content-primary); }
.rds-fone__nota code { ${MONO}; font-size: 11px; }

/* ---- Botões da vitrine (ex.: restaurar exemplo) ---- */
.rds-btn {
  ${SANS};
  flex: none;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.45;
  padding: var(--padding-2xs) var(--padding-s);
  border: 1px solid var(--border-primary);
  border-radius: var(--component-2xs);
  background: var(--surface-primary);
  color: var(--content-primary);
  cursor: pointer;
}
.rds-btn:hover { background: var(--surface-tertiary); }
.rds-btn:focus-visible {
  outline: 2px solid var(--content-primary);
  outline-offset: 2px;
}

/* ---- Aviso que substitui um exemplo fechado pelo X ---- */
.rds-restaurar {
  ${SANS};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-s);
  padding: var(--padding-s);
  border: 1px dashed var(--border-primary);
  border-radius: var(--component-s);
  background: var(--surface-secondary);
  color: var(--content-secondary);
  font-size: 12px;
  line-height: 1.45;
}
.rds-restaurar code { ${MONO}; font-size: 11px; color: var(--content-primary); }

/* ---- Legendas das galerias ---- */
.rds-legenda {
  ${SANS};
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: var(--content-tertiary);
  margin: 0 0 var(--padding-xs);
}
`;

/**
 * Injeta o CSS da vitrine uma única vez no `<head>`.
 *
 * Na página Docs as stories são montadas todas juntas: uma `<style>` dentro de
 * cada uma repetiria o mesmo CSS várias vezes.
 */
export function garantirEstilos(): void {
  const id = 'rds-vitrine-estilos';
  if (document.getElementById(id)) return;
  const tag = document.createElement('style');
  tag.id = id;
  tag.textContent = CSS_VITRINE;
  document.head.appendChild(tag);
}

/** Legenda curta em caixa alta, para separar blocos de galeria. */
export const legenda = (t: string) => `<div class="rds-legenda">${t}</div>`;

/**
 * Coloca um HTML dentro de uma moldura de celular (375px) e devolve o HTML
 * pronto — é a prévia "como fica no app" que a aba **Flutter** da documentação
 * mostra.
 *
 * HONESTIDADE (a nota aparece em dois lugares, o selo dentro da moldura e o
 * parágrafo embaixo, e é obrigatória): o Storybook roda no navegador e NÃO
 * executa Flutter. Isto é uma simulação em HTML feita com os MESMOS tokens do
 * Flutter — não é o widget Flutter rodando.
 *
 * Garante o CSS da vitrine sozinha, então serve tanto em story quanto solta.
 */
export function molduraCelular(conteudoHtml: string): string {
  garantirEstilos();
  return `
    <div class="rds-fone">
      <div class="rds-fone__barra"><span class="rds-fone__pilula"></span></div>
      <div class="rds-fone__tela">${conteudoHtml}</div>
      <span class="rds-fone__selo">Prévia simulada · não é Flutter rodando</span>
    </div>
    <p class="rds-fone__nota">
      Moldura de celular (375px) para conferir proporção e hierarquia.
      <strong>É HTML com os mesmos tokens do Flutter</strong>, não o widget
      rodando — o Storybook roda no navegador e não executa Flutter. O código
      Dart de verdade está na aba <strong>Flutter</strong> desta página.
    </p>`;
}
