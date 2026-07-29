# rapidocs_ds — Design System do Rapidocs para Flutter

Pacote Dart/Flutter com os **componentes mobile** do Rapidocs DS e a **fundação
de tokens** gerada a partir do Figma.

Regra de ouro do DS: **token é compartilhado, componente não.** Os tokens daqui
são os mesmos que a web consome (saem do mesmo Figma, pelo mesmo Style
Dictionary); o código do componente é próprio do Flutter e tem um par em
[`components/angular/`](../angular/).

| Componente | Arquivo | Par no Angular |
|------------|---------|----------------|
| `RdsAlert` — Alert / Notification | [`lib/src/alert/rds_alert.dart`](./lib/src/alert/rds_alert.dart) | [`../angular/alert/`](../angular/alert/) |

---

## Como instalar

No `pubspec.yaml` da **sua app**, dentro de `dependencies:`:

```yaml
dependencies:
  rapidocs_ds:
    git:
      url: https://github.com/senhorargel/rapidocs-ds.git
      ref: main                 # ou uma tag de versão, ex. v0.1.0
      path: components/flutter
```

Depois `flutter pub get`. Nada de copiar arquivo na mão: um import e você tem
tudo.

```dart
import 'package:rapidocs_ds/rapidocs_ds.dart';
```

Esse import único traz:

- `RapidocsTokens` — cores do modo claro **e** todas as medidas (padding, gap,
  raio, tamanho de ícone, família tipográfica);
- `RapidocsTokensDark` — as cores do modo escuro;
- `RapidocsCores` — a camada que decide, pelo tema, qual das duas usar;
- `RdsAlert` + `RdsAlertStatus` + `RdsAlertSize`.

---

## Registrando a fonte Archivo (obrigatório)

O token `familiaArchivo` só desenha a tipografia certa se a fonte estiver
registrada **na app**. No `pubspec.yaml` da app:

```yaml
flutter:
  fonts:
    - family: Archivo
      fonts:
        - asset: assets/fonts/Archivo-Regular.ttf
          weight: 400
        - asset: assets/fonts/Archivo-SemiBold.ttf
          weight: 600
        - asset: assets/fonts/Archivo-Bold.ttf
          weight: 700
```

Sem isso o Flutter cai no fallback do sistema e a tipografia foge do Figma.
(Os ícones do DS já vêm dentro do pacote — esses você não precisa registrar.)

---

## RdsAlert

Uma faixa horizontal com **ícone · conteúdo · botão de fechar**, fundo tingido
conforme o status. Fiel ao component set `alert-notification 1.0` do Figma.

- **`large`** — ícone de 20 px, conteúdo em coluna (título, descrição, link).
- **`small`** — ícone de 16 px, conteúdo em uma linha (título ocupa o espaço
  livre e empurra o link para a direita).
- Nos dois tamanhos o ícone e o X ficam alinhados ao **topo** (é assim nas 10
  variantes do Figma).

Cinco status: `info`, `warning`, `success`, `error` e `update`.

### API

```dart
RdsAlert({
  Key? key,
  required String title,
  String? body,
  String linkText = 'Link',
  RdsAlertStatus status = RdsAlertStatus.info,
  RdsAlertSize size = RdsAlertSize.large,
  bool showBody = true,
  bool showLink = true,
  bool dismissible = true,
  Widget? icon,
  VoidCallback? onLinkTap,
  VoidCallback? onDismiss,
})
```

