import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ALERT_ICONS, ALERT_CLOSE_ICON, AlertStatus } from './alert-icons';

export type AlertSize = 'large' | 'small';

/**
 * Destino padrão do link — âncora vazia, herdada do Figma (o desenho tem link,
 * mas não tem destino). Serve de sentinela: com este valor o clique NÃO navega.
 */
const HREF_PADRAO = '#';

/**
 * Rapidocs DS — Alert / Notification.
 *
 * Espelha o component set `alert-notification 1.0` do Figma. Toda a aparência vem
 * do CSS canônico (`alert.css`) sobre os tokens — o mesmo que a vitrine (Storybook)
 * usa —, então tema claro/escuro sai de graça.
 *
 * ```html
 * <rds-alert status="success" size="large" title="Tudo certo!"
 *            body="Seu documento foi salvo." linkText="Ver" (dismiss)="onClose()">
 * </rds-alert>
 * ```
 *
 * Requer, na app, a importação única dos tokens de cor/tipografia:
 * `@import '@rapidocs/tokens/css';` (+ `tokens.dark.css` e `tokens.typography.css`).
 */
@Component({
  selector: 'rds-alert',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None, // usa as classes globais .rds-alert* (mesmo CSS da vitrine)
  styleUrls: ['./alert.css'],
  // O @Input() title (nome exigido pelo contrato de API) cai no atributo HTML
  // `title` do <rds-alert>, e aí o navegador mostra o texto do alerta como
  // tooltip amarelo ao passar o mouse. Anular o atributo no host mantém o input
  // funcionando e derruba o tooltip nativo.
  host: { '[attr.title]': 'null' },
  template: `
    <div class="rds-alert rds-alert--{{ size }} rds-alert--{{ status }}" role="alert">
      <!-- Decorativo: a mensagem já está no texto e o container tem role="alert". -->
      <span class="rds-alert__icon" aria-hidden="true" [innerHTML]="iconSvg"></span>

      <div class="rds-alert__content">
        <div *ngIf="size === 'large'; else smallTitle" class="rds-alert__title">{{ title }}</div>
        <ng-template #smallTitle><span class="rds-alert__title">{{ title }}</span></ng-template>

        <!-- Só renderiza se houver texto: com body vazio a div ainda entrava no
             layout e somava 2px de gap. Mesma regra do Flutter. -->
        <div *ngIf="size === 'large' && showBody && !!body" class="rds-alert__body">{{ body }}</div>

        <!-- Só renderiza se houver texto: link sem texto entra na ordem de Tab
             sem nome acessível (falha WCAG 2.4.4 / 4.1.2) e ainda soma o gap do
             layout. Mesma regra do Flutter (_mostrarLink).

             Sem ação possível (href ainda no '#' do Figma E ninguém escutando
             (linkClick)) o link fica DESATIVADO — mesma regra do X: o texto
             continua no layout, mas sem href o <a> sai da ordem de Tab, e
             role="link" com aria-disabled="true" faz o leitor de tela
             anunciá-lo como link desativado (um <a> sem href perde o papel de
             link; sem o role, o aria-disabled cairia no vazio). Espelha o
             Flutter: Semantics(link: true, enabled: false), sem foco. -->
        <a
          *ngIf="mostrarLink"
          class="rds-alert__link"
          [attr.href]="linkAtivo ? linkHref : null"
          [attr.role]="linkAtivo ? null : 'link'"
          [attr.aria-disabled]="linkAtivo ? null : true"
          (click)="onLink($event)"
        >{{ linkText }}</a>
      </div>

      <!-- O X continua ocupando o espaço do desenho (é o toggle do Figma), mas
           fica DESATIVADO quando ninguém escuta (dismiss) — em vez de oferecer um
           botão focável que não faz nada. Mesma regra do Flutter. -->
      <button
        *ngIf="dismissible"
        class="rds-alert__close"
        type="button"
        aria-label="Fechar"
        [disabled]="!fecharHabilitado"
        (click)="onDismiss()"
        [innerHTML]="closeSvg"
      ></button>
    </div>
  `,
})
export class AlertComponent {
  /** Tipo/status: info · warning · success · error · update. */
  @Input() status: AlertStatus = 'info';
  /** Tamanho: large (título + descrição + link) ou small (uma linha). */
  @Input() size: AlertSize = 'large';

  /** Título (Large) ou texto (Small). */
  @Input() title = '';
  /** Descrição — só aparece no Large. */
  @Input() body = '';
  /** Texto do link. */
  @Input() linkText = 'Link';
  /**
   * Destino do link. Com o padrão `'#'` o clique não navega (ver `onLink`);
   * e se, além disso, ninguém escutar `(linkClick)`, o link fica desativado
   * (ver `linkAtivo`).
   */
  @Input() linkHref = HREF_PADRAO;

  /** Mostrar a descrição (Large). */
  @Input() showBody = true;
  /** Mostrar o link — só aparece se `linkText` tiver texto. */
  @Input() showLink = true;
  /**
   * Mostrar o botão de fechar (Show Close BTN no Figma).
   *
   * Sem ninguém escutando `(dismiss)` o X aparece (é o toggle do desenho), mas
   * fica desativado — ver `fecharHabilitado`.
   */
  @Input() dismissible = true;

