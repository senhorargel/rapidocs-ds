/**
 * Build dos tokens — Rapidocs DS
 *
 * Lê os tokens DTCG em src/ e gera as saídas por plataforma.
 *
 * Fonte da verdade: Figma "Rapidocs System [Piloto]"
 *   coleções `.primitives` (escalas de cor) + `semantic-colors` (light/dark).
 *
 * Saídas:
 *   Tema claro (padrão):
 *     build/web/tokens.css        :root  (primitivas + semânticas light)
 *     build/web/tokens.scss
 *     build/dart/tokens.dart      class RapidocsColors
 *   Tema escuro (override das semânticas):
 *     build/web/tokens.dark.css   [data-theme="dark"]
 *     build/dart/tokens.dark.dart class RapidocsColorsDark
 *
 * As primitivas entram como fonte no build escuro só para resolver as
 * referências; o filtro garante que apenas as semânticas dark sejam emitidas.
 */
import StyleDictionary from 'style-dictionary';

const onlyDarkSemantics = (token) =>
  (token.filePath || '').replace(/\\/g, '/').endsWith('/semanticos.dark.json');

const light = new StyleDictionary({
  source: ['src/primitivos.json', 'src/semanticos.json'],
  platforms: {
    web: {
      transformGroup: 'css',
      buildPath: 'build/web/',
      files: [
        { destination: 'tokens.css', format: 'css/variables', options: { outputReferences: true } },
        { destination: 'tokens.scss', format: 'scss/variables', options: { outputReferences: true } },
      ],
    },
    dart: {
      transformGroup: 'flutter',
      buildPath: 'build/dart/',
      files: [
        { destination: 'tokens.dart', format: 'flutter/class.dart', options: { className: 'RapidocsColors' } },
      ],
    },
  },
});

const dark = new StyleDictionary({
  source: ['src/primitivos.json', 'src/semanticos.dark.json'],
  platforms: {
    web: {
      transformGroup: 'css',
      buildPath: 'build/web/',
      files: [
        {
          destination: 'tokens.dark.css',
          format: 'css/variables',
          filter: onlyDarkSemantics,
          options: { selector: '[data-theme="dark"]' },
        },
      ],
    },
    dart: {
      transformGroup: 'flutter',
      buildPath: 'build/dart/',
      files: [
        {
          destination: 'tokens.dark.dart',
          format: 'flutter/class.dart',
          filter: onlyDarkSemantics,
          options: { className: 'RapidocsColorsDark' },
        },
      ],
    },
  },
});

await light.buildAllPlatforms();
await dark.buildAllPlatforms();
console.log('✓ Tokens gerados (light + dark) em build/web e build/dart');
