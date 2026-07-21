/**
 * Build dos tokens — Rapidocs DS
 *
 * Lê os tokens DTCG em src/ e gera as saídas por plataforma.
 * Fonte da verdade: Figma "Rapidocs System [Piloto]".
 *
 * Saídas web (build/web/):
 *   tokens.css              :root — primitivas (cor + space/size/shape) + semânticas light
 *                           + escala (padding/gap/component) + forma (raio) + tipografia (família/peso/tamanho)
 *   tokens.dark.css         [data-theme="dark"] — semânticas dark
 *   tokens.scss             idem tokens.css em SCSS
 *   tokens.typography.css   classes utilitárias .text-* (os 28 text styles)
 * Saídas Dart (build/dart/):
 *   tokens.dart             class RapidocsTokens (tema claro)
 *   tokens.dark.dart        class RapidocsTokensDark (semânticas dark)
 */
import StyleDictionary from 'style-dictionary';

const onlyDarkSemantics = (token) =>
  (token.filePath || '').replace(/\\/g, '/').endsWith('/semanticos.dark.json');

// Formato customizado: text styles (DTCG typography) -> classes CSS utilitárias
StyleDictionary.registerFormat({
  name: 'css/typography-classes',
  format: ({ dictionary }) => {
    const header = '/**\n * Do not edit directly, this file was auto-generated.\n * Classes utilitárias de tipografia (text styles do Figma).\n */\n\n';
    const body = dictionary.allTokens
      .map((t) => {
        const v = (t.original && t.original.$value) || t.value || t.$value;
        return `.text-${t.path.join('-')} {\n` +
          `  font-family: ${v.fontFamily};\n` +
          `  font-weight: ${v.fontWeight};\n` +
          `  font-size: ${v.fontSize};\n` +
          `  line-height: ${v.lineHeight};\n` +
          `  letter-spacing: ${v.letterSpacing};\n}`;
      })
      .join('\n\n');
    return header + body + '\n';
  },
});

// Tema claro: primitivas + semânticas light + escala + forma + tipografia
const light = new StyleDictionary({
  source: ['src/primitivos.json', 'src/semanticos.json', 'src/escala.json', 'src/forma.json', 'src/tipografia.json'],
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
        { destination: 'tokens.dart', format: 'flutter/class.dart', options: { className: 'RapidocsTokens' } },
      ],
    },
  },
});

// Tema escuro: só as semânticas dark (primitivas entram p/ resolver referências)
const dark = new StyleDictionary({
  source: ['src/primitivos.json', 'src/semanticos.dark.json'],
  platforms: {
    web: {
      transformGroup: 'css',
      buildPath: 'build/web/',
      files: [
        { destination: 'tokens.dark.css', format: 'css/variables', filter: onlyDarkSemantics, options: { selector: '[data-theme="dark"]' } },
      ],
    },
    dart: {
      transformGroup: 'flutter',
      buildPath: 'build/dart/',
      files: [
        { destination: 'tokens.dark.dart', format: 'flutter/class.dart', filter: onlyDarkSemantics, options: { className: 'RapidocsTokensDark' } },
      ],
    },
  },
});

// Tipografia: text styles -> classes utilitárias .text-*
const typography = new StyleDictionary({
  source: ['src/text-styles.json'],
  platforms: {
    web: {
      transformGroup: 'css',
      buildPath: 'build/web/',
      files: [
        { destination: 'tokens.typography.css', format: 'css/typography-classes' },
      ],
    },
  },
});

await light.buildAllPlatforms();
await dark.buildAllPlatforms();
await typography.buildAllPlatforms();
console.log('✓ Tokens gerados (light + dark + tipografia) em build/web e build/dart');
