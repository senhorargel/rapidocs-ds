import type { Meta, StoryObj } from '@storybook/html';
// CSS pelo NOME DO PACOTE — export `./alert.css` de @rapidocs/ds-angular.
// É o MESMO arquivo que o componente Angular usa via `styleUrls`: a vitrine
// desenha com o CSS real do componente, não com uma cópia.
import '@rapidocs/ds-angular/alert.css';
// Os ícones ainda entram por caminho relativo, e o motivo é medido (não
// suposto): a única porta pública do pacote (`public-api.ts`) exporta os ícones
// JUNTO do AlertComponent, e importar o barrel arrasta `@angular/core` para o
// bundle da vitrine — que é `@storybook/html-vite`, sem Angular. Testado: o
// build morre em "Rollup failed to resolve import '@angular/core'". Dar um
// subcaminho `./alert-icons` ao `exports` do pacote resolveria, mas é mexer na
// API pública do pacote — fora do escopo da vitrine.
import {
  ALERT_ICONS,
  ALERT_CLOSE_ICON,
  type AlertStatus,
} from '../../../../components/angular/alert/alert-icons';

import { esc, legenda, garantirEstilos, molduraCelular } from '../vitrine/vitrine';

// ═════════════════════════════════════════════════════════════════════════════
// A página Docs deste componente é o Alert.mdx AO LADO (anexado via
// <Meta of={AlertStories} />). Por isso o meta NÃO tem a tag `autodocs`, e as
// stories de catálogo levam `tags: ['!dev']`: somem da sidebar, mas continuam
// vivas para os blocos <Canvas> do MDX. Na sidebar sobram só Docs + Playground.
//
// O CÓDIGO para copiar não mora mais aqui: ele vive no Alert.mdx, na aba
// "Código", com o seletor Angular/Flutter e os trechos canônicos de
// Alert.receita.ts (o bloco <Source> do Storybook já traz o botão de copiar).
// Este arquivo cuida só do que aparece na TELA.
// ═════════════════════════════════════════════════════════════════════════════

type IconeDemo = 'padrao' | 'sino' | 'estrela';

type AlertArgs = {
  status: AlertStatus;
  size: 'large' | 'small';
  title: string;
  body: string;
  link: string;
  showBody: boolean;
  showLink: boolean;
  showClose: boolean;
  icone: IconeDemo;
};

const STATUSES: AlertStatus[] = ['info', 'warning', 'success', 'error', 'update'];
const STATUS_LABEL: Record<AlertStatus, string> = {
  info: 'Information', warning: 'Warning', success: 'Success', error: 'Error', update: 'Update',
};

/**
 * Ícones alternativos só para demonstrar o **swap** (a mesma coisa que o
 * *instance swap* do ícone no Figma / o `@Input() icon` no Angular).
 *
 * A receita de qualquer SVG que entre aqui: `viewBox="0 0 20 20"` e
 * `fill="currentColor"` — assim ele herda a caixa (20px no large, 16px no small)
 * e a cor do status, sem cor chumbada.
 */
const ICONES_DEMO: Record<IconeDemo, string | null> = {
  padrao: null, // usa o ícone do próprio status
  sino: `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 1.5a4.5 4.5 0 0 0-4.5 4.5v3.2c0 .5-.18.98-.5 1.36l-1.1 1.3A1.2 1.2 0 0 0 4.82 14h10.36a1.2 1.2 0 0 0 .92-2.14l-1.1-1.3a2.1 2.1 0 0 1-.5-1.36V6A4.5 4.5 0 0 0 10 1.5Zm0 15.8a2.4 2.4 0 0 0 2.32-1.8H7.68A2.4 2.4 0 0 0 10 17.3Z" fill="currentColor"/></svg>`,
  estrela: `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 1.6l2.47 5.13 5.63.75-4.13 3.9 1.03 5.6L10 14.28l-5 2.7 1.03-5.6L1.9 7.48l5.63-.75L10 1.6Z" fill="currentColor"/></svg>`,
};

const ICONE_LABEL: Record<IconeDemo, string> = {
  padrao: 'padrão do status',
  sino: 'sino (customizado)',
  estrela: 'estrela (customizado)',
};

// ═════════════════════════════════════════════════════════════════════════════
// O componente na tela
// ═════════════════════════════════════════════════════════════════════════════

