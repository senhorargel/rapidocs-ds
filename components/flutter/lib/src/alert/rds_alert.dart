// Rapidocs DS — Alert / Notification (Flutter)
//
// Fiel ao component set `alert-notification 1.0` do Figma
// ("Rapidocs System [Piloto]"). Toda medida, cor e tipografia sai dos tokens
// gerados — sem valor solto.
//
// Mapa de tokens usados aqui:
//   fundo por status ....... feedback/{info,warning,success,error}/surface
//                            e surface/secondary (status `update`)
//   cor do ícone ........... feedback/{info,warning,success,error}/fill
//                            e content/primary (status `update`)
//   padding do container ... padding/s   (12)
//   gap entre as partes .... gap/s       (12)
//   raio do container ...... component/s (12)
//   tamanho do ícone ....... component/20 (large) · component/16 (small)
//   gap interno do texto ... padding/3xs (2, large) · padding/xs (8, small)
//   cor de texto e do X .... content/primary
//   anel de foco ........... content/primary (NÃO action/focusRing/neutral — ver abaixo)
//   hover e toque do X ..... action/hover/onColorSecondary · action/hover/onColor
//                            (só o X pinta fundo; o link não — como na web)
//   família ................ familia/archivo
//
// Sobre o anel de foco: o token de foco neutro do Figma é
// `action/focusRing/neutral` (preto a 24% no claro, branco a 24% no escuro).
// Medido sobre os 5 fundos de status, claro e escuro, ele rende de 1,73:1 a
// 2,16:1 — abaixo dos 3:1 que a WCAG 1.4.11 e 2.4.11 pedem para o indicador de
// foco (o 1,73:1 é o mesmo número citado no alert.css da web). Por isso o anel
// usa `content/primary`, a mesma cor do texto (que já inverte no escuro): rende
// de 8,9:1 a 18,4:1. É exatamente a troca que a versão web já fez — ver a regra
// `:focus-visible` em components/angular/alert/alert.css. Desvio consciente em
// relação ao token da fonte, registrado no README.
//
// Sobre o raio: no Figma o Large usa `radii/surface` e o Small usa `component/s`.
// Só `component/s` existe na saída Dart, então usamos ele nos dois tamanhos.
// ATENÇÃO: não são o mesmo token. Eles coincidem no modo Default (12) e no Sharp
// (2), mas DIVERGEM no Rounded (`component/s` = 16 contra `radii/surface` = 32).
// Quando `radii/surface` chegar na saída Dart, trocar aqui.
//
// Claro e escuro: nenhuma cor é lida direto das classes de token. Tudo passa por
// `RapidocsCores.de(context)`, a camada única de resolução de modo do DS.
//
// Ambiente que o componente pede: estar dentro de um `MaterialApp` (ou qualquer
// `WidgetsApp`) — só para ter um `Directionality` na árvore, que o posicionamento
// direcional do X consulta. Não precisa de `Overlay` (não há `Tooltip`) nem de
// `Scaffold`: o próprio componente cria o `Material` transparente que o `InkWell`
// precisa.

import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../theme/rapidocs_cores.dart';
import '../tokens/tokens.dart';

/// Status do alerta — espelha a propriedade **`Status`** do component set
/// `alert-notification 1.0` do Figma.
///
/// Notas da fonte:
/// * no Figma a opção de update está grafada **"Uptade"** (typo do arquivo);
///   aqui ela se chama `update`, escrito certo;
/// * o Figma também tem a propriedade `Style` (Light/Dark). Ela **não** virou
///   parâmetro deste widget: claro e escuro saem dos tokens, via
///   [RapidocsCores].
enum RdsAlertStatus { info, warning, success, error, update }

/// Tamanho do alerta — espelha a propriedade `Size` do Figma.
///
/// `large` empilha título + descrição + link em coluna.
/// `small` resolve tudo em uma linha, com o link empurrado para a direita.
enum RdsAlertSize { large, small }

