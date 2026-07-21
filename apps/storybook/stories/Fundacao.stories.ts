import type { Meta, StoryObj } from '@storybook/html';
import primitivos from '../../../tokens/src/primitivos.json';
import semanticos from '../../../tokens/src/semanticos.json';

/**
 * Vitrine da fundação (Fase 1): cores extraídas do Figma "Rapidocs System [Piloto]".
 * As swatches leem as CSS custom properties geradas pelo Style Dictionary, então
 * refletem o tema atual (light/dark — alterne pela barra de ferramentas).
 */
const meta: Meta = { title: 'Fundação/Cores' };
export default meta;
type Story = StoryObj;

type Leaf = { varName: string; path: string[]; description?: string };

// Achata a árvore DTCG em folhas (tokens) com o nome da CSS var (--a-b-c).
function flatten(node: any, prefix: string[] = []): Leaf[] {
  const out: Leaf[] = [];
  for (const key of Object.keys(node)) {
    if (key.startsWith('$')) continue;
    const val = node[key];
    if (val && typeof val === 'object' && '$value' in val) {
      const path = [...prefix, key];
      out.push({ varName: '--' + path.join('-'), path, description: val.$description });
    } else if (val && typeof val === 'object') {
      out.push(...flatten(val, [...prefix, key]));
    }
  }
  return out;
}

const esc = (s = '') => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const SANS = 'font-family:ui-sans-serif,system-ui,sans-serif';

// ---------- PRIMITIVAS: escalas de cor ----------
const primLeaves = flatten(primitivos as any);
// agrupa por "hue/tom" (ex.: blue/light, alpha/brand), preservando a ordem
const primGroups: Record<string, Leaf[]> = {};
for (const leaf of primLeaves) {
  const g = leaf.path.slice(1, -1).join('/'); // remove "color" e o degrau final
  (primGroups[g] ||= []).push(leaf);
}

const scaleRow = (title: string, leaves: Leaf[]) => `
  <div style="margin:0 0 20px">
    <div style="${SANS};font-weight:600;font-size:13px;margin-bottom:6px">${title}</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px">
      ${leaves
        .map((l) => {
          const step = l.path[l.path.length - 1];
          return `<div style="text-align:center">
            <div title="var(${l.varName})" style="width:56px;height:44px;border-radius:6px;border:1px solid var(--border-secondary,#0002);background:var(${l.varName})"></div>
            <div style="${SANS};font-size:10px;color:var(--content-tertiary,#888);margin-top:3px">${step}</div>
          </div>`;
        })
        .join('')}
    </div>
  </div>`;

export const Primitivas: Story = {
  render: () => `
    <div style="padding:16px">
      <h2 style="${SANS};margin:0 0 4px">Primitivas — escalas de cor</h2>
      <p style="${SANS};color:var(--content-secondary,#666);margin:0 0 20px;font-size:13px">
        ${primLeaves.length} tokens. Base crua da paleta (light + dark + alpha). Os componentes NÃO consomem estes diretamente — usam as semânticas.
      </p>
      ${Object.entries(primGroups)
        .map(([g, leaves]) => scaleRow(g, leaves))
        .join('')}
    </div>`,
};

// ---------- SEMÂNTICAS: agrupadas com descrição ----------
const semLeaves = flatten(semanticos as any);
const semGroups: Record<string, Leaf[]> = {};
for (const leaf of semLeaves) {
  (semGroups[leaf.path[0]] ||= []).push(leaf);
}

const semRow = (l: Leaf) => `
  <div style="display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid var(--border-secondary,#0001)">
    <span style="flex:0 0 auto;width:44px;height:44px;border-radius:8px;border:1px solid var(--border-secondary,#0002);background:var(${l.varName})"></span>
    <div style="min-width:0">
      <code style="${SANS};font-weight:600;font-size:13px">${l.path.join('/')}</code>
      <div style="${SANS};font-size:12px;color:var(--content-secondary,#666);margin-top:2px">${esc(l.description) || '—'}</div>
    </div>
  </div>`;

export const Semanticas: Story = {
  render: () => `
    <div style="padding:16px;max-width:720px">
      <h2 style="${SANS};margin:0 0 4px">Semânticas</h2>
      <p style="${SANS};color:var(--content-secondary,#666);margin:0 0 20px;font-size:13px">
        ${semLeaves.length} tokens que referenciam as primitivas. Cada um tem uma descrição de uso. Alterne o tema (Light/Dark) na barra de cima.
      </p>
      ${Object.entries(semGroups)
        .map(
          ([g, leaves]) => `
        <h3 style="${SANS};margin:24px 0 4px;text-transform:capitalize">${g}</h3>
        ${leaves.map(semRow).join('')}`
        )
        .join('')}
    </div>`,
};
