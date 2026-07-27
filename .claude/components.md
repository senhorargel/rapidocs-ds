# Componentes do projeto

Formato: `caminho — o que faz — origem (DS/Storybook/hardcoded)`

## Alert / Notification

Fonte única no Figma: **"Rapidocs System [Piloto]" → component set `alert-notification 1.0`**
(node `17:279`). Variações: propriedade `Status` (info · warning · success · error ·
update) × `Size` (large · small). Regra de ouro respeitada: **um Figma, dois códigos,
os mesmos tokens.**

- `components/angular/` — biblioteca **`@rapidocs/ds-angular`**; componente
  `<rds-alert>` (standalone, `ViewEncapsulation.None`). Porta de entrada:
  `public-api.ts` (`AlertComponent`, `AlertStatus`, `AlertSize`, `ALERT_ICONS`,
  `ALERT_CLOSE_ICON`). API pública: `status` · `size` · `title` · `body` ·
  `linkText` · `linkHref` · `showBody` · `showLink` · `dismissible` · `icon`
  (string SVG, swap do ícone) · `@Output dismiss` · `@Output linkClick`.
  Aparência em `alert/alert.css` (o mesmo arquivo que a vitrine importa) —
  origem: DS (Figma `alert-notification 1.0`)
- `components/flutter/` — pacote Dart/Flutter **`rapidocs_ds`**; widget
  `RdsAlert` (sem estado). Porta de entrada: `lib/rapidocs_ds.dart`
  (`RdsAlert`, `RdsAlertStatus`, `RdsAlertSize`, `RapidocsTokens`,
  `RapidocsTokensDark`, `RapidocsCores`). API pública: `title` (obrigatório) ·
  `body` · `linkText` · `status` · `size` · `showBody` · `showLink` ·
  `dismissible` · `icon` (`Widget?`, swap do ícone) · `onLinkTap` · `onDismiss`.
  Código em `lib/src/alert/rds_alert.dart`; tokens gerados em
  `lib/src/tokens/`; resolução claro/escuro em `lib/src/theme/rapidocs_cores.dart`;
  ícones empacotados em `components/flutter/assets/icons/alert/` (declarados no
  `pubspec.yaml`); 11 testes de widget em `test/rds_alert_test.dart` (escritos, ainda
  não executados — sem SDK na máquina) — origem: DS (Figma `alert-notification 1.0`)

**Comportamento idêntico nas duas plataformas** (decidido em 2026-07-26; a regra
geral está em `.claude/patterns.md`):

| Comportamento | Angular | Flutter |
|---|---|---|
| Anel de foco | `--content-primary` no `:focus-visible` | `cores.contentPrimary`, anel fora da caixa |
| Link só com texto | `mostrarLink` (`showLink && linkText`) | `_mostrarLink` (idem) |
| Corpo só com texto | `size === 'large' && showBody && !!body` | `showBody && body != null && body.isNotEmpty` |
| X sem quem escute | `[disabled]="!fecharHabilitado"` (`dismiss.observed`) | `Semantics(button: true, enabled: false)` |
| Hover do X | `var(--action-hover-on-color-secondary)` (acende a partir do alvo de 44/40, pinta a caixa do ícone) | fundo pintado à mão com `cores.actionHoverOnColorSecondary` (`MouseRegion` no alvo de 44/40 → realce na caixa do ícone) |
| Alvo de toque do X | `::before` com `inset: calc(-1 * var(--padding-s))` → 44/40px | caixa `ícone + paddingS * 2` → 44/40px |
| Link com destino padrão (`'#'`) | `preventDefault()`, não navega | `onLinkTap` só dispara callback |
| Tooltip | nenhum (`host: { '[attr.title]': 'null' }`) | nenhum (evita exigir `Overlay`) |
- `apps/storybook/stories/components/Alert.stories.ts` — story da vitrine: **um
  item** para o componente com chave de plataforma **Web (Angular) / App
  (Flutter)** na barra de ferramentas, controles ligados às propriedades do Figma
  e painel "Código para copiar" por plataforma. Importa o CSS canônico de
  `components/angular/alert/alert.css` — origem: Storybook (mesma fonte visual do
  Angular). O `renderAlert()` da vitrine segue as regras de paridade de conteúdo
  (corpo/link só se o texto existir, como no Angular e no Flutter) e o X dos exemplos
  tem consumidor de verdade (`ligarFechar()` remove o alerta e oferece "Restaurar
  exemplo"). ⚠️ A prévia "App (Flutter)" é simulação em HTML com os tokens do Flutter,
  não o widget rodando — registrado em `.claude/debt.md`

Ícones oficiais (SVG exportados do Figma, `viewBox="0 0 20 20"`,
`fill="currentColor"`): `assets/icons/alert/{info,warning,success,error,update,close}.svg`
na raiz, com cópia sincronizada em `components/flutter/assets/icons/alert/`.