/// Rapidocs DS — Alert / Notification.
///
/// ```dart
/// RdsAlert(
///   status: RdsAlertStatus.success,
///   title: 'Tudo certo!',
///   body: 'Seu documento foi salvo.',
///   linkText: 'Ver',
///   onLinkTap: () => abrirDocumento(),
///   onDismiss: () => setState(() => _visivel = false),
/// )
/// ```
///
/// O widget é sem estado: quem decide se o alerta continua na tela é a app,
/// reagindo a [onDismiss].
class RdsAlert extends StatelessWidget {
  const RdsAlert({
    super.key,
    required this.title,
    this.body,
    this.linkText = 'Link',
    this.status = RdsAlertStatus.info,
    this.size = RdsAlertSize.large,
    this.showBody = true,
    this.showLink = true,
    this.dismissible = true,
    this.icon,
    this.onLinkTap,
    this.onDismiss,
  });

  /// Título (Large) ou o texto único da linha (Small).
  final String title;

  /// Descrição — só aparece no tamanho `large`.
  final String? body;

  /// Texto do link de ação.
  final String linkText;

  /// Status: info · warning · success · error · update.
  final RdsAlertStatus status;

  /// Tamanho: large (título + descrição + link) ou small (uma linha).
  final RdsAlertSize size;

  /// Mostrar a descrição (toggle `Show Body?` do Figma). Ignorado no `small`.
  final bool showBody;

  /// Mostrar o link (toggle `Show Link?` do Figma).
  final bool showLink;

  /// Mostrar o botão de fechar (toggle `Show Close BTN` do Figma).
  ///
  /// Sem [onDismiss] o X aparece (é o toggle do desenho), mas fica inerte e é
  /// anunciado como **botão desativado** — em vez de mentir para o leitor de
  /// tela e engolir o toque de quem está atrás.
  final bool dismissible;

  /// Troca (swap) do ícone: quando informado, substitui o ícone padrão do
  /// status. Recebe a caixa de 20/16 px e a cor do status via [IconTheme],
  /// então um `Icon(...)` sem parâmetros já herda tamanho e cor corretos.
  final Widget? icon;

  /// Disparado ao tocar (ou apertar Enter/Espaço) no link.
  ///
  /// Sem callback o link continua visível, mas é anunciado como **link
  /// desativado** e fica fora da ordem de Tab — mesma regra do X sem
  /// [onDismiss], e o mesmo que a versão web faz quando o link não tem destino
  /// nem ninguém escutando o clique (sem `href` + `aria-disabled="true"`).
  final VoidCallback? onLinkTap;

  /// Disparado ao tocar (ou apertar Enter/Espaço) no botão de fechar.
  final VoidCallback? onDismiss;

  /// Rótulo do botão de fechar para o leitor de tela.
  static const String _rotuloFechar = 'Fechar';

  /// Nome do pacote onde os SVGs estão empacotados.
  static const String _pacote = 'rapidocs_ds';

  bool get _isLarge => size == RdsAlertSize.large;

  /// Tamanho do ícone (do status e do fechar): component/20 ou component/16.
  double get _tamanhoIcone =>
      _isLarge ? RapidocsTokens.component20 : RapidocsTokens.component16;

  /// Cor de fundo do container, por status.
  Color _corDeFundo(RapidocsCores cores) {
    switch (status) {
      case RdsAlertStatus.info:
        return cores.feedbackInfoSurface;
      case RdsAlertStatus.warning:
        return cores.feedbackWarningSurface;
      case RdsAlertStatus.success:
        return cores.feedbackSuccessSurface;
      case RdsAlertStatus.error:
        return cores.feedbackErrorSurface;
      case RdsAlertStatus.update:
        return cores.surfaceSecondary;
    }
  }

  /// Cor do ícone, por status.
  Color _corDoIcone(RapidocsCores cores) {
    switch (status) {
      case RdsAlertStatus.info:
        return cores.feedbackInfoFill;
      case RdsAlertStatus.warning:
        return cores.feedbackWarningFill;
      case RdsAlertStatus.success:
        return cores.feedbackSuccessFill;
      case RdsAlertStatus.error:
        return cores.feedbackErrorFill;
      case RdsAlertStatus.update:
        return cores.contentPrimary;
    }
  }

  /// Arquivo SVG do ícone de cada status, em `assets/icons/alert/`.
  ///
  /// São os ícones oficiais exportados do Figma (viewBox 20x20,
  /// `fill="currentColor"`), os mesmos que a versão Angular usa — por isso o
  /// traço é idêntico nas duas plataformas. O status `update` usa o ícone
  /// "placeholder" do Figma, porque a fonte ainda não definiu um ícone próprio
  /// para ele.
  String get _arquivoDoIcone {
    switch (status) {
      case RdsAlertStatus.info:
        return 'info';
      case RdsAlertStatus.warning:
        return 'warning';
      case RdsAlertStatus.success:
        return 'success';
      case RdsAlertStatus.error:
        return 'error';
      case RdsAlertStatus.update:
        return 'update';
    }
  }

