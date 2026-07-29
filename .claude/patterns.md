# Padrões estabelecidos

Formato: `decisão técnica — desde quando vale`

- Tokens em formato DTCG, transformados por Style Dictionary v4 — 2026-07-15
- Nomes de token **espelham fielmente o Figma** (em inglês: `color/`, `content/`, `surface/`, `feedback/`…). O nome do arquivo-fonte é PT (`primitivos`/`semanticos`), mas os caminhos dos tokens seguem o Figma — 2026-07-21 _(corrige a nota anterior que dizia "nomes em português")_
- Separação primitivas × semânticas: `primitivos.json` = escalas cruas de cor; `semanticos.json` = tokens de uso que **referenciam** as primitivas e têm `$description` — 2026-07-21
- Light/dark: as primitivas já trazem `light` e `dark` no caminho (`color.neutral.light.*` / `.dark.*`); as semânticas têm arquivo `semanticos.json` (light, padrão) + `semanticos.dark.json` (override). O build gera `:root` (light) e `[data-theme="dark"]` no CSS — 2026-07-21
- `outputReferences` ligado no build web: no `tokens.css`, as semânticas saem como `var(--primitiva)` (preserva o encadeamento semântica→primitiva) — 2026-07-21
- Extração do Figma: plugin figma-console (Desktop Bridge) → `figma_export_tokens` (DTCG) → script Node de transformação p/ a estrutura limpa. Evita transcrição manual — 2026-07-21
- Build de tokens roda via `node build-tokens.mjs` (duas instâncias do Style Dictionary: light + dark) — 2026-07-21
- `tokens/build/` é versionado no Git (consumo via Git dependency na Fase 1) — 2026-07-15
- Monorepo com pnpm; usar `corepack pnpm` quando pnpm não estiver no PATH — 2026-07-15

## Componentes (a partir da Fase 2)

- **CSS canônico do componente, compartilhado entre vitrine e Angular**: existe UM arquivo de aparência por componente (`components/angular/<comp>/<comp>.css`), escrito só com tokens. O componente Angular o usa com `ViewEncapsulation.None` (classes globais `.rds-*`) e a story do Storybook importa o MESMO arquivo. Duas telas, uma fonte visual — a vitrine não pode divergir do produto — 2026-07-26
- **Ícones como SVG inline com `fill="currentColor"`**: os SVGs exportados do Figma têm a cor trocada por `currentColor`, então herdam o token de cor aplicado por CSS (web) ou pelo widget (Flutter). Nada de cor hardcoded dentro do desenho; trocar o token troca o ícone — 2026-07-26
- **Swap de ícone exposto na API pública**: todo componente com ícone aceita substituí-lo (equivalente ao *instance swap* do Figma). Angular: `[icon]` recebe markup SVG; Flutter: `icon` recebe um `Widget?`. Contrato do SVG trocado: `viewBox="0 0 20 20"` + `currentColor`. No Angular o markup passa por `bypassSecurityTrustHtml` — só SVG confiável, nunca conteúdo de usuário — 2026-07-26
- **Cada plataforma é um pacote instalável, não arquivo pra copiar**: `components/angular/` é a biblioteca **`@rapidocs/ds-angular`** (`package.json` + `public-api.ts` como única porta de entrada); `components/flutter/` é o pacote Dart **`rapidocs_ds`** (`pubspec.yaml` + `lib/` + `lib/rapidocs_ds.dart` como barrel). O dev instala por uma linha e importa pelo nome; caminhos internos podem mudar entre versões — 2026-07-26
- **Tokens Dart nascem DENTRO do pacote Flutter** (`components/flutter/lib/src/tokens/`): um arquivo em `lib/` de um pacote Dart não importa por caminho relativo nada de fora do pacote, então código gerado mora no pacote que o consome. A saída antiga `tokens/build/dart/` foi removida (e o build apaga se reaparecer) — 2026-07-26
- **Descrição de token em Dart sai como doc comment de linha (`///`)**: em Dart comentário de bloco **aninha**, então uma descrição com `/*` dentro nunca fechava e engolia o resto do arquivo. Formato próprio `flutter/class-rapidocs.dart` no lugar do `flutter/class.dart` pronto + **trava no build** que varre a saída como o lexer do Dart faria e FALHA se a profundidade de comentário não fechar ou as chaves não baterem — 2026-07-26
- **Dimensões Dart sem o fator 16x**: o `transformGroup: 'flutter'` do Style Dictionary aplica `size/flutter/remToDouble` (assume rem) e multiplicava tudo por 16. A plataforma `dart` usa lista explícita de transforms (`attribute/cti`, `name/camel`, `color/hex8flutter`, `size/rapidocs/dart-double`, `string/rapidocs/dart`) — px do Figma viram double na mesma escala — 2026-07-26
- **Vitrine: um item por componente, com chave de plataforma Web/App** — não se duplica o componente por linguagem na barra lateral. A story tem a chave global `plataforma` (Web (Angular) / App (Flutter)) que troca a moldura e o snippet de código. A prévia "App" é simulação em HTML com os tokens do Flutter e diz isso na tela — 2026-07-26
- **Página de componente na vitrine segue o molde do Alert** (descrito em `apps/storybook/stories/components/README.md`): na sidebar só **Docs** (MDX anexado via `<Meta of>`, primeira) e **Playground**; catálogo em stories `tags: ['!dev']` consumidas pelos `<Canvas>` do MDX; página com hero → playground+controles → variações → receita numerada Angular (lida dos arquivos reais do pacote) → tabela da API real → Flutter compacto → acessibilidade → tokens usados → rodapé; painel de código mostra EXATAMENTE o que está na tela (snippet gerado dos args reais) — 2026-07-26

