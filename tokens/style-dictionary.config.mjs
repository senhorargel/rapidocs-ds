/**
 * Configuracao do Style Dictionary — Rapidocs DS
 *
 * Le os tokens em src/ (formato DTCG) e gera saidas para cada plataforma:
 *   - web/  -> tokens.css e tokens.scss  (consumido pelo Angular)
 *   - dart/ -> tokens.dart               (consumido pelo Flutter)
 *
 * Os tokens de src/ sao substituidos pela extracao real do Figma no /feature.
 */
export default {
  source: ['src/**/*.json'],
  platforms: {
    web: {
      transformGroup: 'css',
      buildPath: 'build/web/',
      files: [
        { destination: 'tokens.css', format: 'css/variables' },
        { destination: 'tokens.scss', format: 'scss/variables' }
      ]
    },
    dart: {
      transformGroup: 'flutter',
      buildPath: 'build/dart/',
      files: [
        {
          destination: 'tokens.dart',
          format: 'flutter/class.dart',
          options: { className: 'RapidocsTokens' }
        }
      ]
    }
  }
};
