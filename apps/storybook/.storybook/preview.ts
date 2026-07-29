// Tokens gerados pelo Style Dictionary, importados PELO NOME DO PACOTE — a
// vitrine consome `@rapidocs/tokens` como qualquer app do time (o link do
// workspace existe depois do `corepack pnpm install`; rode o build de tokens
// antes, se `tokens/build/` estiver vazio).
import '@rapidocs/tokens/css';
import '@rapidocs/tokens/css-dark';
import '@rapidocs/tokens/css-typography';

const preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
    backgrounds: { disable: true },
    docs: {
      // A página Docs monta assim: primeiro o bloco "Primary" (a primeira story
      // do arquivo, com os controles) e, embaixo, a lista com TODAS as stories.
      // Sem este filtro a primeira story aparece DUAS vezes na mesma página —
      // dois exemplares do mesmo componente, com ids de DOM repetidos e o dobro
      // de anúncios para quem usa leitor de tela.
      //
      // Quem marcar `parameters: { docs: { repetirNaLista: false } }` sai da
      // lista de baixo e continua aparecendo no topo. Vale para qualquer
      // componente da vitrine, não só o Alert.
      stories: {
        filter: (story: any) => story.parameters?.docs?.repetirNaLista !== false,
      },
    },
  },
  // A barra de ferramentas do Storybook tem UM item só: o Tema.
  //
  // Escolher a LINGUAGEM (Angular ou Flutter) não é assunto da barra de cima —
  // é uma escolha DENTRO da página de documentação de cada componente: a aba
  // "Código" do `.mdx` tem o seletor Angular/Flutter, e ali o texto, o código e
  // a prévia trocam JUNTOS. Uma chave global trocava só a moldura da prévia
  // enquanto o texto ao lado continuava falando de Angular — confundia mais do
  // que ajudava.
  globalTypes: {
    // Alterna o tema (light/dark) pela barra de ferramentas do Storybook.
    theme: {
      description: 'Tema da fundação',
      defaultValue: 'light',
      toolbar: {
        title: 'Tema',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    // Único decorator global: aplica o tema escolhido na barra de ferramentas.
    (story: () => any, context: any) => {
      const theme = context.globals.theme || 'light';
      document.documentElement.setAttribute('data-theme', theme);
      document.body.style.background = 'var(--surface-primary)';
      document.body.style.color = 'var(--content-primary)';
      return story();
    },
  ],
};

export default preview;