| Parâmetro | Tipo | Padrão | O que faz |
|-----------|------|--------|-----------|
| `title` | `String` | — (obrigatório) | Título no `large`; o texto único da linha no `small`. |
| `body` | `String?` | `null` | Descrição. Só aparece no `large` — e só se não estiver vazia. |
| `linkText` | `String` | `'Link'` | Texto do link de ação. |
| `status` | `RdsAlertStatus` | `.info` | Define fundo e cor do ícone. |
| `size` | `RdsAlertSize` | `.large` | `large` ou `small`. |
| `showBody` | `bool` | `true` | Toggle `Show Body?` do Figma. Ignorado no `small`. |
| `showLink` | `bool` | `true` | Toggle `Show Link?` do Figma. |
| `dismissible` | `bool` | `true` | Toggle `Show Close BTN` do Figma. |
| `icon` | `Widget?` | `null` | **Swap do ícone.** Substitui o ícone padrão do status. |
| `onLinkTap` | `VoidCallback?` | `null` | Toque (ou Enter/Espaço) no link. |
| `onDismiss` | `VoidCallback?` | `null` | Toque (ou Enter/Espaço) no X. |

```dart
enum RdsAlertStatus { info, warning, success, error, update }
enum RdsAlertSize { large, small }
```

O widget é **sem estado**: ele não se esconde sozinho. Quem controla se o alerta
segue na tela é a sua tela, reagindo ao `onDismiss`.

### Exemplos

Large completo:

```dart
RdsAlert(
  status: RdsAlertStatus.success,
  title: 'Documento enviado',
  body: 'Vamos te avisar quando a análise terminar.',
  linkText: 'Acompanhar',
  onLinkTap: () => Navigator.pushNamed(context, '/status'),
  onDismiss: () => setState(() => _mostrarAlerta = false),
)
```

Small, uma linha:

```dart
RdsAlert(
  size: RdsAlertSize.small,
  status: RdsAlertStatus.warning,
  title: 'Seu certificado vence em 7 dias',
  linkText: 'Renovar',
  onLinkTap: _renovar,
)
```

Só o título, sem link e sem fechar:

```dart
RdsAlert(
  status: RdsAlertStatus.error,
  title: 'Não foi possível salvar',
  showBody: false,
  showLink: false,
  dismissible: false,
)
```

Swap do ícone (o ícone informado recebe a caixa de 20/16 px e a cor do status via
`IconTheme`, então um `Icon()` sem parâmetros já sai no tamanho e na cor certos):

```dart
RdsAlert(
  status: RdsAlertStatus.update,
  title: 'Nova versão disponível',
  body: 'Atualize para receber as últimas melhorias.',
  icon: const Icon(Icons.system_update),
)
```

Fazendo o alerta desaparecer:

```dart
class _MinhaTelaState extends State<MinhaTela> {
  bool _visivel = true;

  @override
  Widget build(BuildContext context) {
    if (!_visivel) return const SizedBox.shrink();

    return RdsAlert(
      title: 'Confira seus dados cadastrais',
      body: 'Alguns campos ainda estão em branco.',
      onDismiss: () => setState(() => _visivel = false),
    );
  }
}
```

### Onde ele precisa estar

- Dentro de um `MaterialApp` (ou outro `WidgetsApp`): o componente consulta a
  direção de leitura (`Directionality`) para posicionar o X. **Não** precisa de
  `Scaffold`, nem de `Overlay` — o botão de fechar não tem `Tooltip` de propósito
  (o rótulo do leitor de tela vem do `Semantics`), e o `Material` transparente que
  o `InkWell` exige é criado pelo próprio componente.
- Em um espaço de **largura limitada** (uma `Column`, um `ListView` vertical...).
  O alerta preenche a largura disponível; dentro de um `Row` sem restrição ou de
  um `ListView` horizontal, dê uma largura antes.

---

## Claro e escuro

Nenhum componente lê cor direto das classes de token. Tudo passa por
`RapidocsCores`, a **camada única** de resolução de modo:

```dart
final cores = RapidocsCores.de(context);          // segue Theme.of(context)
Text('oi', style: TextStyle(color: cores.contentPrimary));

RapidocsCores.doBrilho(Brightness.dark);          // explícito (teste, preview)
```

