# @rapidocs/ds-angular

Componentes **Angular** (web) do Design System Rapidocs. A aparência inteira vem
dos tokens de `@rapidocs/tokens`, então tema claro e escuro funcionam sem código
extra.

> **Regra de ouro do DS:** token é compartilhado, componente não é. Este pacote é
> a versão web dos componentes; o mobile mora em `components/flutter`
> (`rapidocs_ds`). Os dois bebem dos mesmos tokens.

Requer Angular 17 ou superior (`@angular/core`, `@angular/common` e
`@angular/platform-browser` entram como *peer dependencies*, ou seja, quem usa a
biblioteca é que traz o Angular).

---

## 1. Instalar

O pacote é distribuído direto do Git (npm público vem na Fase 2):

```bash
pnpm add "github:senhorargel/rapidocs-ds#path:/components/angular"
pnpm add "github:senhorargel/rapidocs-ds#path:/tokens"
```

Dentro deste próprio monorepo, use a referência de workspace:

```json
// package.json da app
"dependencies": {
  "@rapidocs/ds-angular": "workspace:*",
  "@rapidocs/tokens": "workspace:*"
}
```

A biblioteca é publicada como **código TypeScript** (sem passo de build
intermediário), então o compilador da aplicação lê os arquivos direto. Se o seu
projeto não resolver o pacote por conta própria, aponte o caminho no
`tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@rapidocs/ds-angular": ["./node_modules/@rapidocs/ds-angular/public-api.ts"]
    }
  }
}
```

## 2. Importar os tokens (obrigatório, uma vez só)

Sem os tokens os componentes ficam sem cor e sem medida. Importe os três
arquivos no CSS global da aplicação (`styles.css` / `styles.scss`):

```css
@import '@rapidocs/tokens/css';             /* cores, espaços e raios (tema claro) */
@import '@rapidocs/tokens/css-dark';        /* tema escuro                          */
@import '@rapidocs/tokens/css-typography';  /* famílias e classes .text-*           */
```

`@rapidocs/tokens` está declarado como *peer dependency* (não opcional) deste
pacote: se você instalar só a biblioteca, o npm/pnpm avisa que falta o pacote de
tokens em vez de deixar o componente aparecer sem cor e sem espaçamento.

A fonte **Archivo** precisa estar disponível na aplicação (Google Fonts ou
arquivo local) — os tokens só apontam o nome da família, não baixam a fonte.

O CSS de cada componente já vem junto do componente (via `styleUrls`), não
precisa importar à parte. Se por algum motivo você quiser carregar só o CSS:

```css
@import '@rapidocs/ds-angular/alert.css';
```

## 3. Usar

Os componentes são *standalone*: importe direto no componente que vai usá-los,
sem NgModule.

```ts
import { Component } from '@angular/core';
import { AlertComponent, type AlertStatus } from '@rapidocs/ds-angular';

@Component({
  selector: 'app-exemplo',
  standalone: true,
  imports: [AlertComponent],
  template: `
    <rds-alert
      status="success"
      size="large"
      title="Documento enviado"
      body="Recebemos seu arquivo e já estamos processando."
      linkText="Acompanhar"
      linkHref="/documentos"
      (linkClick)="abrirDetalhes($event)"
      (dismiss)="fecharAviso()">
    </rds-alert>
  `,
})
export class ExemploComponent {
  abrirDetalhes(evento: Event): void { /* ... */ }
  fecharAviso(): void { /* ... */ }
}
```

### Alert — propriedades

