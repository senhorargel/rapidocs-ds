/**
 * Instalação — os trechos de código da página Fundação/Instalação
 * (`stories/Instalacao.mdx`).
 *
 * Ficam num `.ts` separado (e não dentro do MDX) por dois motivos:
 * 1. código com crase e `${}` dentro de MDX exige escape e quebra fácil;
 * 2. o MDX fica só com o TEXTO da página — mais fácil de revisar.
 *
 * ESCOPO: aqui mora só o que é do DESIGN SYSTEM INTEIRO (instalar tokens +
 * biblioteca de componentes, uma vez por projeto). Código de USO de um
 * componente específico mora na página dele (ex.: `components/Alert.receita.ts`).
 *
 * TUDO aqui espelha arquivos reais do repositório (lidos antes de escrever):
 *   tokens/package.json                → nome do pacote e os 4 exports (./css,
 *                                        ./css-dark, ./css-typography, ./scss)
 *   components/angular/package.json    → @rapidocs/ds-angular, peerDependencies
 *   components/angular/README.md       → instalação via git, tokens, tsconfig
 *   components/flutter/pubspec.yaml    → name: rapidocs_ds
 *   components/flutter/README.md       → dependência git, fonte, import único
 *   tokens/build/web/tokens.dark.css   → seletor real do tema escuro
 *   components/flutter/lib/src/theme/rapidocs_cores.dart → RapidocsCores.de()
 * Nada inventado.
 */

// ── Angular (web) · instalar ────────────────────────────────────────────────

export const ANGULAR_INSTALAR_PNPM = `# Fase 1: o pacote vem direto do repositório público no GitHub (npm vem na Fase 2)
pnpm add "github:senhorargel/rapidocs-ds#path:/components/angular"
pnpm add "github:senhorargel/rapidocs-ds#path:/tokens"`;

export const ANGULAR_INSTALAR_PACKAGE_JSON = `// o resultado no package.json da SUA aplicação
"dependencies": {
  "@rapidocs/ds-angular": "github:senhorargel/rapidocs-ds#path:/components/angular",
  "@rapidocs/tokens": "github:senhorargel/rapidocs-ds#path:/tokens"
}`;

export const ANGULAR_INSTALAR_WORKSPACE = `// package.json de uma app DENTRO deste monorepo (é o que a vitrine faz)
"dependencies": {
  "@rapidocs/ds-angular": "workspace:*",
  "@rapidocs/tokens": "workspace:*"
}`;

export const ANGULAR_TSCONFIG_PATHS = `{
  "compilerOptions": {
    "paths": {
      "@rapidocs/ds-angular": ["./node_modules/@rapidocs/ds-angular/public-api.ts"]
    }
  }
}`;

// ── Angular (web) · ligar os tokens ─────────────────────────────────────────

export const ANGULAR_TOKENS_CSS = `/* styles.css (o CSS global da aplicação) */
@import '@rapidocs/tokens/css';             /* cores, espaços e raios (tema claro) */
@import '@rapidocs/tokens/css-dark';        /* tema escuro                          */
@import '@rapidocs/tokens/css-typography';  /* famílias e classes .text-*           */`;

// ── Angular (web) · fonte Archivo ───────────────────────────────────────────

export const ANGULAR_FONTE_HTML = `<!-- index.html — os tokens só apontam o NOME da família; a fonte vem daqui -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700&display=swap">`;

// ── Angular (web) · conferir se funcionou ───────────────────────────────────

export const ANGULAR_CONFERIR_CONSOLE = `// Cole no console do navegador, com a aplicação aberta.
// Deve devolver uma cor. Se devolver vazio, o passo 2 não chegou no CSS global.
getComputedStyle(document.documentElement).getPropertyValue('--surface-primary')`;

// ── Web · tema escuro ───────────────────────────────────────────────────────

export const WEB_TEMA_ESCURO_HTML = `<!-- tokens.dark.css declara as cores em [data-theme="dark"]:
     o atributo no elemento raiz troca o tema de tudo de uma vez -->
<html data-theme="dark">`;

// ── Flutter (mobile) · instalar ─────────────────────────────────────────────

export const FLUTTER_PUBSPEC = `# pubspec.yaml da SUA app
dependencies:
  rapidocs_ds:
    git:
      url: https://github.com/senhorargel/rapidocs-ds.git
      ref: main                 # hoje o repositório não tem tag de versão;
                                # quando tiver, troque aqui (ex. v0.1.0)
      path: components/flutter`;

export const FLUTTER_PUB_GET = `flutter pub get`;

// ── Flutter (mobile) · fonte Archivo ────────────────────────────────────────

export const FLUTTER_FONTE_PUBSPEC = `# pubspec.yaml da SUA app — os arquivos .ttf ficam nos assets da app
flutter:
  fonts:
    - family: Archivo
      fonts:
        - asset: assets/fonts/Archivo-Regular.ttf
          weight: 400
        - asset: assets/fonts/Archivo-SemiBold.ttf
          weight: 600
        - asset: assets/fonts/Archivo-Bold.ttf
          weight: 700`;

// ── Flutter (mobile) · importar ─────────────────────────────────────────────

export const FLUTTER_IMPORT = `// um import só: tokens, resolução de claro/escuro e componentes
import 'package:rapidocs_ds/rapidocs_ds.dart';`;

// ── Flutter (mobile) · tema escuro ──────────────────────────────────────────

export const FLUTTER_TEMA_DART = `// RapidocsCores é a única camada que pergunta "qual é o modo agora?".
// Ela segue o Theme.of(context).brightness da sua app — sem parâmetro no componente.
final cores = RapidocsCores.de(context);
Text('oi', style: TextStyle(color: cores.contentPrimary));

// Explícito (teste, preview):
RapidocsCores.doBrilho(Brightness.dark);`;

// ── Atualizando ─────────────────────────────────────────────────────────────

export const ATUALIZAR_ANGULAR = `# Dependência de Git: o commit exato fica gravado no pnpm-lock.yaml.
# Isto busca o commit mais novo do ref declarado (main) e regrava o lock:
pnpm update @rapidocs/ds-angular @rapidocs/tokens`;

export const ATUALIZAR_FLUTTER = `# O commit exato fica gravado no pubspec.lock.
flutter pub upgrade rapidocs_ds`;
