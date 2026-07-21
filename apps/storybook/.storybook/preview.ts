// Carrega os tokens gerados pelo Style Dictionary (rode o build de tokens antes).
import '../../../tokens/build/web/tokens.css';
import '../../../tokens/build/web/tokens.dark.css';
import '../../../tokens/build/web/tokens.typography.css';

const preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
    backgrounds: { disable: true },
  },
  // Alterna o tema (light/dark) pela barra de ferramentas do Storybook.
  globalTypes: {
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