| Propriedade | Valores | Padrão | O que faz |
| --- | --- | --- | --- |
| `status` | `info` · `warning` · `success` · `error` · `update` | `info` | Cor de fundo e ícone. No Figma a propriedade se chama **Status**. |
| `size` | `large` · `small` | `large` | `large` = título + descrição + link empilhados. `small` = uma linha só. |
| `title` | texto | `''` | Título (no `large`) ou a mensagem inteira (no `small`). |
| `body` | texto | `''` | Descrição. Aparece só no `large` — e só quando tem texto. |
| `linkText` | texto | `'Link'` | Texto do link de ação. Vazio = link não aparece. |
| `linkHref` | texto | `'#'` | Destino do link. No padrão `'#'` o clique **não navega** (só dispara `(linkClick)`); com um destino de verdade, navega normal. |
| `showBody` | `true` · `false` | `true` | Liga/desliga a descrição. |
| `showLink` | `true` · `false` | `true` | Liga/desliga o link. Só aparece se `linkText` tiver texto. |
| `dismissible` | `true` · `false` | `true` | Mostra o botão de fechar (**Show Close BTN** no Figma). Sem ninguém escutando `(dismiss)` ele aparece desativado. |
| `icon` | SVG em texto · `null` | `null` | Troca o ícone do status (equivale ao *instance swap* do Figma). |

| Evento | Quando dispara |
| --- | --- |
| `(dismiss)` | Clique no botão de fechar. O componente **não** se esconde sozinho: quem usa decide o que fazer. Se ninguém escutar este evento, o X fica desativado. |
| `(linkClick)` | Clique no link. Recebe o `Event` — use `preventDefault()` se for navegar por rota. |

### Alert — variação small

```html
<rds-alert
  size="small"
  status="warning"
  title="Sua assinatura vence em 3 dias"
  linkText="Renovar">
</rds-alert>
```

### Alert — trocando o ícone

⚠️ O SVG passado em `icon` é injetado sem a sanitização do Angular. Use
**somente SVG confiável** (do próprio DS ou dos assets da sua aplicação). Nunca
passe aqui conteúdo digitado por usuário, vindo de query string ou de resposta de
API — seria uma porta aberta para XSS.

Para o ícone ficar coerente com o DS, o SVG precisa usar `fill="currentColor"`
(assim herda a cor do status) e declarar `viewBox="0 0 20 20"` (o CSS cuida do
tamanho: 20px no `large`, 16px no `small`).

```ts
readonly iconePix = `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 2 18 10 10 18 2 10Z" fill="currentColor"/>
</svg>`;
```

```html
<rds-alert status="update" title="Pagamento via Pix confirmado" [icon]="iconePix"></rds-alert>
```

## 4. Acessibilidade

- O container tem `role="alert"`: leitores de tela anunciam a mensagem quando ela
  aparece.
- O ícone é decorativo (`aria-hidden="true"`) — a informação está no texto, não na
  cor nem no desenho.
- O botão de fechar tem `aria-label="Fechar"`. Quando ninguém escuta `(dismiss)`
  ele é anunciado como **botão desativado** e sai da ordem de Tab — em vez de
  oferecer um botão que não faz nada (mesmo comportamento do Flutter).
- O link só é renderizado quando tem texto: link vazio entraria no Tab sem nome
  acessível (WCAG 2.4.4 e 4.1.2).
- O anel de foco do link e do botão de fechar usa `--content-primary`, que garante
  contraste acima de 3:1 (o mínimo da WCAG 2.4.11) nos cinco status e nos dois
  temas: medido, fica entre 16,90:1 e 18,44:1 no tema claro e entre 8,86:1 e
  13,84:1 no escuro.
- **Alvo de toque do X — desvio consciente (dívida):** o desenho do X é 20px
  (`large`) / 16px (`small`), como no Figma, mas a área clicável é ampliada para
  **44px** e **40px** (o ícone mais os 12px de padding do container em cada
  lado). Passa dos 24x24 que a WCAG 2.5.8 exige, e fica abaixo dos 48px que o
  Material recomenda: crescer mais empurraria o layout do Figma. É o mesmo teto
  do Flutter, então as duas plataformas se comportam igual.

## 5. Estrutura da pasta

```
components/angular/
  package.json      ← @rapidocs/ds-angular
  public-api.ts     ← ponto de entrada único (importe sempre daqui)
  README.md
  alert/
    alert.component.ts   ← o <rds-alert>
    alert.css            ← a aparência (mesmo arquivo que a vitrine usa)
    alert-icons.ts       ← os SVGs exportados do Figma
```

## 6. Vitrine

Todos os componentes têm story no Storybook, com os controles ligados às
propriedades acima:

```bash
corepack pnpm storybook
```

Versão publicada: <https://senhorargel.github.io/rapidocs-ds>