type OpcoesRender = {
  /**
   * Liga o `role="alert"` — uma *live region* assertiva: o leitor de tela
   * interrompe o que estiver falando para anunciar o conteúdo. No componente
   * real ele está sempre presente. Nas vitrines de catálogo fica DESLIGADO de
   * propósito: vários exemplos com live region fariam o leitor de tela tentar
   * anunciar a página inteira ao abrir.
   */
  comRole?: boolean;
  /**
   * Simula ninguém escutando `(dismiss)`: o X aparece (é o toggle do desenho)
   * mas DESATIVADO — `disabled` de verdade, fora da ordem de Tab. Igual ao
   * componente real (`EventEmitter.observed`) e ao Flutter
   * (`Semantics(button: true, enabled: false)`).
   */
  xSemConsumidor?: boolean;
  /**
   * Simula link sem ação possível (href no `'#'` do Figma E ninguém escutando
   * `(linkClick)`): sem `href` ele sai da ordem de Tab, e `role="link"` +
   * `aria-disabled="true"` faz o leitor de tela anunciá-lo como link
   * desativado. Igual ao componente real (`linkAtivo`) e ao Flutter
   * (`Semantics(link: true, enabled: false)`).
   */
  linkSemConsumidor?: boolean;
};

/**
 * Monta o HTML do Alert com as mesmas classes do componente Angular
 * (`alert.css` é o arquivo real, importado no topo).
 */
function renderAlert(a: Partial<AlertArgs>, op: OpcoesRender = {}): string {
  const size = a.size ?? 'large';
  const status = a.status ?? 'info';
  const isLarge = size === 'large';
  const title = a.title ?? 'Seu texto de alerta vai aqui';
  const body = a.body ?? 'Seu texto de alerta vai aqui';
  const link = a.link ?? 'Link';
  const showBody = a.showBody ?? true;
  const showLink = a.showLink ?? true;
  const showClose = a.showClose ?? true;
  // Swap do ícone: o customizado ganha; sem ele, o ícone do status.
  const icone = ICONES_DEMO[a.icone ?? 'padrao'] ?? ALERT_ICONS[status];

  const content: string[] = [];
  const titleTag = isLarge ? 'div' : 'span';
  // esc(): o Angular interpola com {{ }} e mostra marcação como texto literal.
  content.push(`<${titleTag} class="rds-alert__title">${esc(title)}</${titleTag}>`);
  // `&& body`: descrição só existe se tiver texto — regra de paridade (Angular:
  // `size === 'large' && showBody && !!body`; Flutter: `showBody && corpo != null
  // && corpo.isNotEmpty`). Div vazia somaria os 2px de gap do layout.
  if (isLarge && showBody && body) content.push(`<div class="rds-alert__body">${esc(body)}</div>`);
  // `&& link`: link só existe se tiver texto (WCAG 2.4.4 e 4.1.2). Desativado
  // (sem consumidor), perde o href — sai do Tab — e é anunciado como link
  // desativado. Ativo, o href '#' com onclick "return false" simula o
  // componente real: com o linkHref padrão o clique NÃO navega, só dispara o
  // evento.
  if (showLink && link) {
    content.push(
      op.linkSemConsumidor
        ? `<a class="rds-alert__link" role="link" aria-disabled="true">${esc(link)}</a>`
        : `<a class="rds-alert__link" href="#" onclick="return false">${esc(link)}</a>`,
    );
  }

  const parts: string[] = [];
  parts.push(`<span class="rds-alert__icon" aria-hidden="true">${icone}</span>`);
  parts.push(`<div class="rds-alert__content">${content.join('')}</div>`);
  if (showClose) {
    // Sem onclick inline: quem liga o comportamento é ligarFechar(), que remove
    // o nó de verdade e oferece "Restaurar exemplo". O X sem consumidor sai
    // `disabled` de verdade — clique não dispara e ele fica fora do Tab.
    const inerte = op.xSemConsumidor ? ' disabled' : '';
    parts.push(
      `<button class="rds-alert__close" type="button" aria-label="Fechar"${inerte}>${ALERT_CLOSE_ICON}</button>`,
    );
  }
  const role = op.comRole ? ' role="alert"' : '';
  return `<div class="rds-alert rds-alert--${size} rds-alert--${status}"${role}>${parts.join('')}</div>`;
}

// ═════════════════════════════════════════════════════════════════════════════
// Botão X da vitrine
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Liga o X dos exemplos: **remove o alerta da página** e deixa um botão para
 * trazer de volta. É a vitrine fazendo o papel da aplicação, na cara limpa: o
 * componente real não se esconde sozinho — só emite `(dismiss)` / `onDismiss`.
 */
