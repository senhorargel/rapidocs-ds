/**
 * Alert — os códigos da receita de implementação da página Docs (Alert.mdx).
 *
 * Ficam num `.ts` separado (e não dentro do MDX) por dois motivos:
 * 1. código com crase e `${}` dentro de MDX exige escape e quebra fácil;
 * 2. o MDX fica só com o TEXTO da página — mais fácil de revisar.
 *
 * TUDO aqui espelha arquivos reais do repositório (lidos antes de escrever):
 *   components/angular/package.json   → nome do pacote e jeito de instalar
 *   components/angular/README.md      → tokens, fonte, exemplo de uso
 *   components/angular/alert/alert.component.ts → API real
 *   components/flutter/README.md      → instalação git do pacote Dart
 * Nada inventado.
 */

// ── Angular · Passo 1 — instalar (uma vez por projeto) ──────────────────────

export const PASSO1_BASH = `pnpm add "github:senhorargel/rapidocs-ds#path:/components/angular"
pnpm add "github:senhorargel/rapidocs-ds#path:/tokens"`;

export const PASSO1_JSON = `"dependencies": {
  "@rapidocs/ds-angular": "github:senhorargel/rapidocs-ds#path:/components/angular",
  "@rapidocs/tokens": "github:senhorargel/rapidocs-ds#path:/tokens"
}`;

// ── Angular · Passo 2 — ligar os tokens (uma vez por projeto) ───────────────

export const PASSO2_CSS = `/* styles.css (o CSS global da aplicação) */
@import '@rapidocs/tokens/css';             /* cores, espaços e raios (tema claro) */
@import '@rapidocs/tokens/css-dark';        /* tema escuro                          */
@import '@rapidocs/tokens/css-typography';  /* famílias e classes .text-*           */`;

export const PASSO2_FONTE = `<!-- index.html — os tokens só apontam o NOME da família; a fonte vem daqui -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700&display=swap">`;

// ── Angular · Passo 3 — importar o componente ───────────────────────────────

export const PASSO3_TS = `import { Component } from '@angular/core';
import { AlertComponent } from '@rapidocs/ds-angular';

@Component({
  selector: 'app-minha-tela',
  standalone: true,
  imports: [AlertComponent],   // standalone: sem NgModule
  templateUrl: './minha-tela.html',
})
export class MinhaTelaComponent {}`;

// ── Angular · Passo 4 — usar na tela ────────────────────────────────────────

export const PASSO4_HTML = `<rds-alert
  status="success"
  size="large"
  title="Documento enviado"
  body="Recebemos seu arquivo e já estamos processando."
  linkText="Acompanhar"
  linkHref="/documentos">
</rds-alert>`;

// ── Angular · Passo 5 — reagir aos eventos ──────────────────────────────────

export const PASSO5_HTML = `@if (mostrarAlerta) {
  <rds-alert
    title="Confira seus dados cadastrais"
    body="Alguns campos ainda estão em branco."
    linkText="Completar agora"
    (linkClick)="abrirCadastro($event)"
    (dismiss)="mostrarAlerta = false">
  </rds-alert>
}`;

export const PASSO5_TS = `export class MinhaTelaComponent {
  // O componente NÃO se esconde sozinho: ele só emite (dismiss).
  // Este bool é a sua tela decidindo tirar a mensagem do ar.
  mostrarAlerta = true;

  abrirCadastro(evento: Event): void {
    evento.preventDefault();               // se for navegar por rota do Angular
    // this.router.navigate(['/cadastro']);
  }
}`;

// ── Flutter (app) — seção compacta ──────────────────────────────────────────

export const FLUTTER_PUBSPEC = `# pubspec.yaml da SUA app — depois rode: flutter pub get
dependencies:
  rapidocs_ds:
    git:
      url: https://github.com/senhorargel/rapidocs-ds.git
      ref: main                 # ou uma tag de versão, ex. v0.1.0
      path: components/flutter`;

export const FLUTTER_EXEMPLO = `import 'package:rapidocs_ds/rapidocs_ds.dart';

RdsAlert(
  status: RdsAlertStatus.success,
  title: 'Documento enviado',
  body: 'Vamos te avisar quando a análise terminar.',
  linkText: 'Acompanhar',
  onLinkTap: () => Navigator.pushNamed(context, '/status'),
  onDismiss: () => setState(() => _mostrarAlerta = false),
)`;