Ou seja: se a sua app troca para `ThemeData.dark()`, o alerta acompanha sozinho.
Só **cor** tem modo — medida (padding, gap, raio, tamanho de ícone) é igual nos
dois e vem direto de `RapidocsTokens`.

No Figma existe a variante `Style = Light/Dark`. Ela **não** virou parâmetro do
widget de propósito: o modo vem dos tokens, não da API do componente.

---

## Acessibilidade

- O alerta inteiro é `Semantics(container: true, liveRegion: true)` — o leitor de
  tela anuncia o conteúdo assim que ele aparece (equivalente ao `role="alert"`
  da web).
- Link e botão de fechar entram na **ordem de Tab**, acionam com **Enter e
  Espaço** e mostram **anel de foco** de 2 px, afastado 2 px, na cor
  `content/primary` — igual ao `:focus-visible` da versão web. Não é o token
  `action/focusRing/neutral` do Figma: ele reprova no contraste (ver dívidas).
- O link **sublinha no hover e no foco**, como o CSS da web (`:hover` e
  `:focus-visible`). Em repouso ele se distingue pelo peso da fonte, fiel ao
  Figma. O link **não ganha fundo** em nenhum estado — na web o hover do link
  só sublinha; quem pinta fundo no hover é só o X.
- Área de toque do X: **44 px** no `large` e **40 px** no `small`, embora o
  desenho continue 20/16 px (ver dívidas). O alvo grande é **invisível**:
  captura o toque até a borda do container e **acende o hover com o ponteiro
  em qualquer lugar dele** — mas o fundo do hover e o anel de foco desenham
  sempre em volta da **caixa do ícone** (20/16 px + folga de 2 px), como na
  web, onde o `::before` que amplia o alvo faz parte do botão.
- Sem callback, nada finge ser clicável: `dismissible: true` com `onDismiss: null`
  mostra o X, mas anunciado como **botão desativado** e sem roubar o toque de
  quem está atrás. O link segue a mesma regra: sem `onLinkTap` ele continua
  visível, mas é anunciado como **link desativado** e sai da ordem de Tab —
  espelho do que a web faz quando o link não tem destino nem ninguém escutando
  o clique (sem `href` + `aria-disabled="true"`).

---

## Estrutura do pacote

```
components/flutter/
├── pubspec.yaml                    name: rapidocs_ds
├── analysis_options.yaml           regras do `flutter analyze` (flutter_lints)
├── README.md
├── assets/
│   └── icons/alert/                ícones oficiais (cópia sincronizada — ver dívidas)
│       ├── info.svg  warning.svg  success.svg
│       └── error.svg  update.svg  close.svg
├── lib/
│   ├── rapidocs_ds.dart            barrel: o único import que a app precisa
│   └── src/
│       ├── alert/rds_alert.dart    RdsAlert
│       ├── theme/rapidocs_cores.dart  RapidocsCores (claro/escuro)
│       └── tokens/                 GERADO pelo Style Dictionary
│           ├── tokens.dart         RapidocsTokens
│           └── tokens.dark.dart    RapidocsTokensDark
└── test/
    └── rds_alert_test.dart         teste de widget (AINDA NÃO EXECUTADO — ver dívidas)
```

`lib/src/tokens/` é **saída de build versionada** — é o que permite consumir o
pacote direto do Git. Para regerar, na raiz do repositório:
`corepack pnpm build:tokens`. Não edite esses dois arquivos na mão.

---

## Verificando o pacote (para quem tem o SDK)

Dentro de `components/flutter/`:

```bash
flutter pub get
flutter analyze      # usa analysis_options.yaml (flutter_lints)
flutter test         # roda test/rds_alert_test.dart
```