  // ---------------------------------------------------------------------------
  // Tipografia — text styles do Figma.
  //
  // Tamanho e peso estão como literais porque os text styles do Figma
  // (Label/14/Bold etc.) ainda não são exportados como tokens Dart; os tokens
  // `tamanho*` são de dimensão, não de tipografia. Os pesos batem com
  // RapidocsTokens.pesoRegular (400), pesoSemibold (600) e pesoBold (700).
  // A cor vem de fora, já resolvida para claro/escuro.
  // ---------------------------------------------------------------------------

  /// Título: Label/14/Bold no large · Label/12/Regular no small.
  TextStyle _estiloTitulo(Color cor) => TextStyle(
        fontFamily: RapidocsTokens.familiaArchivo,
        fontSize: _isLarge ? 14.0 : 12.0,
        fontWeight: _isLarge ? FontWeight.w700 : FontWeight.w400,
        height: 1.45,
        letterSpacing: 0.0,
        color: cor,
      );

  /// Descrição: Label/14/Regular (só existe no large).
  TextStyle _estiloCorpo(Color cor) => TextStyle(
        fontFamily: RapidocsTokens.familiaArchivo,
        fontSize: 14.0,
        fontWeight: FontWeight.w400,
        height: 1.45,
        letterSpacing: 0.0,
        color: cor,
      );

  /// Link: Label/14/SemiBold no large · Label/12/Bold no small.
  ///
  /// [sublinhado] liga o sublinhado do hover E do foco — paridade com o CSS da
  /// web, que sublinha em `:hover` e em `:focus-visible`
  /// (components/angular/alert/alert.css). Em repouso o link se distingue pelo
  /// peso da fonte, como no Figma.
  TextStyle _estiloLink(Color cor, {bool sublinhado = false}) => TextStyle(
        fontFamily: RapidocsTokens.familiaArchivo,
        fontSize: _isLarge ? 14.0 : 12.0,
        fontWeight: _isLarge ? FontWeight.w600 : FontWeight.w700,
        height: 1.45,
        letterSpacing: 0.0,
        color: cor,
        decoration:
            sublinhado ? TextDecoration.underline : TextDecoration.none,
        decorationColor: cor,
      );