## Paridade entre plataformas (regras para TODO componente novo)

Decididas no Alert (2026-07-26) e válidas de agora em diante: **mesmo comportamento
nas duas plataformas e na vitrine.** Quando web e app puderem divergir, a regra
vale para as duas — o dev da app não deveria descobrir um comportamento diferente
do da web.

- **Anel de foco do DS = `content/primary`, nas duas plataformas.** O token
  `action/focusRing/neutral` **foi descartado** para foco sobre superfícies de status: ele é
  `rgba(8, 9, 10, 0.24)` (preto a 24%) e, composto sobre as surfaces dos alertas, rende
  **de 1,73:1 a 2,16:1** (5 status × 2 temas) — abaixo dos 3:1 que a WCAG 2.4.11 pede. `content/primary` mede **16,90:1 a
  18,44:1** no tema claro e **8,86:1 a 13,84:1** no escuro (medido nos 5 status × 2 temas).
  Web: `outline: 2px solid var(--content-primary)` no `:focus-visible`. Flutter: anel
  desenhado com `cores.contentPrimary`, **fora** da caixa (como o `outline-offset: 2px`),
  para mostrar o foco não empurrar o layout — 2026-07-26
- **Nada de elemento vazio no layout: parte opcional só existe se tiver conteúdo.** Não
  basta o toggle do Figma estar ligado — o texto tem que existir. Link: `showLink && linkText`
  não vazio. Corpo: `showBody && body` não vazio. Motivo duplo: um `<a>` sem texto entra na
  ordem de Tab **sem nome acessível** (WCAG 2.4.4 e 4.1.2) e um bloco vazio ainda soma o gap
  do layout. Web: `mostrarLink` no `AlertComponent`. Flutter: `_mostrarLink` no `RdsAlert`.
  Vale também para a **vitrine** — 2026-07-26
- **Controle sem consumidor é anunciado DESATIVADO, não escondido.** Se o toggle do Figma
  manda mostrar o botão mas ninguém escuta o evento, o desenho continua (o espaço é do
  layout) e o controle vira desativado — em vez de um botão focável que mente para o leitor
  de tela. Angular: `EventEmitter.observed` (Angular 16+) alimentando `[disabled]`. Flutter:
  `Semantics(button: true, enabled: false)`, sem `InkWell`, sem absorver o toque — 2026-07-26
- **Link sem consumidor segue a mesma regra: anunciado desativado e fora da ordem de Tab.**
  Quando o link não tem ação possível (destino ainda no `'#'` padrão do Figma E ninguém
  escutando o clique), o texto continua no layout mas deixa de convidar: web — o `<a>` perde
  o `href` (sai do Tab) e ganha `role="link"` + `aria-disabled="true"` (sem o `role`, um `<a>`
  sem `href` perde o papel de link e o `aria-disabled` cairia no vazio) — ver `linkAtivo` no
  `AlertComponent`; Flutter — `Semantics(link: true, enabled: false)`, sem gesto. Sem
  sublinhado e com cursor comum — 2026-07-26
- **Ação sem destino não navega.** Quando o link do Figma não tem destino (o padrão `'#'`),
  o clique é só gatilho de ação: a web chama `preventDefault()` nesse caso — com `href` de
  verdade a navegação segue normal — e o Flutter só dispara o callback. Assim as duas
  plataformas fazem a mesma coisa e a URL não fica suja de `#` — 2026-07-26
- **Estado de interação sempre em token, nunca `opacity` solto.** Hover/foco/toque usam
  `action/hover/onColorSecondary` (e `action/hover/onColor` no splash) nas duas plataformas.
  `opacity: 0.64` foi removido do X da web: além de ser valor solto, apagava o ícone em vez
  de realçar o botão. Link sublinha no hover **e no foco** nas duas plataformas — 2026-07-26
- **Alvo de toque cresce sem mexer no layout.** O DESENHO fica no tamanho do Figma (20/16 px)
  e só a área clicável cresce, por fora do fluxo: web com `::before` absoluto
  (`inset: calc(-1 * var(--padding-s))`), Flutter com a caixa maior + `Padding` que recoloca o
  ícone no lugar. Nenhum gap muda. Teto atual: 44/40 px — desvio consciente dos 48 do Material,
  registrado em `.claude/debt.md` — 2026-07-26
