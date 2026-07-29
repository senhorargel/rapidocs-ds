import type { StorybookConfig } from '@storybook/html-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|ts)'],
  addons: [
    '@storybook/addon-essentials',
    // Preset local que liga o remark-gfm (tabelas Markdown nas páginas .mdx).
    // Detalhes no próprio arquivo.
    './mdx-gfm-preset.js'
  ],
  framework: {
    name: '@storybook/html-vite',
    options: {}
  }
};

export default config;