O teste de widget cobre o que a paridade com a web exige: construir nos 5 status
× 2 tamanhos, fundo vindo do token no claro e no escuro, descrição/link vazios
que não aparecem, X inerte sem `onDismiss`, ausência de `Tooltip`, o anel de foco
em `content/primary`, o link desativado sem `onLinkTap`, o sublinhado do link no
hover e no foco, o link sem fundo em nenhum estado, o alvo de toque invisível do
X, o hover do X que acende no alvo inteiro mas pinta só a caixa do ícone, e o
anel desenhado em volta do ícone (não do alvo).

> **Nada disso foi executado ainda.** Veja a última dívida abaixo.

---

## Dívidas conhecidas

- **Os SVGs são uma cópia.** `assets/icons/alert/` é uma **cópia sincronizada à
  mão** de `assets/icons/alert/` na raiz do repositório. Um pacote Dart só
  consegue empacotar assets que estão dentro dele, por isso a duplicata.
  Se alguém trocar um ícone na raiz e esquecer daqui, mobile e web ficam
  diferentes. **Automatizar essa sincronização (script no `build:tokens` ou passo
  de CI) é dívida técnica aberta.**
- **Alvo de toque do X abaixo dos 48 px.** O Material recomenda 48×48. Aqui o
  alvo é o maior possível sem mexer no layout do Figma: o ícone (20/16) mais os
  12 px de padding de cada lado, ou seja **44×44** no `large` e **40×40** no
  `small`. Ir aos 48 exigiria aumentar o padding do container (decisão de design)
  — no Flutter o toque não é aceito fora da caixa do widget.
- **Text styles ainda não são tokens.** Tamanho (14/12), peso (400/600/700) e
  altura de linha (1.45) estão como literais no componente, porque os text styles
  do Figma não são exportados como tokens Dart. Os pesos batem com
  `RapidocsTokens.pesoRegular`, `pesoSemibold` e `pesoBold`.
- **Raio do container.** No Figma o `large` usa `radii/surface` e o `small` usa
  `component/s`. Só `component/s` chega na saída Dart, então é ele que está no
  código nos dois tamanhos. **Não são o mesmo token:** coincidem no modo Default
  (12) e no Sharp (2), mas divergem no Rounded (`component/s` = 16 contra
  `radii/surface` = 32). Quando `radii/surface` for exportado, trocar no `large`.
  (Mesma ressalva está no CSS da versão Angular.)
- **Anel de foco não usa o token de foco do Figma.** O token `action/focusRing/neutral`
  é preto/branco a 24% de opacidade: composto sobre os 5 fundos de status, claro e
  escuro, ele fica entre **1,73:1 e 2,16:1** de contraste (o 1,73:1 é o mesmo número
  do alert.css da web), abaixo dos **3:1** que a WCAG 1.4.11 e
  2.4.11 pedem para o indicador de foco — o anel praticamente desaparece. Por isso
  as duas plataformas usam `content/primary` (8,9:1 a 18,4:1). É desvio consciente
  em relação à fonte: o certo seria o Figma ganhar um token de foco opaco, e então
  os dois lados voltariam a ler o token.
- **Ícone do status `update`.** É o ícone "placeholder" do próprio Figma: a fonte
  ainda não definiu um desenho definitivo para esse status.
- **`RapidocsCores` é escrito à mão.** São 62 cores semânticas resolvidas uma por
  uma. Se o Figma ganhar uma cor semântica nova, alguém precisa adicionar o
  getter. Gerar esse arquivo junto com os tokens (Style Dictionary) resolveria.
- **Nada foi compilado.** Flutter/Dart não estão instalados na máquina onde o DS
  é mantido: este código foi revisado à mão e por verificadores de sintaxe
  próprios, mas **ainda não passou por `flutter pub get`, `flutter analyze`,
  `flutter test` nem build**. Isso vale também para `test/rds_alert_test.dart`:
  ele foi escrito para rodar, mas **nunca rodou** — na primeira execução pode
  precisar de ajuste fino. Rodar os três comandos da seção "Verificando o pacote"
  no primeiro ambiente com SDK é pré-requisito para fechar a Fase 2.
