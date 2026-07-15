import type { Meta, StoryObj } from '@storybook/html';

/**
 * Vitrine da fundacao (Fase 1): mostra os tokens de cor gerados a partir do
 * Figma. Le as CSS custom properties de @rapidocs/tokens.
 */
const meta: Meta = {
  title: 'Fundacao/Cores'
};
export default meta;

type Story = StoryObj;

const swatch = (nome: string, varName: string) => `
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;font-family:sans-serif">
    <span style="width:48px;height:48px;border-radius:8px;border:1px solid #0002;background:var(${varName})"></span>
    <div>
      <div style="font-weight:600;font-size:14px">${nome}</div>
      <code style="font-size:12px;color:#666">var(${varName})</code>
    </div>
  </div>`;

export const Semanticas: Story = {
  render: () => `
    <h2 style="font-family:sans-serif">Cores semanticas</h2>
    ${swatch('Acao primaria', '--cor-acao-primaria')}
    ${swatch('Texto padrao', '--cor-texto-padrao')}
    ${swatch('Fundo padrao', '--cor-fundo-padrao')}
    ${swatch('Fundo sutil', '--cor-fundo-sutil')}
  `
};

export const Primitivas: Story = {
  render: () => `
    <h2 style="font-family:sans-serif">Cores primitivas</h2>
    ${swatch('Azul 500', '--cor-azul-500')}
    ${swatch('Cinza 900', '--cor-cinza-900')}
    ${swatch('Cinza 100', '--cor-cinza-100')}
    ${swatch('Cinza 000', '--cor-cinza-000')}
  `
};
