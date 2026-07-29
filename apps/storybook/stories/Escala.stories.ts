import type { Meta, StoryObj } from '@storybook/html';
import primitivos from '../../../tokens/src/primitivos.json';
import escala from '../../../tokens/src/escala.json';
import forma from '../../../tokens/src/forma.json';

/**
 * Vitrine da fundação — escala (espaçamento/tamanho) e forma (raio de borda),
 * extraídas do Figma. As barras/quadrados leem as CSS custom properties, então
 * refletem o valor real (inclusive as semânticas que referenciam primitivas).
 */
const meta: Meta = {
  title: 'Fundação/Escala & Forma',
};
export default meta;
type Story = StoryObj;

type Leaf = { varName: string; path: string[]; value: string };

function flatten(node: any, prefix: string[] = []): Leaf[] {
  const out: Leaf[] = [];
  for (const key of Object.keys(node)) {
    if (key.startsWith('$')) continue;
    const val = node[key];
    if (val && typeof val === 'object' && '$value' in val) {
      out.push({ varName: '--' + [...prefix, key].join('-'), path: [...prefix, key], value: String(val.$value) });
    } else if (val && typeof val === 'object') {
      out.push(...flatten(val, [...prefix, key]));
    }
  }
  return out;
}

const SANS = 'font-family:ui-sans-serif,system-ui,sans-serif';
const noNeg = (l: Leaf) => !l.path.includes('negative'); // barras não representam negativos

const bar = (l: Leaf) => `
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:4px;${SANS};font-size:12px">
    <code style="width:170px;flex:0 0 auto;color:var(--content-secondary,#666)">${l.path.join('/')}</code>
    <span style="height:14px;width:var(${l.varName});max-width:60%;background:var(--brand-fill,#3381ff);border-radius:3px"></span>
    <span style="color:var(--content-tertiary,#999)">${l.value}</span>
  </div>`;

const section = (title: string, leaves: Leaf[]) =>
  `<h3 style="${SANS};margin:22px 0 6px">${title} <span style="font-weight:400;color:var(--content-tertiary,#999)">(${leaves.length})</span></h3>${leaves.map(bar).join('')}`;

export const Espacamento: Story = {
  render: () => `
    <div style="padding:16px">
      <h2 style="${SANS};margin:0 0 4px">Espaçamento & tamanho</h2>
      <p style="${SANS};color:var(--content-secondary,#666);font-size:13px;margin:0 0 8px">
        Primitivas em px e as semânticas de escala (padding/gap/component) que as referenciam.
        Tokens negativos (ex.: <code>gap/negative/*</code>) existem mas não aparecem nas barras.
      </p>
      ${section('Primitivas · space', flatten((primitivos as any).space).filter(noNeg))}
      ${section('Primitivas · size', flatten((primitivos as any).size))}
      ${section('Escala semântica', flatten(escala as any).filter(noNeg))}
    </div>`,
};

export const Raio: Story = {
  render: () => `
    <div style="padding:16px">
      <h2 style="${SANS};margin:0 0 4px">Forma — raio de borda</h2>
      <p style="${SANS};color:var(--content-secondary,#666);font-size:13px;margin:0 0 20px">
        Raio por tamanho de componente (modo <strong>Default</strong>). O Figma também tem os modos Rounded e Sharp.
      </p>
      <div style="display:flex;flex-wrap:wrap;gap:20px">
        ${flatten(forma as any)
          .map(
            (l) => `<div style="text-align:center;${SANS}">
          <div style="width:72px;height:72px;background:var(--brand-surface,#ebf2ff);border:2px solid var(--brand-fill,#3381ff);border-radius:var(${l.varName})"></div>
          <div style="font-size:12px;font-weight:600;margin-top:6px">${l.path[l.path.length - 1]}</div>
          <code style="font-size:10px;color:var(--content-tertiary,#999)">${l.value}</code>
        </div>`
          )
          .join('')}
      </div>
    </div>`,
};
