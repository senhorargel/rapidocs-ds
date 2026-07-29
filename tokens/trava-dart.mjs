/**
 * TRAVA ANTI-REGRESSÃO dos arquivos Dart gerados — Rapidocs DS
 *
 * Flutter/Dart não está instalado em toda máquina, então não dá para contar com
 * "dart analyze" para pegar erro de sintaxe no código gerado. Este verificador
 * varre o texto do jeito que o lexer do Dart varreria e reprova o build antes
 * do arquivo quebrado chegar no app.
 *
 * Mora num arquivo separado do build de propósito: assim a trava pode ser
 * chamada contra arquivos .dart de teste (com defeito de mentira) sem rodar o
 * build inteiro. É o que prova que ela realmente pega cada problema.
 *
 * O que é conferido em cada arquivo, numa só passada:
 *   1. comentário de bloco aberto e nunca fechado (respeitando ANINHAMENTO)
 *   2. chaves { } desbalanceadas (a classe não fecha)
 *   3. nome de declaração repetido na mesma classe
 *   4. nome que não é identificador Dart válido
 *   5. nome que é palavra reservada do Dart
 *   6. valor emitido num formato que o Dart não aceita
 *
 * A trava junta TODOS os problemas de TODOS os arquivos e só então falha, para
 * quem estiver arrumando ver a lista inteira de uma vez.
 */
import { readFileSync } from 'node:fs';

/* ------------------------------------------------------------------ *
 * Palavras reservadas do Dart
 *
 * Fonte da lista (conferida, não decorada): repositório oficial da linguagem,
 * dart-lang/sdk → pkg/_fe_analyzer_shared/lib/src/scanner/token.dart, classe
 * "Keyword": são as 33 entradas marcadas com KeywordStyle.reserved. É a mesma
 * tabela publicada em https://dart.dev/language/keywords (as palavras que
 * aparecem lá SEM nenhum número em cima).
 *
 * Reservada = não pode ser usada como identificador em lugar nenhum. Um
 * "static const class = ..." não compila.
 *
 * O que de propósito NÃO está aqui: os "built-in identifiers" do Dart
 * (abstract, as, dynamic, static, get, set, late, mixin, typedef, ...). Esses
 * são permitidos como nome de campo — feios, mas legais —, então reprovar o
 * build por causa deles seria rigor demais e travaria token legítimo.
 * ------------------------------------------------------------------ */
export const RESERVADAS_DART = new Set([
  'assert', 'break', 'case', 'catch', 'class', 'const', 'continue', 'default',
  'do', 'else', 'enum', 'extends', 'false', 'final', 'finally', 'for', 'if',
  'in', 'is', 'new', 'null', 'rethrow', 'return', 'super', 'switch', 'this',
  'throw', 'true', 'try', 'var', 'void', 'while', 'with',
]);

/**
 * "await" e "yield" são as reservadas parciais do Dart (KeywordStyle.pseudo na
 * mesma fonte, marcadas com o número 3 na tabela do dart.dev): proibidas como
 * identificador dentro de qualquer corpo de função marcado async, async* ou
 * sync*. Um token com esse nome compilaria até alguém tentar usar em código
 * assíncrono — que é justamente onde mais se lê token de cor. Reprovamos junto.
 */
export const RESERVADAS_ASSINCRONIA = new Set(['await', 'yield']);

/**
 * Identificador Dart: começa com letra ASCII, "_" ou "$", e segue com letra,
 * dígito, "_" ou "$". A gramática do Dart define LETTER como só a..z A..Z
 * (não é Unicode), por isso a regex é ASCII.
 */
const IDENTIFICADOR_DART = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/* ------------------------------------------------------------------ *
 * Formatos de valor que a nossa geração pode emitir
 *
 * Toda declaração tem de cair em um destes três. Sem isso, um token de
 * dimensão com valor não numérico (por exemplo alguém escrever "quatro" em vez
 * de "4px" no JSON) sairia como "static const x = quatro;": não compila, e a
 * trava antiga deixava passar porque as chaves e os comentários estavam certos.
 * ------------------------------------------------------------------ */