  @override
  Widget build(BuildContext context) {
    final RapidocsCores cores = RapidocsCores.de(context);
    final Color corDoTexto = cores.contentPrimary;
    final double tamanhoIcone = _tamanhoIcone;

    // Partes do container: ícone · conteúdo · (espaço do X).
    final List<Widget> partes = <Widget>[
      _construirIcone(cores, tamanhoIcone),
      const SizedBox(width: RapidocsTokens.gapS),
      Expanded(
        child: _isLarge
            ? _construirConteudoLarge(corDoTexto)
            : _construirConteudoSmall(corDoTexto),
      ),
    ];

    if (dismissible) {
      partes.add(const SizedBox(width: RapidocsTokens.gapS));
      // Só o ESPAÇO do X entra no layout (20/16 px, como no Figma). O botão de
      // verdade é desenhado por cima, no Stack, com área de toque maior — assim
      // o alvo cresce sem mexer em gap nenhum.
      partes.add(SizedBox(width: tamanhoIcone, height: tamanhoIcone));
    }

    // `liveRegion` faz o leitor de tela anunciar o alerta assim que ele aparece
    // — equivalente ao role="alert" da versão web.
    return Semantics(
      container: true,
      liveRegion: true,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: _corDeFundo(cores),
          borderRadius: BorderRadius.circular(RapidocsTokens.componentS),
        ),
        child: Stack(
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.all(RapidocsTokens.paddingS),
              child: Row(
                // Topo nos DOIS tamanhos: no Figma as 10 variantes do component
                // set estão com alinhamento MIN (start).
                crossAxisAlignment: CrossAxisAlignment.start,
                children: partes,
              ),
            ),
            if (dismissible)
              // `directional` + `end` = canto oposto ao início da leitura, então
              // em árabe/hebraico o X acompanha o `Row`, que também é direcional.
              Positioned.directional(
                textDirection: Directionality.of(context),
                top: 0,
                end: 0,
                child: _construirBotaoFechar(cores, tamanhoIcone),
              ),
          ],
        ),
      ),
    );
  }

  /// Ícone SVG oficial do DS, tingido com a cor do status.
  Widget _svg(String nome, Color cor, double tamanho) {
    return SvgPicture.asset(
      'assets/icons/alert/$nome.svg',
      package: _pacote,
      width: tamanho,
      height: tamanho,
      colorFilter: ColorFilter.mode(cor, BlendMode.srcIn),
    );
  }

  Widget _construirIcone(RapidocsCores cores, double tamanho) {
    final Color cor = _corDoIcone(cores);

    // SWAP: o ícone informado pelo consumidor manda no desenho, mas continua
    // dentro da caixa de 20/16 px e herda a cor do status.
    final Widget? customizado = icon;
    if (customizado != null) {
      return SizedBox(
        width: tamanho,
        height: tamanho,
        child: IconTheme.merge(
          data: IconThemeData(size: tamanho, color: cor),
          child: Center(child: customizado),
        ),
      );
    }

    return SizedBox(
      width: tamanho,
      height: tamanho,
      child: _svg(_arquivoDoIcone, cor, tamanho),
    );
  }

  /// Large: coluna com título, descrição opcional e link opcional (gap 2 px).
  Widget _construirConteudoLarge(Color corDoTexto) {
    final List<Widget> filhos = <Widget>[
      Text(title, style: _estiloTitulo(corDoTexto)),
    ];

    // Descrição vazia não abre espaço (mesma regra da versão Angular).
    final String? corpo = body;
    if (showBody && corpo != null && corpo.isNotEmpty) {
      filhos.add(const SizedBox(height: RapidocsTokens.padding3xs));
      filhos.add(Text(corpo, style: _estiloCorpo(corDoTexto)));
    }

    if (_mostrarLink) {
      filhos.add(const SizedBox(height: RapidocsTokens.padding3xs));
      filhos.add(_construirLink(corDoTexto));
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: filhos,
    );
  }

  /// Small: uma linha — título ocupa o espaço livre e empurra o link
  /// para a direita (gap 8 px).
  Widget _construirConteudoSmall(Color corDoTexto) {
    final List<Widget> filhos = <Widget>[
      Expanded(child: Text(title, style: _estiloTitulo(corDoTexto))),
    ];

    if (_mostrarLink) {
      filhos.add(const SizedBox(width: RapidocsTokens.paddingXs));
      filhos.add(_construirLink(corDoTexto));
    }

    return Row(
      // Aqui é centro de propósito: o alinhamento MIN da auditoria é do
      // container; o frame interno do small centraliza título e link, igual ao
      // CSS da versão Angular (.rds-alert--small .rds-alert__content).
      crossAxisAlignment: CrossAxisAlignment.center,
      children: filhos,
    );
  }

  /// Link só existe se estiver ligado e tiver texto.
  bool get _mostrarLink => showLink && linkText.isNotEmpty;

  /// Link de ação — focável por teclado, com anel de foco visível e sublinhado
  /// no hover e no foco (mesma regra do CSS da web).
  Widget _construirLink(Color corDoTexto) {
    // Link sem callback: continua na tela (o desenho é o do Figma), mas sem
    // ação possível é anunciado como LINK DESATIVADO e fica fora da ordem de
    // Tab — mesma mecânica do X sem [onDismiss], e o mesmo que a web faz
    // quando `linkAtivo` é falso (sem `href` + `aria-disabled="true"`).
    // Desativado não convida: sem sublinhado no hover e sem engolir o toque.
    final VoidCallback? aoTocar = onLinkTap;
    if (aoTocar == null) {
      return Semantics(
        link: true,
        enabled: false,
        child: Text(linkText, style: _estiloLink(corDoTexto)),
      );
    }

    return Semantics(
      link: true,
      child: _AcaoFocavel(
        onTap: aoTocar,
        // SEM overlay: na web o link só SUBLINHA no hover/foco — não ganha
        // fundo (.rds-alert__link:hover no CSS não pinta background; quem
        // pinta fundo é só o X). O realce do link é o sublinhado + o anel
        // de foco, nada mais.
        comOverlay: false,
        // Hover OU foco: o texto se redesenha sublinhado, como a web faz com
        // `:hover` e `:focus-visible`.
        construirFilho: (bool realcada) => Text(
          linkText,
          style: _estiloLink(corDoTexto, sublinhado: realcada),
        ),
      ),
    );
  }

  /// Botão de fechar — X de 20/16 px em content/primary.
  ///
  /// Duas caixas com papéis diferentes, como na web:
  ///
  /// * a **caixa do ícone** (20/16 px) é o desenho do Figma — é em volta DELA
  ///   que o hover e o anel de foco aparecem (anel de 2 px com folga de 2 px,
  ///   o `outline` + `outline-offset` do CSS);
  /// * o **alvo de toque** (44/40 px = ícone + os 12 px de padding de cada
  ///   lado) é invisível e serve para o dedo e para o mouse: captura o toque
  ///   até a borda do container sem desenhar nada, e o hover ACENDE com o
  ///   ponteiro em qualquer lugar dele (mas PINTA só a caixa do ícone) — na
  ///   web o `::before` que amplia o alvo faz parte do botão, então lá é
  ///   igual. No Flutter o toque não é aceito fora da caixa do widget, então
  ///   esse é o maior alvo possível sem empurrar o layout do Figma — ainda
  ///   abaixo dos 48 px que o Material recomenda (anotado no README).
  Widget _construirBotaoFechar(RapidocsCores cores, double tamanhoIcone) {
    final double alvo = tamanhoIcone + RapidocsTokens.paddingS * 2;
    final Widget icone = _svg('close', cores.contentPrimary, tamanhoIcone);

    final VoidCallback? aoFechar = onDismiss;
    if (aoFechar == null) {
      // Botão inerte, anunciado como desativado — e sem absorver o toque.
      return Semantics(
        button: true,
        enabled: false,
        label: _rotuloFechar,
        child: SizedBox(
          width: alvo,
          height: alvo,
          // O padding de 12 px recoloca o X exatamente onde o layout o
          // desenharia (12 px do topo e 12 px da direita).
          child: Padding(
            padding: const EdgeInsets.all(RapidocsTokens.paddingS),
            child: icone,
          ),
        ),
      );
    }

    // Sem `Tooltip` de propósito: o `Semantics(label: 'Fechar')` já entrega o
    // rótulo ao leitor de tela, e o `Tooltip` exigiria um `Overlay` na árvore de
    // quem usa o DS — o que contraria a intenção deste componente de não depender
    // de `Scaffold`/`Material` da app. A versão web também não tem tooltip (o
    // `title` do host é anulado de propósito), então as duas plataformas se
    // comportam igual.
    return Semantics(
      button: true,
      label: _rotuloFechar,
      child: _AlvoDoFechar(alvo: alvo, aoFechar: aoFechar, icone: icone),
    );
  }
}