function ligarFechar(escopo: HTMLElement): void {
  for (const botao of escopo.querySelectorAll<HTMLButtonElement>('.rds-alert__close')) {
    botao.addEventListener('click', () => {
      const alerta = botao.closest<HTMLElement>('.rds-alert');
      const pai = alerta?.parentElement;
      if (!alerta || !pai) return;

      const marca = document.createElement('div');
      marca.className = 'rds-restaurar';
      marca.innerHTML = `
        <span>
          Alerta removido da página — foi a <strong>vitrine</strong> que removeu.
          O componente só emite <code>(dismiss)</code> / <code>onDismiss</code>.
        </span>
        <button class="rds-btn" type="button">Restaurar exemplo</button>`;

      pai.replaceChild(marca, alerta);
      // O nó do alerta continua vivo na memória (com este mesmo listener), então
      // restaurar é só devolvê-lo ao lugar — sem religar nada.
      marca.querySelector('button')!.addEventListener('click', () => {
        pai.replaceChild(alerta, marca);
      });
    });
  }
}

/**
 * Empacota o HTML de uma amostra num elemento e liga o X.
 *
 * `garantirEstilos()` entra aqui porque o CSS da vitrine (legendas, moldura de
 * celular e o aviso de "Restaurar exemplo") não vem de decorator nenhum: cada
 * story que usa esse vocabulário pede o CSS uma vez, e a função é idempotente.
 */
function amostra(html: string): HTMLElement {
  garantirEstilos();
  const caixa = document.createElement('div');
  caixa.innerHTML = html;
  ligarFechar(caixa);
  return caixa;
}

// ═════════════════════════════════════════════════════════════════════════════
// Stories — na sidebar aparecem SÓ "Docs" (o Alert.mdx anexado) e "Playground".
// O resto é catálogo com tags ['!dev']: invisível na sidebar, usado nos blocos
// <Canvas> da página Docs.
// ═════════════════════════════════════════════════════════════════════════════

const meta: Meta<AlertArgs> = {
  title: 'Componentes/Alert',
  argTypes: {
    status: { control: 'select', options: STATUSES, description: 'Tipo/status do alerta' },
    size: { control: 'inline-radio', options: ['large', 'small'], description: 'Tamanho' },
    title: { control: 'text', description: 'Título (Large) / texto (Small)' },
    body: { control: 'text', description: 'Descrição (só no Large; vazia = não aparece)' },
    link: { control: 'text', description: 'Texto do link (vazio = não aparece)' },
    showBody: { control: 'boolean', description: 'Mostrar descrição (Large)' },
    showLink: { control: 'boolean', description: 'Mostrar link' },
    showClose: { control: 'boolean', description: 'Mostrar botão fechar' },
    icone: {
      name: 'ícone (swap)',
      control: { type: 'inline-radio', labels: ICONE_LABEL },
      options: ['padrao', 'sino', 'estrela'],
      description:
        'Troca o desenho do ícone, igual ao *instance swap* do Figma. Aqui são só dois exemplos ' +
        '(sino e estrela), mas **qualquer SVG serve**: no Angular é o `[icon]="seuSvg"`, no Flutter é o ' +
        '`icon: Icon(...)`. Para o ícone acompanhar o DS, use `viewBox="0 0 20 20"` e ' +
        '`fill="currentColor"` — assim ele herda o tamanho (20px large / 16px small) e a cor do status.',
    },
  },
  args: {
    status: 'info', size: 'large',
    title: 'Seu texto de alerta vai aqui',
    body: 'Seu texto de alerta vai aqui',
    link: 'Link',
    showBody: true, showLink: true, showClose: true,
    icone: 'padrao',
  },
  // Único lugar da vitrine com role="alert": é o exemplo que muda quando você
  // mexe nos controles, e é para isso que a live region existe.
  //
  // O max-width é a mesma largura confortável das galerias de catálogo abaixo:
  // alerta esticado na largura inteira do canvas ensina uma proporção que não
  // existe em tela de verdade.
  render: (a) =>
    amostra(
      `<div style="max-width:460px">${renderAlert(a, { comRole: true })}</div>`,
    ),
};
export default meta;
type Story = StoryObj<AlertArgs>;