- **Componente do DS não exige ancestral `Material`, `Overlay` ou `Scaffold` no Flutter.**
  Quem consome pode não estar dentro de um `MaterialApp` completo. Por isso o `Tooltip` do X
  foi **removido** (ele forçaria um `Overlay` na árvore) — o `Semantics(label: 'Fechar')` já
  entrega o rótulo ao leitor de tela. O `Material(type: MaterialType.transparency)` que o
  `InkWell` precisa é criado pelo próprio componente. O que ainda é exigido é só um
  `Directionality` na árvore (qualquer `WidgetsApp` tem), para o posicionamento direcional.
  Equivalente na web: o Alert não tem tooltip nenhum — o atributo `title` do host é anulado de
  propósito (`host: { '[attr.title]': 'null' }`), senão o navegador mostraria o texto do alerta
  como tooltip amarelo — 2026-07-26
- **Trava de sintaxe no build dos tokens Dart** (`travaDart()` em `tokens/trava-dart.mjs` —
  arquivo separado do build de propósito, para poder ser testada contra `.dart` com defeito
  de mentira sem rodar o build inteiro): sem SDK instalado, erro de Dart passa silencioso —
  nenhuma ferramenta reclama e o arquivo quebrado é commitado. Então o build varre a saída
  como o lexer do Dart faria e **FALHA** em seis casos: comentário de bloco que não fecha
  (em Dart comentário de bloco **aninha**), chaves desbalanceadas, nome de declaração
  repetido na mesma classe, nome que não é identificador Dart válido, nome que é palavra
  reservada do Dart (incluindo `await`/`yield`, proibidas em código assíncrono) e valor fora
  dos formatos que a geração emite (`Color(0xAARRGGBB)`, número ou texto entre aspas
  simples) — sempre ignorando o que está dentro de string e de comentário. Ele também
  imprime a contagem de `static const`, que é a forma de perceber declaração engolida.
  O que a trava **não** é: um `dart analyze` de verdade (tipos, imports, uso) — rodar a
  análise real no primeiro ambiente com SDK continua em `.claude/debt.md` — 2026-07-26

- **Página de componente na vitrine = *one page* com quatro abas internas.** Cada componente
  aparece na barra lateral com **duas** entradas apenas — `Docs` (o `.mdx`) e `Playground` —
  e a página tem sempre as mesmas abas, nesta ordem: **Visão geral** (playground + variações
  + tokens usados), **Regras de uso** (quando usar, cartões Faça/Evite, como escolher entre
  as variações, orientação de texto), **Código** (seletor Angular/Flutter + importar, usar,
  tratar eventos + tabela da API real) e **Acessibilidade** (o que vem resolvido × o que
  depende de quem usa). As variações NÃO são itens de menu: são stories com `tags: ['!dev']`
  usadas nos `<Canvas>` da página. Motivo: seis entradas por componente viravam lista
  repetida e código espalhado — o dono da vitrine reprovou esse formato. Referência de
  estrutura: Material, Carbon e o DS do Itaú. O molde é `Alert.mdx`; o passo a passo de como
  copiar está em `apps/storybook/stories/components/README.md` — 2026-07-26
- **Instalação do DS não mora na página de componente.** Instalar pacote, ligar tokens e
  carregar a fonte é assunto do design system inteiro e se faz uma vez por projeto: vive em
  **Fundação → Instalação** (`apps/storybook/stories/Instalacao.mdx`), e a aba Código de cada
  componente só aponta para lá — 2026-07-26
- **A escolha de linguagem é DENTRO da página, não na barra do Storybook.** A antiga chave
  global `plataforma` (Web/App) foi removida: ela trocava a moldura da prévia mas o texto da
  documentação continuava falando de Angular, e as duas coisas discordavam na tela. Agora o
  seletor Angular/Flutter fica na aba Código, ao lado do código que ele controla. A barra de
  ferramentas ficou só com o **Tema** — 2026-07-26
- **Abas e seletores da vitrine em CSS puro** (`<input type="radio">` escondido + `<label>` +
  seletor `:checked ~`), estilo compartilhado em `apps/storybook/stories/vitrine/abas.ts`.
  Motivo: `@storybook/html-vite` não tem React como dependência direta, então não existe
  estado de componente para usar; o rádio resolve no navegador, sobrevive ao build estático
  do GitHub Pages e é operável por teclado (as setas trocam de aba nativamente). Limite
  conhecido: a aba ativa não é preservada ao recarregar nem pode ser linkada por URL.
  Os `id` são fixos (`aba-visao`/`aba-regras`/`aba-codigo`/`aba-a11y`, `lang-angular`/
  `lang-flutter`) porque o CSS referencia cada um; o `name` muda por componente — 2026-07-26