/// Alvo de toque do X quando ele está ATIVO (com [RdsAlert.onDismiss]).
///
/// Na web o `::before` que amplia o alvo FAZ PARTE do botão, então o hover
/// ACENDE com o ponteiro em qualquer lugar dos 44/40 px — mas PINTA só a caixa
/// do ícone (20/16 px). Aqui é igual: o `MouseRegion` externo rastreia o hover
/// no alvo inteiro e repassa o estado ([_AcaoFocavel.realceExterno]) para o
/// realce interno pintar a caixa do ícone. O clique/toque já cobria os 44/40
/// e não muda.
class _AlvoDoFechar extends StatefulWidget {
  const _AlvoDoFechar({
    required this.alvo,
    required this.aoFechar,
    required this.icone,
  });

  /// Lado do alvo de toque invisível: 44 (large) ou 40 (small).
  final double alvo;

  final VoidCallback aoFechar;

  /// O X já tingido (20/16 px).
  final Widget icone;

  @override
  State<_AlvoDoFechar> createState() => _AlvoDoFecharState();
}

class _AlvoDoFecharState extends State<_AlvoDoFechar> {
  /// Ponteiro em qualquer lugar do alvo de 44/40 — não só sobre o ícone.
  bool _sobOAlvo = false;

  @override
  Widget build(BuildContext context) {
    // O cursor de mão vale no alvo inteiro, como na web (o ::before que
    // amplia o alvo faz parte do botão) — e é este mesmo MouseRegion que
    // acende/apaga o realce da caixa do ícone.
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      onEnter: (_) => setState(() => _sobOAlvo = true),
      onExit: (_) => setState(() => _sobOAlvo = false),
      // ALVO DE TOQUE: os 44/40 px inteiros aceitam o toque/clique, mas não
      // desenham nada — o realce visual é todo do `_AcaoFocavel`, lá dentro.
      // `excludeFromSemantics` evita um segundo nó de toque para o leitor de
      // tela (o `InkWell` do `_AcaoFocavel` já anuncia a ação).
      child: GestureDetector(
        onTap: widget.aoFechar,
        behavior: HitTestBehavior.opaque,
        excludeFromSemantics: true,
        child: SizedBox(
          width: widget.alvo,
          height: widget.alvo,
          // O padding de 12 px recoloca o X exatamente onde o layout o
          // desenharia — o alvo cresce em volta, o desenho não sai do lugar.
          child: Padding(
            padding: const EdgeInsets.all(RapidocsTokens.paddingS),
            // CAIXA DO ÍCONE: hover, toque e anel de foco desenham em volta
            // destes 20/16 px (+ folga de 2 px), como na web — nunca em
            // volta do alvo de 44/40, que é invisível.
            child: _AcaoFocavel(
              onTap: widget.aoFechar,
              realceExterno: _sobOAlvo,
              construirFilho: (_) => widget.icone,
            ),
          ),
        ),
      ),
    );
  }
}

