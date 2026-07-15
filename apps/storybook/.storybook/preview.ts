// Carrega os tokens gerados pelo Style Dictionary (rode `pnpm build:tokens` antes).
import '../../../tokens/build/web/tokens.css';

const preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } }
  }
};

export default preview;
