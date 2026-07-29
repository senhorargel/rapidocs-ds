// Preset local: ensina o MDX do Storybook a renderizar tabelas Markdown (GFM).
//
// Por que existe: o compilador MDX do Storybook 8 não entende tabelas escritas
// com pipes (| --- |) por padrão — elas viram parágrafo corrido. O plugin
// remark-gfm resolve, mas no builder Vite o addon-docs só lê essa configuração
// de `presets.apply('options')`, e a única forma de alimentar isso é um preset
// que exporte a chave `options` — este arquivo. (A receita da documentação,
// options no addon, não chega até o mdx-plugin do Vite nesta versão, 8.6.x.)
//
// Registrado em main.ts: addons: [..., './mdx-gfm-preset.js']
module.exports = {
  options: async (existente = {}) => {
    // import() dinâmico porque o remark-gfm é um pacote só-ESM.
    const { default: remarkGfm } = await import('remark-gfm');
    return {
      ...existente,
      mdxPluginOptions: {
        mdxCompileOptions: {
          remarkPlugins: [remarkGfm]
        }
      }
    };
  }
};