/// Área tocável **e focável** usada pelo link e pelo botão de fechar.
///
/// Substitui o `GestureDetector` puro, que não entrava na ordem de Tab e não
/// respondia a Enter/Espaço — quebra de paridade com a versão web, que tem
/// `:focus-visible`. Aqui:
/// * é um `InkWell`, então entra no Tab e aciona com Enter e Espaço;
/// * o anel de foco é pintado **fora** da caixa, com folga de 2 px (o
///   `outline` + `outline-offset: 2px` do CSS), então mostrar o foco não
///   empurra nada no layout;
/// * hover e foco são rastreados e repassados ao filho via [construirFilho] —
///   é assim que o link sublinha nos dois estados, como o CSS faz com
///   `:hover` e `:focus-visible`;
/// * o `Material(type: MaterialType.transparency)` é criado aqui mesmo — o
///   componente não exige `Scaffold` nem pinta nada por baixo;
/// * quando [comOverlay] está ligado, foco, hover e toque usam cor de token,
///   resolvida pela mesma camada ([RapidocsCores]) que o resto do DS.
///
/// **Este é o padrão que os próximos componentes do DS vão copiar.** Se um dia
/// ele virar helper compartilhado com a cor do anel configurável, o valor padrão
/// tem de continuar sendo `content/primary` (ver [_corDoAnel]) — usar o token
/// `action/focusRing/neutral` reprova no contraste da WCAG.
class _AcaoFocavel extends StatefulWidget {
  const _AcaoFocavel({
    required this.onTap,
    required this.construirFilho,
    this.comOverlay = true,
    this.realceExterno = false,
  });

  /// Sempre preenchido: quem não tem ação não usa este widget.
  final VoidCallback onTap;

  /// Constrói o filho sabendo se a ação está **realçada** (mouse em cima OU
  /// foco de teclado). O link usa o aviso para sublinhar; o X ignora (o realce
  /// dele é o fundo pintado na caixa — ver [comOverlay]).
  final Widget Function(bool realcada) construirFilho;

  /// Pintar fundo nos estados de interação (hover/foco/toque)?
  ///
  /// * **X: `true`** — a web pinta fundo no X (`action/hover/onColorSecondary`
  ///   no `:hover` do `.rds-alert__close`), então aqui também.
  /// * **Link: `false`** — na web hover/foco do link só SUBLINHAM
  ///   (`.rds-alert__link:hover` = `text-decoration: underline`, sem
  ///   background). Desligado, todos os overlays ficam transparentes e sobram
  ///   só o sublinhado e o anel de foco.
  final bool comOverlay;

  /// Hover rastreado FORA desta caixa (o alvo de toque de 44/40 do X).
  ///
  /// Na web o `::before` que amplia o alvo faz parte do botão, então o hover
  /// acende com o ponteiro em qualquer lugar do alvo — mas pinta só a caixa do
  /// ícone. Quem rastreia o alvo grande ([_AlvoDoFechar]) avisa por aqui, e o
  /// fundo é pintado nesta caixa. Só tem efeito com [comOverlay] ligado.
  final bool realceExterno;

