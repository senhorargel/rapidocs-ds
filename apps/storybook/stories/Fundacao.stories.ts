import type { Meta, StoryObj } from '@storybook/html';
import primitivos from '../../../tokens/src/primitivos.json';
import semanticos from '../../../tokens/src/semanticos.json';
import semanticosDark from '../../../tokens/src/semanticos.dark.json';

/**
 * Vitrine da fundação — cores. Extraídas do Figma "Rapidocs System [Piloto]".
 * As swatches leem as CSS custom properties; as semânticas são organizadas em
 * tabela, com os dois temas (light/dark) e a primitiva que cada uma referencia.
 */
const meta: Meta = { title: 'Fundação/Cores' };
export default meta;
type Story = StoryObj;

const SANS = "font-family:ui-sans-serif,system-ui,-apple-system,sans-serif";
const MONO = "font-family:ui-monospace,'SF Mono',Menlo,monospace";
// xadrez só nas swatches de tokens transparentes (alpha)
const CHECKER =
  'background-image:linear-gradient(45deg,#c4c4c4 25%,transparent 25%),linear-gradient(-45deg,#c4c4c4 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#c4c4c4 75%),linear-gradient(-45deg,transparent 75%,#c4c4c4 75%);background-size:12px 12px;background-position:0 0,0 6px,6px -6px,-6px 0';

const esc = (s = '') => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const refClean = (r = '') => r.replace(/[{}]/g, '');
const refVar = (r: string) => '--' + refClean(r).replace(/\./g, '-');
const refLabel = (r: string) => refClean(r).replace(/\./g, '/');
const isPrimitiveRef = (r: string) => refClean(r).startsWith('color.');
const isAlpha = (r?: string) => !!r && refClean(r).split('.').includes('alpha');

// swatch. opaco = cor sólida pura; alpha = cor sobre xadrez.
const swatch = (cssVar: string, size = 44, opts: { dark?: boolean; alpha?: boolean } = {}) => {
  const base = `display:inline-flex;width:${size}px;height:${size}px;border-radius:9px;border:1px solid rgba(128,128,128,.3);overflow:hidden;flex:0 0 auto`;
  const dt = opts.dark ? 'data-theme="dark"' : '';
  if (!opts.alpha) return `<span ${dt} style="${base};background:var(${cssVar})"></span>`;
  return `<span ${dt} style="${base};${CHECKER}"><span style="width:100%;height:100%;background:var(${cssVar})"></span></span>`;
};

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
              ${swatch(l.varName, 52, { alpha: l.path.includes('alpha') })}
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

// ------------------------------------------------------------------ SEMÂNTICAS (tabela)
const darkRef: Record<string, string> = {};
(function walk(node: any, p: string[]) {
  for (const k of Object.keys(node)) {
    if (k.startsWith('$')) continue;
    const v = node[k];
    if (v && typeof v === 'object' && '$value' in v) darkRef[[...p, k].join('.')] = v.$value;
    else if (v && typeof v === 'object') walk(v, [...p, k]);
  }
})(semanticosDark as any, []);

const refMini = (icon: string, ref?: string) => {
  if (!ref) return '';
  const kind = isPrimitiveRef(ref) ? '' : ' <span style="opacity:.5">· sem</span>';
  return `<div style="display:flex;align-items:center;gap:5px;${SANS};font-size:11px;color:var(--content-secondary,#667);white-space:nowrap;margin:1px 0">
    <span>${icon}</span>${swatch(refVar(ref), 13, { alpha: isAlpha(ref) })}<code style="${MONO}">${refLabel(ref)}</code>${kind}</div>`;
};

const TD = 'padding:9px 10px;vertical-align:middle';

function rows(node: any, path: string[], depth: number): string {
  const keys = Object.keys(node).filter((k) => !k.startsWith('$'));
  const leaves = keys.filter((k) => node[k] && typeof node[k] === 'object' && '$value' in node[k]);
  const groups = keys.filter((k) => node[k] && typeof node[k] === 'object' && !('$value' in node[k]));
  let html = '';
  for (const k of leaves) {
    const full = [...path, k];
    const cssVar = '--' + full.join('-');
    const lightR = node[k].$value as string;
    const dR = darkRef[full.join('.')];
    html += `<tr style="border-top:1px solid var(--border-secondary,#eef1f4)">
      <td style="${TD};text-align:center">${swatch(cssVar, 42, { alpha: isAlpha(lightR) })}</td>
      <td style="${TD};text-align:center">${swatch(cssVar, 42, { dark: true, alpha: isAlpha(dR) })}</td>
      <td style="${TD}">
        <code style="${MONO};font-weight:700;font-size:12.5px;color:var(--content-primary,#111)">${full.join('/')}</code>
        <div style="margin-top:3px"><code style="${MONO};font-size:11px;color:var(--content-secondary,#667);background:var(--surface-secondary,#f3f4f6);border:1px solid var(--border-secondary,#e5e7eb);padding:1px 6px;border-radius:5px">${cssVar}</code></div>
      </td>
      <td style="${TD}">${refMini('☀️', lightR)}${refMini('🌙', dR)}</td>
      <td style="${TD};font-size:12px;line-height:1.45;color:var(--content-secondary,#667);min-width:220px">${esc(node[k].$description || '')}</td>
    </tr>`;
  }
  for (const k of groups) {
    const title = k.replace(/-/g, ' ');
    if (depth === 0) {
      html += `<tr><td colspan="5" style="padding:28px 10px 6px"><span style="${SANS};font-size:18px;font-weight:800;text-transform:capitalize;border-bottom:2px solid var(--brand-fill,#3381ff);padding-bottom:4px">${title}</span></td></tr>`;
    } else {
      html += `<tr><td colspan="5" style="padding:14px 10px 0"><span style="${SANS};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--content-tertiary,#8a94a6)">${title}</span></td></tr>`;
    }
    html += rows(node[k], [...path, k], depth + 1);
  }
  return html;
}

const TH = `${SANS};padding:6px 10px;font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--content-tertiary,#8a94a6)`;

export const Semanticas: Story = {
  render: () => `
    <div style="padding:20px;${SANS}">
      <h2 style="font-size:22px;margin:0 0 4px">Cores semânticas</h2>
      <p style="font-size:13px;color:var(--content-secondary,#667);margin:0 0 16px;max-width:680px">
        Tabela por token: cor no tema <strong>claro</strong> e <strong>escuro</strong>, o nome (caminho do Figma + variável CSS),
        a <strong>primitiva referenciada</strong> (☀️ light · 🌙 dark) e o uso. Agrupadas por família e subtipo.
      </p>
      <div style="overflow-x:auto">
        <table style="border-collapse:collapse;width:100%;min-width:780px">
          <thead>
            <tr style="text-align:left;border-bottom:2px solid var(--border-primary,#d1d5db)">
              <th style="${TH};text-align:center">Light</th>
              <th style="${TH};text-align:center">Dark</th>
              <th style="${TH}">Token</th>
              <th style="${TH}">Referência</th>
              <th style="${TH}">Uso</th>
            </tr>
          </thead>
          <tbody>${rows(semanticos as any, [], 0)}</tbody>
        </table>
      </div>
    </div>`,
};
