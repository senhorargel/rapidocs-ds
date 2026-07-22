import type { Meta, StoryObj } from '@storybook/html';
import primitivos from '../../../tokens/src/primitivos.json';
import semanticos from '../../../tokens/src/semanticos.json';
import semanticosDark from '../../../tokens/src/semanticos.dark.json';

/**
 * Vitrine da fundação — cores. Extraídas do Figma "Rapidocs System [Piloto]".
 * As swatches leem as CSS custom properties; as semânticas são mostradas nos
 * dois temas (light/dark) lado a lado, com a primitiva que cada uma referencia.
 */
const meta: Meta = { title: 'Fundação/Cores' };
export default meta;
type Story = StoryObj;

const SANS = "font-family:ui-sans-serif,system-ui,-apple-system,sans-serif";
const MONO = "font-family:ui-monospace,'SF Mono',Menlo,monospace";
// fundo neutro por trás das swatches: cores opacas ficam sólidas; tokens alpha
// aparecem como um tom suave sobre a superfície do tema (sem poluição de xadrez)
const SWATCH_BG = 'background:var(--surface-secondary,#f3f4f6)';

const esc = (s = '') => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const refClean = (r = '') => r.replace(/[{}]/g, '');
const refVar = (r: string) => '--' + refClean(r).replace(/\./g, '-');
const refLabel = (r: string) => refClean(r).replace(/\./g, '/');
const isPrimitiveRef = (r: string) => refClean(r).startsWith('color.');

// swatch: cor da CSS var sobre xadrez; dark=true força o tema escuro localmente
const swatch = (cssVar: string, size = 46, dark = false) =>
  `<span ${dark ? 'data-theme="dark"' : ''} style="display:inline-flex;width:${size}px;height:${size}px;border-radius:9px;border:1px solid rgba(128,128,128,.3);${SWATCH_BG};overflow:hidden;flex:0 0 auto">` +
  `<span style="width:100%;height:100%;background:var(${cssVar})"></span></span>`;

// ------------------------------------------------------------------ PRIMITIVAS
type Leaf = { varName: string; path: string[] };
function flatten(node: any, prefix: string[] = []): Leaf[] {
  const out: Leaf[] = [];
  for (const key of Object.keys(node)) {
    if (key.startsWith('$')) continue;
    const val = node[key];
    if (val && typeof val === 'object' && '$value' in val) out.push({ varName: '--' + [...prefix, key].join('-'), path: [...prefix, key] });
    else if (val && typeof val === 'object') out.push(...flatten(val, [...prefix, key]));
  }
  return out;
}

const primColorLeaves = flatten((primitivos as any).color, ['color']);
const primGroups: Record<string, Leaf[]> = {};
for (const l of primColorLeaves) (primGroups[l.path.slice(1, -1).join('/')] ||= []).push(l);

export const Primitivas: Story = {
  render: () => `
    <div style="padding:20px;${SANS}">
      <h2 style="font-size:22px;margin:0 0 4px">Primitivas — escalas de cor</h2>
      <p style="font-size:13px;color:var(--content-secondary,#667);margin:0 0 20px">${primColorLeaves.length} tokens. Paleta crua (light + dark + alpha). Componentes não usam estas direto — usam as semânticas.</p>
      ${Object.entries(primGroups)
        .map(
          ([g, leaves]) => `
        <div style="margin:0 0 18px">
          <div style="font-weight:600;font-size:13px;margin-bottom:6px">${g}</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${leaves
              .map(
                (l) => `<div style="text-align:center">
              ${swatch(l.varName, 52)}
              <div style="font-size:10px;color:var(--content-tertiary,#999);margin-top:3px">${l.path[l.path.length - 1]}</div>
            </div>`
              )
              .join('')}
          </div>
        </div>`
        )
        .join('')}
    </div>`,
};