  @override
  State<_AcaoFocavel> createState() => _AcaoFocavelState();
}

class _AcaoFocavelState extends State<_AcaoFocavel> {
  // Mesmas medidas do CSS: anel de 2 px, afastado 2 px, canto de 2 px.
  static const double _espessuraDoAnel = RapidocsTokens.component3xs;
  static const double _folgaDoAnel = RapidocsTokens.component3xs;
  static const double _raio = RapidocsTokens.component3xs;

  // A folga é o vão entre a caixa e o anel; o traço vem depois dela. É a
  // conta do CSS: `outline-offset: 2px` afasta, `outline: 2px` desenha.
  static const double _alcanceDoAnel = _folgaDoAnel + _espessuraDoAnel;

  bool _focado = false;
  bool _sobOMouse = false;

  /// Cor do anel de foco — **padrão do DS: `content/primary`**.
  ///
  /// Não use `cores.actionFocusRingNeutral` aqui. Aquele token é preto/branco a
  /// 24% de opacidade: composto sobre os 5 fundos de status, claro e escuro,
  /// ele fica entre 1,73:1 e 2,16:1 de contraste, abaixo dos 3:1 exigidos pela
  /// WCAG 1.4.11 e 2.4.11 — o anel praticamente desaparece. `content/primary` é
  /// a cor do texto do DS, já inverte entre claro e escuro e rende de 8,9:1 a
  /// 18,4:1. Mesma decisão da versão web (`:focus-visible` em
  /// components/angular/alert/alert.css).
  Color _corDoAnel(RapidocsCores cores) => cores.contentPrimary;

  @override
  Widget build(BuildContext context) {
    final RapidocsCores cores = RapidocsCores.de(context);

    // Mouse em cima — desta caixa OU do alvo grande que avisa por
    // `realceExterno` (o hover do X acende no alvo de 44/40 inteiro).
    final bool sobre = _sobOMouse || widget.realceExterno;

    return Material(
      type: MaterialType.transparency,
      child: Stack(
        // O anel é desenhado para fora da caixa; sem isso ele seria cortado.
        clipBehavior: Clip.none,
        children: <Widget>[
          // FUNDO DO HOVER (só com overlay ligado): pintado à mão, e não pelo
          // `hoverColor` do `InkWell`, porque o `InkWell` só acende quando o
          // ponteiro está sobre ELE — e a paridade com a web pede que o hover
          // do X acenda no alvo de 44/40 inteiro, pintando só esta caixa.
          // Sem transição, como no CSS (que também não tem `transition`).
          if (widget.comOverlay && sobre)
            Positioned.fill(
              child: IgnorePointer(
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    color: cores.actionHoverOnColorSecondary,
                    borderRadius: BorderRadius.circular(_raio),
                  ),
                ),
              ),
            ),
          InkWell(
            onTap: widget.onTap,
            borderRadius: BorderRadius.circular(_raio),
            // Toque/foco com overlay de token, e não com a cor padrão do tema
            // da app — o realce fica igual em qualquer app. O hover NÃO passa
            // pelo `InkWell` (ver o fundo pintado à mão, acima); com overlay
            // desligado (link), tudo fica transparente: o realce do link é só
            // o sublinhado + o anel de foco, como na web.
            hoverColor: Colors.transparent,
            focusColor: widget.comOverlay
                ? cores.actionHoverOnColorSecondary
                : Colors.transparent,
            highlightColor: widget.comOverlay
                ? cores.actionHoverOnColorSecondary
                : Colors.transparent,
            splashColor: widget.comOverlay
                ? cores.actionHoverOnColor
                : Colors.transparent,
            onHover: (bool dentro) {
              setState(() => _sobOMouse = dentro);
            },
            onFocusChange: (bool temFoco) {
              setState(() => _focado = temFoco);
            },
            child: widget.construirFilho(sobre || _focado),
          ),
          if (_focado)
            Positioned(
              left: -_alcanceDoAnel,
              top: -_alcanceDoAnel,
              right: -_alcanceDoAnel,
              bottom: -_alcanceDoAnel,
              child: IgnorePointer(
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    border: Border.all(
                      color: _corDoAnel(cores),
                      width: _espessuraDoAnel,
                    ),
                    borderRadius:
                        BorderRadius.circular(_raio + _alcanceDoAnel),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