const VALOR_COR = /^Color\(0x[0-9a-fA-F]{8}\)$/;                    // Color(0xAARRGGBB)
const VALOR_NUMERO = /^-?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/;    // 12.0 · 400 · 1.45
const VALOR_TEXTO = /^'(?:[^'\\\n]|\\.)*'$/;                        // 'Archivo'

// Linha de declaração: "    static const nomeDoToken = valor;"
const LINHA_DECLARACAO = /^\s*static const ([^\s=]+)\s*=\s*(.+);\s*$/;

/**
 * Confere um arquivo .dart gerado.
 *
 * Devolve o balanço de comentários/chaves, quantas declarações achou e a lista
 * de problemas de nome e de valor (cada um já com o número da linha).
 */
export function conferirDart(caminho) {
  const texto = readFileSync(caminho, 'utf8');
  let prof = 0;   // profundidade de comentário de bloco (aninha em Dart)
  let chaves = 0; // balanço de { }
  let fechouDemais = false;

  // Espelho do arquivo contendo SÓ o código: cada caractere de comentário vira
  // espaço e as quebras de linha são preservadas. É isso que faz as conferências
  // de nome e de valor olharem apenas código de verdade — um "static const" que
  // apareça escrito dentro da descrição de um token não é confundido com
  // declaração, e o número da linha continua batendo com o arquivo original.
  const codigo = [];

  for (let i = 0; i < texto.length; i += 1) {
    const dois = texto.slice(i, i + 2);
    if (prof > 0) {                                    // dentro de comentário de bloco
      if (dois === '/*') { prof += 1; codigo.push('  '); i += 1; continue; }
      if (dois === '*/') { prof -= 1; codigo.push('  '); i += 1; continue; }
      codigo.push(texto[i] === '\n' ? '\n' : ' ');
      continue;
    }
    if (dois === '/*') { prof = 1; codigo.push('  '); i += 1; continue; }
    if (dois === '//') {                               // comentário de linha (inclui os /// de doc)
      const fim = texto.indexOf('\n', i);
      const ate = fim === -1 ? texto.length : fim;     // para ANTES da quebra de linha
      codigo.push(' '.repeat(ate - i));
      i = ate - 1;                                     // o laço avança e cai na quebra de linha
      continue;
    }
    const c = texto[i];
    if (c === "'" || c === '"') {                      // string: '/*' e '{' aqui não contam
      codigo.push(c);
      i += 1;
      while (i < texto.length && texto[i] !== c && texto[i] !== '\n') {
        const passo = texto[i] === '\\' ? 2 : 1;
        codigo.push(texto.slice(i, i + passo));
        i += passo;
      }
      if (i < texto.length) codigo.push(texto[i]);     // a aspa que fecha (ou a quebra de linha)
      continue;
    }
    if (c === '{') chaves += 1;
    if (c === '}') { chaves -= 1; if (chaves < 0) fechouDemais = true; }
    codigo.push(c);
  }

  // --- conferências de nome e de valor, sobre o código sem comentários ---
  const problemas = [];
  const vistos = new Map();   // nome -> linha da primeira aparição
  let declaracoes = 0;

  const linhas = codigo.join('').split('\n');
  linhas.forEach((linha, indice) => {
    if (!/^\s*static const /.test(linha)) return;
    declaracoes += 1;
    const n = indice + 1;

    const achado = LINHA_DECLARACAO.exec(linha);
    if (!achado) {
      problemas.push(
        `linha ${n}: declaração em formato inesperado (${linha.trim()}). ` +
        'A trava não consegue conferir nome nem valor aqui — arrume a linha ou o gerador.',
      );
      return;
    }
    const [, nome, valor] = achado;

    // (3) nome repetido: duas declarações com o mesmo nome na mesma classe
    if (vistos.has(nome)) {
      problemas.push(
        `linha ${n}: o nome "${nome}" já foi declarado na linha ${vistos.get(nome)}. ` +
        'Em Dart, dois campos com o mesmo nome na mesma classe NÃO compilam. ' +
        'Provável causa: dois caminhos de token diferentes virando o mesmo nome camelCase ' +
        '(ex.: "gap.2xs" e "gap.2-xs").',
      );
    } else {
      vistos.set(nome, n);
    }

    // (4) e (5) nome válido como identificador Dart
    if (!IDENTIFICADOR_DART.test(nome)) {
      problemas.push(
        `linha ${n}: "${nome}" não é um nome válido em Dart. ` +
        'Vale só letra ASCII, dígito, "_" e "$", e não pode começar com dígito. ' +
        'Provável causa: nome de token no Figma com acento, espaço, ponto ou barra.',
      );
    } else if (RESERVADAS_DART.has(nome)) {
      problemas.push(
        `linha ${n}: "${nome}" é palavra reservada do Dart e não pode ser nome de campo. ` +
        'Renomeie o token no Figma (ex.: "default" -> "padrao", "class" -> "classe").',
      );
    } else if (RESERVADAS_ASSINCRONIA.has(nome)) {
      problemas.push(
        `linha ${n}: "${nome}" é reservada do Dart dentro de código assíncrono ` +
        '(async, async* e sync*). O arquivo até compila, mas quebra na hora de usar o token ' +
        'nesse tipo de função. Renomeie o token no Figma.',
      );
    }

    // (6) formato do valor emitido
    if (!VALOR_COR.test(valor) && !VALOR_NUMERO.test(valor) && !VALOR_TEXTO.test(valor)) {
      problemas.push(
        `linha ${n}: o valor de "${nome}" saiu como "${valor}", fora dos formatos que a ` +
        'geração de tokens emite: Color(0xAARRGGBB), um número (12.0, 400) ou um texto entre ' +
        'aspas simples. Provável causa: token de dimensão com valor não numérico no JSON de ' +
        'origem, ou referência {…} que não foi resolvida — os dois casos não compilam. ' +
        'A conferência é de propósito mais rígida que a linguagem (aspas duplas, por exemplo, ' +
        'são Dart válido, mas indicam que a geração mudou de comportamento sem aviso).',
      );
    }
  });

  return { prof, chaves, fechouDemais, declaracoes, problemas };
}

