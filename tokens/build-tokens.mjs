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
 * Saídas Dart (../components/flutter/lib/src/tokens/):
 *   tokens.dart             class RapidocsTokens (tema claro)
 *   tokens.dark.dart        class RapidocsTokensDark (semânticas dark)
 *
 * Por que as saídas Dart moram DENTRO do pacote Flutter: um arquivo em lib/ de um
 * pacote Dart não consegue importar por caminho relativo algo de fora do pacote.
 * Então o código gerado tem que nascer no pacote que o consome.
 *
 * A plataforma dart NÃO usa o transformGroup 'flutter' do Style Dictionary:
 * ele multiplicaria as dimensões por 16 (ver bloco de transforms abaixo).
 */
import StyleDictionary from 'style-dictionary';
import { sortByName } from 'style-dictionary/utils';
import { rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
// Trava anti-regressão da saída Dart. Mora em arquivo separado para poder ser
// rodada contra arquivos .dart de teste sem disparar o build inteiro.
import { travaDart } from './trava-dart.mjs';

const onlyDarkSemantics = (token) =>
  (token.filePath || '').replace(/\\/g, '/').endsWith('/semanticos.dark.json');

// Destino das saídas Dart: dentro do pacote Flutter "rapidocs_ds".
// Caminho relativo a tokens/ (é daqui que este script roda).
const DART_BUILD_PATH = '../components/flutter/lib/src/tokens/';

// Saída Dart antiga (build/dart/). Fica aqui só para ser apagada: duas cópias
// do mesmo token em lugares diferentes é receita de divergência.
const DART_BUILD_PATH_ANTIGO = 'build/dart';

/* ------------------------------------------------------------------ *
 * Transforms customizados p/ Dart
 *
 * Por que não usar o transformGroup 'flutter' pronto: ele inclui o
 * transform 'size/flutter/remToDouble', que multiplica todo valor de
 * dimensão por 16 (ele assume que a fonte está em rem). Nossos tokens
 * vêm do Figma em px ("12px"), então o resultado saía 16x maior
 * (paddingS virava 192.00 em vez de 12.0).
 *
 * Aqui a lista de transforms do Dart é montada à mão:
 *   attribute/cti            → metadados (mantido do grupo original)
 *   name/camel               → nomes camelCase (mantido do grupo original)
 *   color/hex8flutter        → Color(0xAARRGGBB) (mantido, NÃO regredir)
 *   size/rapidocs/dart-double→ "12px" -> 12.0 (sem multiplicar)
 *   string/rapidocs/dart     → família de fonte e afins entre aspas simples
 * ------------------------------------------------------------------ */

const valorBruto = (token, options) => (options?.usesDtcg ? token.$value : token.value);

const tipoDoToken = (token, options) => (options?.usesDtcg ? token.$type : token.type);

// px (ou número puro) -> literal double do Dart, sem conversão de escala
const paraDoubleDart = (valor) => {
  const n = parseFloat(valor);
  if (Number.isNaN(n)) return valor;
  return Number.isInteger(n) ? `${n}.0` : `${n}`;
};

// qualquer texto -> string literal válida em Dart, com aspas simples
const paraStringDart = (valor) => {
  const texto = Array.isArray(valor) ? valor[0] : valor; // fontFamily DTCG pode ser lista
  return `'${String(texto).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\$/g, '\\$')}'`;
};

StyleDictionary.registerTransform({
  name: 'size/rapidocs/dart-double',
  type: 'value',
  transitive: true,
  filter: (token, options) => {
    const tipo = tipoDoToken(token, options);
    return tipo === 'dimension' || tipo === 'fontSize' || tipo === 'lineHeight' || tipo === 'letterSpacing';
  },
  transform: (token, _config, options) => paraDoubleDart(valorBruto(token, options)),
});

StyleDictionary.registerTransform({
  name: 'string/rapidocs/dart',
  type: 'value',
  transitive: true,
  filter: (token, options) => {
    const tipo = tipoDoToken(token, options);
    // tipos cujo valor é texto no Dart. fontWeight numérico fica int;
    // fontWeight textual ("bold") precisa de aspas.
    if (tipo === 'fontFamily' || tipo === 'content' || tipo === 'asset') return true;
    if (tipo === 'fontWeight') return Number.isNaN(Number(valorBruto(token, options)));
    return false;
  },
  transform: (token, _config, options) => paraStringDart(valorBruto(token, options)),
});

// Lista explícita de transforms do Dart (substitui o transformGroup 'flutter')
const dartTransforms = [
  'attribute/cti',
  'name/camel',
  'color/hex8flutter',
  'size/rapidocs/dart-double',
  'string/rapidocs/dart',
];

// ------------------------------------------------------------------
// Formato customizado Dart: 'flutter/class-rapidocs.dart'
//
// Por que não usar o 'flutter/class.dart' que vem pronto: ele escreve a
// descrição do token como comentário de BLOCO, na mesma linha do valor.
// Em Dart, comentário de bloco ANINHA — abre-bloco dentro de um comentário
// abre um SEGUNDO nível, e o fecha-bloco seguinte fecha só esse nível de
// dentro. Isso é diferente de CSS e de JavaScript, onde o primeiro
// fecha-bloco encerra tudo.
//
// Várias descrições nossas terminam com "para status use feedback/" seguido
// de asterisco e ponto. Esse trecho é exatamente uma abertura de bloco: o
// comentário nunca voltava a fechar e o resto do arquivo inteiro virava
// comentário. Das 438 declarações, só 1 sobrevivia ao lexer do Dart e a
// classe RapidocsTokens nunca fechava — o arquivo não compilava.
//
// A correção: descrição vira DOC COMMENT DE LINHA (três barras), que é o
// idiomático em Dart e não tem como aninhar nem vazar para a linha seguinte.
// Ainda assim a descrição é higienizada, por segurança.
// ------------------------------------------------------------------

// Rede de segurança: quebra qualquer marcador de comentário de bloco que venha
// na descrição do token. Em doc comment de linha (três barras) isso já não
// causaria problema, mas garante que a saída não vira comentário aberto nem se
// alguém trocar o estilo de comentário no futuro.
//
// A quebra usa a barra invertida de escape do dartdoc (que lê markdown): no
// arquivo o par de caracteres deixa de existir, e na documentação renderizada
// o texto continua aparecendo como "feedback/*". Também normaliza CRLF.
const higienizarDescricao = (texto) =>
  String(texto)
    .replace(/\/\*/g, '/\\*')
    .replace(/\*\//g, '*\\/')
    .replace(/\r\n?/g, '\n');

// Descrição (1 linha ou várias) -> uma linha de doc comment por linha de texto
const docComment = (descricao, indentacao) =>
  higienizarDescricao(descricao)
    .split('\n')
    .map((linha) => linha.trim())
    .filter((linha) => linha !== '')
    .map((linha) => `${indentacao}/// ${linha}`)
    .join('\n');

const descricaoDoToken = (token) =>
  token.$description ?? token.description ?? token.comment ?? '';

StyleDictionary.registerFormat({
  name: 'flutter/class-rapidocs.dart',
  format: ({ dictionary, file, options }) => {
    const nomeClasse = options.className;
    const cabecalho = [
      '//',
      `// ${file.destination}`,
      '//',
      '// Nao edite este arquivo na mao: ele e gerado pelo Style Dictionary',
      '// a partir dos JSON em tokens/src (fonte da verdade: Figma).',
      '//',
      '',
      "import 'dart:ui';",
      '',
    ].join('\n');

    // Ordem alfabética: é a mesma ordem que o format 'flutter/class.dart'
    // usava, então a saída continua fácil de comparar e de ler.
    const corpo = [...dictionary.allTokens]
      .sort(sortByName)
      .map((token) => {
        const descricao = descricaoDoToken(token);
        const doc = descricao ? `${docComment(descricao, '    ')}\n` : '';
        return `${doc}    static const ${token.name} = ${valorBruto(token, options)};`;
      })
      .join('\n');

    return `${cabecalho}\nclass ${nomeClasse} {\n    ${nomeClasse}._();\n\n${corpo}\n}\n`;
  },
});

// A única família do DS é a Archivo e ela já é token (--familia-archivo).
// As classes .text-* apontam para o token em vez de repetir "Archivo" 28 vezes:
// se um dia a família mudar, muda em um lugar só.
const FAMILIAS_COM_TOKEN = { Archivo: 'var(--familia-archivo)' };

const familiaParaCss = (fontFamily) => {
  const nome = Array.isArray(fontFamily) ? fontFamily[0] : fontFamily;
  return FAMILIAS_COM_TOKEN[nome] ?? nome;
};

// Formato customizado: text styles (DTCG typography) -> classes CSS utilitárias
StyleDictionary.registerFormat({
  name: 'css/typography-classes',
  format: ({ dictionary }) => {
    const header = '/**\n * Do not edit directly, this file was auto-generated.\n * Classes utilitárias de tipografia (text styles do Figma).\n */\n\n';
    const body = dictionary.allTokens
      .map((t) => {
        const v = (t.original && t.original.$value) || t.value || t.$value;
        return `.text-${t.path.join('-')} {\n` +
          `  font-family: ${familiaParaCss(v.fontFamily)};\n` +
          `  font-weight: ${v.fontWeight};\n` +
          `  font-size: ${v.fontSize};\n` +
          `  line-height: ${v.lineHeight};\n` +
          `  letter-spacing: ${v.letterSpacing};\n}`;
      })
      .join('\n\n');
    return header + body + '\n';
  },
});

/* ------------------------------------------------------------------ *
 * ONDE O "$type" É DECLARADO NOS JSON DE ORIGEM — e por que importa
 *
 * O Style Dictionary FUNDE todas as fontes numa árvore só. Se duas fontes
 * declaram a mesma chave no mesmo caminho, ele avisa "Token collisions
 * detected". O "$type" conta como chave nessa conta.
 *
 * Enquanto os arquivos declaravam "$type" na RAIZ, esse aviso saía em toda
 * rodada do build (semanticos.json dizia "color" na raiz; escala.json e
 * forma.json diziam "dimension") — sem nenhuma colisão de token de verdade.
 * Aviso que aparece sempre é aviso que ninguém lê, então o tipo saiu da raiz
 * e passou a ser declarado por grupo (a convenção que primitivos.json já
 * usava). Agora "Token collisions detected" só aparece se houver problema
 * mesmo, e vale investigar.
 *
 * CUIDADO ao mexer em escala.json e forma.json: as duas trazem um grupo de
 * primeiro nível chamado "component" (escala = tamanhos, forma = raios), e
 * esses grupos se fundem. Por isso, nessas duas, o tipo fica em CADA TOKEN e
 * não no grupo — um "$type" no grupo "component" dos dois arquivos volta a
 * ser lido como colisão. Não reponha o "$type" na raiz nem no grupo
 * "component": todo token desses dois arquivos já declara o seu.
 * ------------------------------------------------------------------ */

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
      transforms: dartTransforms,
      buildPath: DART_BUILD_PATH,
      files: [
        { destination: 'tokens.dart', format: 'flutter/class-rapidocs.dart', options: { className: 'RapidocsTokens' } },
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
      transforms: dartTransforms,
      buildPath: DART_BUILD_PATH,
      files: [
        { destination: 'tokens.dark.dart', format: 'flutter/class-rapidocs.dart', filter: onlyDarkSemantics, options: { className: 'RapidocsTokensDark' } },
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

// Limpa a saída Dart antiga (tokens/build/dart/) para não ficar duas fontes
if (existsSync(DART_BUILD_PATH_ANTIGO)) {
  rmSync(DART_BUILD_PATH_ANTIGO, { recursive: true, force: true });
  console.log(`· saída Dart antiga removida: tokens/${DART_BUILD_PATH_ANTIGO}/`);
}

console.log('Conferindo a saída Dart (trava anti-regressão):');
travaDart([
  join(DART_BUILD_PATH, 'tokens.dart'),
  join(DART_BUILD_PATH, 'tokens.dark.dart'),
]);

console.log('✓ Tokens gerados: web em tokens/build/web/ · Dart em components/flutter/lib/src/tokens/');