// ------------------------------------------------------------------ SEMÂNTICAS
// mapa path->referência do tema escuro
const darkRef: Record<string, string> = {};
(function walk(node: any, p: string[]) {
  for (const k of Object.keys(node)) {
    if (k.startsWith('$')) continue;
    const v = node[k];
    if (v && typeof v === 'object' && '$value' in v) darkRef[[...p, k].join('.')] = v.$value;
    else if (v && typeof v === 'object') walk(v, [...p, k]);
  }
})(semanticosDark as any, []);

const refLine = (icon: string, ref?: string) => {
  if (!ref) return '';
  const kind = isPrimitiveRef(ref) ? '' : ' <span style="opacity:.55">· semântica</span>';
  return `<div style="display:flex;align-items:center;gap:6px;${SANS};font-size:11px;color:var(--content-secondary,#667);margin-top:3px">
    <span style="width:14px;text-align:center">${icon}</span>${swatch(refVar(ref), 15)}
    <code style="${MONO}">${refLabel(ref)}</code>${kind}</div>`;
};

const card = (path: string[], desc: string | undefined, lightR: string, darkR?: string) => {
  const cssVar = '--' + path.join('-');
  return `<div style="border:1px solid var(--border-secondary,#e5e7eb);border-radius:12px;padding:12px 14px;background:var(--surface-primary,#fff)">
    <div style="display:flex;gap:10px;align-items:center;margin-bottom:8px">
      <div style="text-align:center">${swatch(cssVar, 44)}<div style="${SANS};font-size:9px;color:var(--content-tertiary,#999);margin-top:2px">light</div></div>
      <div style="text-align:center">${swatch(cssVar, 44, true)}<div style="${SANS};font-size:9px;color:var(--content-tertiary,#999);margin-top:2px">dark</div></div>
      <code style="${MONO};font-size:12.5px;font-weight:700;color:var(--content-primary,#111);word-break:break-word">${path.join('/')}</code>
    </div>
    ${desc ? `<p style="${SANS};font-size:12px;line-height:1.45;color:var(--content-secondary,#667);margin:0 0 8px">${esc(desc)}</p>` : ''}
    <div style="border-top:1px dashed var(--border-secondary,#eee);padding-top:6px">
      ${refLine('☀️', lightR)}${refLine('🌙', darkR)}
    </div>
  </div>`;
};

function renderGroup(node: any, path: string[], depth: number): string {
  const keys = Object.keys(node).filter((k) => !k.startsWith('$'));
  const leaves = keys.filter((k) => node[k] && typeof node[k] === 'object' && '$value' in node[k]);
  const groups = keys.filter((k) => node[k] && typeof node[k] === 'object' && !('$value' in node[k]));
  let html = '';
  if (leaves.length) {
    html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px;margin:6px 0 16px">`;
    html += leaves.map((k) => card([...path, k], node[k].$description, node[k].$value, darkRef[[...path, k].join('.')])).join('');
    html += `</div>`;
  }
  for (const k of groups) {
    const title = k.replace(/-/g, ' ');
    if (depth === 0) {
      html += `<h3 style="${SANS};font-size:19px;font-weight:800;margin:30px 0 8px;text-transform:capitalize;border-bottom:2px solid var(--brand-fill,#3381ff);padding-bottom:5px">${title}</h3>`;
    } else {
      html += `<h4 style="${SANS};font-size:13px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;margin:14px 0 2px;color:var(--content-tertiary,#8a94a6)">${title}</h4>`;
    }
    html += renderGroup(node[k], [...path, k], depth + 1);
  }
  return html;
}

export const Semanticas: Story = {
  render: () => `
    <div style="padding:20px;max-width:1120px;${SANS}">
      <h2 style="font-size:22px;margin:0 0 4px">Cores semânticas</h2>
      <p style="font-size:13px;color:var(--content-secondary,#667);margin:0 0 4px;max-width:660px">
        Cada token mostra a cor no tema <strong>claro</strong> e <strong>escuro</strong> lado a lado, a descrição de uso,
        e a <strong>primitiva referenciada</strong> (☀️ light · 🌙 dark). Agrupadas por família e subtipo.
      </p>
      ${renderGroup(semanticos as any, [], 0)}
    </div>`,
};
