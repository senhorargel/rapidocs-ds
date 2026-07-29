import type { Meta, StoryObj } from '@storybook/html';
import textStyles from '../../../tokens/src/text-styles.json';
import tipografia from '../../../tokens/src/tipografia.json';

/**
 * Vitrine da fundação — tipografia. Os 28 text styles do Figma (família Archivo)
 * e as primitivas de fonte (pesos e tamanhos). A fonte Archivo é carregada do
 * Google Fonts para o preview refletir o desenho real.
 */
const meta: Meta = {
  title: 'Fundação/Tipografia',
};
export default meta;
type Story = StoryObj;

const SANS = 'font-family:ui-sans-serif,system-ui,sans-serif';
const ARCHIVO = `@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@100;200;300;400;500;600;700;800;900&display=swap');`;

type TS = { path: string[]; v: any };
function flattenTS(node: any, prefix: string[] = []): TS[] {
  const out: TS[] = [];
  for (const key of Object.keys(node)) {
    if (key.startsWith('$')) continue;
    const val = node[key];
    if (val && typeof val === 'object' && '$value' in val && typeof val.$value === 'object') {
      out.push({ path: [...prefix, key], v: val.$value });
    } else if (val && typeof val === 'object') {
      out.push(...flattenTS(val, [...prefix, key]));
    }
  }
  return out;
}

const all = flattenTS(textStyles as any);
const groups: Record<string, TS[]> = {};
for (const t of all) (groups[t.path[0]] ||= []).push(t);

const sample = (t: TS) => {
  const v = t.v;
  return `<div style="padding:10px 0;border-bottom:1px solid var(--border-secondary,#0001)">
    <div style="font-family:'Archivo',sans-serif;font-weight:${v.fontWeight};font-size:${v.fontSize};line-height:${v.lineHeight};color:var(--content-primary,#111)">${t.path.join('/')}</div>
    <code style="${SANS};font-size:11px;color:var(--content-tertiary,#999)">${v.fontSize} · peso ${v.fontWeight} · entrelinha ${v.lineHeight} · Archivo</code>
  </div>`;
};

export const TextStyles: Story = {
  render: () => `
    <style>${ARCHIVO}</style>
    <div style="padding:16px;max-width:760px">
      <h2 style="${SANS};margin:0 0 4px">Text styles (${all.length})</h2>
      <p style="${SANS};color:var(--content-secondary,#666);font-size:13px;margin:0 0 20px">Estilos de texto do Figma. Também disponíveis como classes CSS <code>.text-*</code> (ex.: <code>.text-label-16-regular</code>).</p>
      ${Object.entries(groups)
        .map(([g, items]) => `<h3 style="${SANS};margin:22px 0 4px;text-transform:capitalize">${g.replace('-', ' ')}</h3>${items.map(sample).join('')}`)
        .join('')}
    </div>`,
};

const pesos = Object.entries((tipografia as any).peso).map(([k, t]: any) => ({ k, w: t.$value }));

export const Primitivas: Story = {
  render: () => `
    <style>${ARCHIVO}</style>
    <div style="padding:16px">
      <h2 style="${SANS};margin:0 0 4px">Primitivas de fonte</h2>
      <p style="${SANS};color:var(--content-secondary,#666);font-size:13px;margin:0 0 20px">Família <strong>Archivo</strong> · pesos e tamanhos brutos que compõem os text styles.</p>
      <h3 style="${SANS}">Pesos</h3>
      ${pesos
        .map(
          (p) => `<div style="font-family:'Archivo',sans-serif;font-weight:${p.w};font-size:22px;color:var(--content-primary,#111);padding:2px 0">${p.k} — ${p.w} · Rapidocs Design System</div>`
        )
        .join('')}
    </div>`,
};