  /**
   * Swap do ícone — equivalente ao *instance swap* do ícone no Figma.
   *
   * Recebe o **markup SVG** que substitui o ícone padrão do status. Quando `null`
   * (padrão), usa o ícone do próprio status (`ALERT_ICONS[status]`).
   *
   * Para o ícone trocado ficar coerente com o DS, o SVG deve:
   * - usar `fill="currentColor"` (ou `stroke="currentColor"`) — assim ele herda a cor
   *   do status via CSS, sem precisar de token hardcoded;
   * - declarar `viewBox="0 0 20 20"` — o CSS dimensiona a caixa (20px no large,
   *   16px no small) e o SVG acompanha.
   *
   * ```ts
   * // no componente da app
   * readonly iconePix = `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
   *   <path d="M10 2 18 10 10 18 2 10Z" fill="currentColor"/>
   * </svg>`;
   * ```
   * ```html
   * <rds-alert status="update" title="Pagamento via Pix confirmado" [icon]="iconePix"></rds-alert>
   * ```
   *
   * ⚠️ SEGURANÇA: este markup é injetado via `bypassSecurityTrustHtml`, ou seja, passa
   * por fora da sanitização do Angular. Use **somente SVG confiável** — vindo do próprio
   * DS (`ALERT_ICONS`) ou de assets da sua aplicação. NUNCA passe aqui conteúdo de
   * entrada de usuário final, de query string ou de resposta de API não confiável:
   * seria uma porta aberta para XSS.
   */
  @Input() icon: string | null = null;

  /** Emitido ao clicar no botão de fechar. */
  @Output() dismiss = new EventEmitter<void>();
  /** Emitido ao clicar no link. */
  @Output() linkClick = new EventEmitter<Event>();

  /**
   * Ícone do X — é constante, então marcamos como confiável uma única vez,
   * na construção do componente (não a cada ciclo de detecção de mudanças).
   */
  readonly closeSvg: SafeHtml;

  // --- Memoização do ícone -------------------------------------------------
  // `bypassSecurityTrustHtml` devolve um objeto novo a cada chamada. Se o getter
  // recalculasse em todo ciclo de detecção de mudanças, o Angular veria uma
  // referência diferente e reescreveria o `innerHTML` do <span> sempre — o
  // navegador reparsearia o SVG à toa. O cache abaixo devolve a MESMA referência
  // enquanto `status` e `icon` não mudarem, e o binding fica estável.
  private iconCache: SafeHtml | null = null;
  private cachedStatus: AlertStatus | null = null;
  private cachedIcon: string | null = null;

  constructor(private readonly sanitizer: DomSanitizer) {
    // Usa o parâmetro local (e não `this.sanitizer`) para não depender da ordem
    // de inicialização dos campos da classe.
    this.closeSvg = sanitizer.bypassSecurityTrustHtml(ALERT_CLOSE_ICON);
  }

  /** SVG do ícone atual: o customizado (`icon`) ou o do status. Memoizado. */
  get iconSvg(): SafeHtml {
    if (this.iconCache === null || this.cachedStatus !== this.status || this.cachedIcon !== this.icon) {
      this.cachedStatus = this.status;
      this.cachedIcon = this.icon;
      // ⚠️ Ver o aviso de segurança no @Input() icon: só SVG confiável entra aqui.
      this.iconCache = this.sanitizer.bypassSecurityTrustHtml(this.icon ?? ALERT_ICONS[this.status]);
    }
    return this.iconCache;
  }

  /**
   * O link só existe se estiver ligado **e** tiver texto.
   *
   * Com `linkText` vazio o `<a>` saía no HTML sem nada dentro: entrava na ordem
   * de Tab sem nome acessível (WCAG 2.4.4 "Link Purpose" e 4.1.2 "Name, Role,
   * Value") e ainda somava os 2px de gap do layout. Espelha `_mostrarLink` do
   * Flutter.
   */
  get mostrarLink(): boolean {
    return this.showLink && this.linkText.length > 0;
  }

  /**
   * O link só fica ativo se tiver alguma ação possível: um destino de verdade
   * (`linkHref` diferente do `'#'` herdado do Figma) **ou** alguém escutando
   * `(linkClick)`.
   *
   * Sem nenhum dos dois, clicar não faria nada — e um link focável e inerte
   * mente para quem navega por teclado ou leitor de tela. É a mesma regra que
   * o X já aplica com `dismiss.observed` (ver `fecharHabilitado`), agora no
   * link: desativado, ele perde o `href` (sai da ordem de Tab) e é anunciado
   * com `aria-disabled="true"`. Espelha o Flutter (`onLinkTap == null` →
   * `Semantics(link: true, enabled: false)`).
   */
  get linkAtivo(): boolean {
    return this.linkHref !== HREF_PADRAO || this.linkClick.observed;
  }

  /**
   * O X só fica ativo se alguém estiver escutando `(dismiss)`.
   *
   * `EventEmitter.observed` (Angular 16+) diz se existe pelo menos um inscrito
   * no evento. Sem ninguém escutando, o clique não faria nada: em vez de deixar
   * um botão habilitado e focável que mente para o leitor de tela, ele é
   * anunciado como **desativado** — exatamente o que o Flutter faz
   * (`Semantics(button: true, enabled: false)`). O espaço do desenho continua
   * reservado, então o layout do Figma não muda.
   */
  get fecharHabilitado(): boolean {
    return this.dismiss.observed;
  }

  onDismiss(): void {
    this.dismiss.emit();
  }

  onLink(event: Event): void {
    // Desativado (sem destino e sem ouvinte) não há o que fazer: sem `href` o
    // clique já não navega, e emitir para ninguém seria inócuo — sai cedo.
    if (!this.linkAtivo) {
      return;
    }
    // Com o destino padrão ('#') o link é só um gatilho de ação: navegar até a
    // âncora vazia só sujaria a URL (e no Flutter o `onLinkTap` também não
    // navega). Com um href de verdade a navegação segue normal, e quem quiser
    // barrá-la chama preventDefault no próprio (linkClick).
    if (this.linkHref === HREF_PADRAO) {
      event.preventDefault();
    }
    this.linkClick.emit(event);
  }
}
