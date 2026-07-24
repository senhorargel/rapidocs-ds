import type { Meta, StoryObj } from '@storybook/html';
// SVGs importados como texto cru (Vite ?raw) e embutidos inline
import claro1 from '../../../assets/logo/logo-claro-1.svg?raw';
import claro2 from '../../../assets/logo/logo-claro-2.svg?raw';
import escuro1 from '../../../assets/logo/logo-escuro-1.svg?raw';
import escuro2 from '../../../assets/logo/logo-escuro-2.svg?raw';

/**
 * Vitrine da fundação — Marca. As logos do Rapidocs em SVG, nas versões para
 * fundo claro e escuro. Cada uma é mostrada sobre o fundo a que se destina.
 */
const meta: Meta = { title: 'Fundação/Marca' };
export default meta;
type Story = StoryObj;

const SANS = 'font-family:ui-sans-serif,system-ui,-apple-system,sans-serif';

const card = (svg: string, label: string, bg: string, labelColor: string) => `
  <div style="text-align:center;${SANS}">
    <div class="logo-box" style="width:260px;padding:28px;box-sizing:border-box;background:${bg};border:1px solid rgba(128,128,128,.25);border-radius:14px">${svg}</div>
    <code style="font-size:11px;color:${labelColor};display:block;margin-top:8px">${label}.svg</code>
  </div>`;

export const Logo: Story = {
  render: () => `
    <style>.logo-box svg{width:100%;height:auto;display:block}</style>
    <div style="padding:24px;${SANS}">
      <h2 style="font-size:22px;margin:0 0 4px">Marca — logo</h2>
      <p style="font-size:13px;color:var(--content-secondary,#667);margin:0 0 24px;max-width:620px">
        Arquivos em <code>assets/logo/</code>. Duas versões para fundo claro e duas para fundo escuro
        (626×334, cor da marca). Cada uma é exibida sobre o fundo a que se destina.
      </p>

      <h3 style="${SANS};font-size:14px;margin:0 0 10px;color:var(--content-tertiary,#8a94a6);text-transform:uppercase;letter-spacing:.05em">Fundo claro</h3>
      <div style="display:flex;gap:24px;flex-wrap:wrap;margin-bottom:32px">
        ${card(claro1, 'logo-claro-1', '#FFFFFF', 'var(--content-tertiary,#999)')}
        ${card(claro2, 'logo-claro-2', '#FFFFFF', 'var(--content-tertiary,#999)')}
      </div>

      <h3 style="${SANS};font-size:14px;margin:0 0 10px;color:var(--content-tertiary,#8a94a6);text-transform:uppercase;letter-spacing:.05em">Fundo escuro</h3>
      <div style="display:flex;gap:24px;flex-wrap:wrap">
        ${card(escuro1, 'logo-escuro-1', '#0E0F12', '#8a94a6')}
        ${card(escuro2, 'logo-escuro-2', '#0E0F12', '#8a94a6')}
      </div>
    </div>`,
};