/**
 * Roda a conferência na lista de arquivos, imprime o resumo de cada um e
 * derruba o build se qualquer um tiver problema.
 */
export function travaDart(caminhos) {
  const problemas = [];
  for (const caminho of caminhos) {
    const r = conferirDart(caminho);
    if (r.prof !== 0) {
      problemas.push(
        `${caminho}: comentário de bloco aberto e nunca fechado (profundidade final ${r.prof}). ` +
        'Em Dart comentário de bloco ANINHA: alguma descrição de token traz um abre-bloco no texto. ' +
        'O arquivo NÃO compila — as declarações depois disso viram comentário.',
      );
    }
    if (r.chaves !== 0 || r.fechouDemais) {
      problemas.push(`${caminho}: chaves desbalanceadas (balanço final ${r.chaves}). A classe não fecha.`);
    }
    for (const p of r.problemas) problemas.push(`${caminho}: ${p}`);

    const nomesEValores = r.problemas.length === 0 ? 'OK' : `${r.problemas.length} PROBLEMA(S)`;
    console.log(
      `  ${caminho} — profundidade final: ${r.prof} · ` +
      `chaves: ${r.chaves === 0 && !r.fechouDemais ? 'balanceadas' : 'DESBALANCEADAS'} · ` +
      `${r.declaracoes} declarações · nomes e valores: ${nomesEValores}`,
    );
  }
  if (problemas.length > 0) {
    console.error('\n✗ Build dos tokens FALHOU — saída Dart inválida:');
    for (const p of problemas) console.error(`  - ${p}`);
    process.exitCode = 1;
    throw new Error('Saída Dart inválida: veja os problemas listados acima.');
  }
}