/**
 * A story de experimentação — a única com controles ligados, e a única com
 * `role="alert"` (herda o `render` do meta). Mexa nos controles e veja a prévia
 * no navegador mudar. Nada de painel de código aqui: o código de copiar está na
 * aba **Código** da página Docs, com o seletor Angular/Flutter.
 */
export const Playground: Story = {};

/** Catálogo (página Docs): os 5 status, large. */
export const Status: Story = {
  name: 'Os cinco status',
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () =>
    amostra(`
      <div style="display:flex;flex-direction:column;gap:var(--gap-l);max-width:460px">
        ${STATUSES.map((s) => `
          <div>
            ${legenda(STATUS_LABEL[s])}
            ${renderAlert({ status: s, size: 'large' })}
          </div>`).join('')}
      </div>`),
};

/** Catálogo (página Docs): large × small. */
export const Tamanhos: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () =>
    amostra(`
      <div style="display:flex;flex-direction:column;gap:var(--gap-l);max-width:460px">
        <div>
          ${legenda('Large — título + descrição + link empilhados, ícone de 20px')}
          ${renderAlert({ status: 'info', size: 'large' })}
        </div>
        <div>
          ${legenda('Small — uma linha, ícone de 16px, o título empurra o link para a direita')}
          ${renderAlert({ status: 'info', size: 'small' })}
        </div>
      </div>`),
};

/** Catálogo (página Docs): os interruptores de conteúdo e o swap do ícone. */
export const ConteudoOpcional: Story = {
  name: 'Conteúdo opcional',
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () =>
    amostra(`
      <div style="display:flex;flex-direction:column;gap:var(--gap-l);max-width:460px">
        <div>${legenda('Completo')}${renderAlert({ status: 'info' })}</div>
        <div>${legenda('Sem link')}${renderAlert({ status: 'success', showLink: false })}</div>
        <div>${legenda('Sem descrição')}${renderAlert({ status: 'warning', showBody: false })}</div>
        <div>${legenda('Só título')}${renderAlert({ status: 'error', showBody: false, showLink: false, showClose: false })}</div>
        <div>${legenda('Ícone trocado (swap)')}${renderAlert({ status: 'update', icone: 'sino', title: 'Nova versão disponível', body: 'Atualize para receber as últimas melhorias.', link: 'Atualizar' })}</div>
      </div>`),
};

/**
 * Catálogo (página Docs): a regra de paridade demonstrada, não só escrita —
 * controle sem consumidor é anunciado DESATIVADO, nunca escondido nem focável
 * mentindo que funciona.
 */
export const SemConsumidor: Story = {
  name: 'Sem consumidor: desativado',
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () =>
    amostra(`
      <div style="display:flex;flex-direction:column;gap:var(--gap-l);max-width:460px">
        <div>
          ${legenda('X sem ninguém escutando (dismiss) — desativado, fora do Tab')}
          ${renderAlert(
            { status: 'info', title: 'Backup concluído', body: 'Nenhuma ação necessária.', showLink: false },
            { xSemConsumidor: true },
          )}
        </div>
        <div>
          ${legenda('Link sem destino e sem (linkClick) — desativado, fora do Tab')}
          ${renderAlert(
            { status: 'warning', title: 'Cobrança em processamento', body: 'O link ativa quando o boleto ficar pronto.', link: 'Ver boleto', showClose: false },
            { linkSemConsumidor: true },
          )}
        </div>
      </div>`),
};

/**
 * Catálogo (página Docs, aba **Flutter**): o mesmo Alert dentro de uma moldura
 * de celular, para conferir proporção e hierarquia em tela estreita.
 *
 * HONESTIDADE: é HTML com os MESMOS tokens do Flutter, não o widget Flutter
 * rodando — o Storybook roda no navegador. A própria moldura diz isso na tela
 * (`molduraCelular()` carrega o selo e a nota).
 *
 * Como as outras stories de catálogo, sem `role="alert"`: vitrine estática com
 * vários exemplos não deve virar live region.
 */
export const PreviaApp: Story = {
  name: 'Como fica no app',
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () =>
    amostra(
      molduraCelular(`
        <div style="display:flex;flex-direction:column;gap:var(--gap-m)">
          ${renderAlert({
            status: 'info',
            size: 'large',
            title: 'Documento pronto',
            body: 'O contrato social já está disponível para download.',
            link: 'Ver documento',
          })}
          ${renderAlert({
            status: 'info',
            size: 'small',
            title: 'Documento pronto',
            link: 'Ver',
          })}
        </div>`),
    ),
};
