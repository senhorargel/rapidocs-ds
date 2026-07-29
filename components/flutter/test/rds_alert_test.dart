// Teste de widget do RdsAlert — a rede de segurança mínima do componente.
//
// ATENÇÃO: este arquivo NUNCA FOI EXECUTADO. A máquina onde o DS é mantido não
// tem Flutter/Dart instalados. Ele está escrito e versionado para rodar no
// primeiro ambiente com SDK:
//
//     cd components/flutter && flutter test
//
// Os SVGs do DS não são carregados de verdade aqui: um `AssetBundle` de teste
// devolve um SVG válido e vazio para qualquer chave. Assim o teste verifica
// COMPORTAMENTO (o que a paridade com a web exige) e não depende de como o
// Flutter registra a chave dos assets de um pacote quando ele é o projeto raiz.

import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter/gestures.dart' show PointerDeviceKind;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:rapidocs_ds/rapidocs_ds.dart';

const String _svgVazio =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"></svg>';

/// Devolve um SVG válido e vazio para QUALQUER chave de asset.
class _BundleFalso extends CachingAssetBundle {
  @override
  Future<ByteData> load(String key) async =>
      ByteData.sublistView(Uint8List.fromList(utf8.encode(_svgVazio)));
}

/// Coloca o alerta no mínimo que ele pede: um `WidgetsApp` (aqui `MaterialApp`,
/// por causa do `Directionality` e do tema). Sem `Scaffold` e sem `Overlay` —
/// é exatamente essa independência que o componente promete.
Widget _app(Widget alerta, {Brightness brilho = Brightness.light}) {
  return MaterialApp(
    theme: ThemeData(brightness: brilho),
    home: DefaultAssetBundle(
      bundle: _BundleFalso(),
      child: Align(alignment: Alignment.topCenter, child: alerta),
    ),
  );
}

/// Fundo do container do alerta (o `DecoratedBox` mais externo do widget).
BoxDecoration _fundoDoAlerta(WidgetTester tester) {
  final DecoratedBox container = tester.widget<DecoratedBox>(
    find
        .descendant(
          of: find.byType(RdsAlert),
          matching: find.byType(DecoratedBox),
        )
        .first,
  );
  return container.decoration as BoxDecoration;
}

/// Caixas pintadas com o fundo de hover (`action/hover/onColorSecondary`)
/// dentro do alerta — o realce que o X ganha e o link NÃO (na web o hover do
/// link só sublinha; quem pinta fundo é só o `.rds-alert__close:hover`).
Finder _fundoDeHover() {
  return find.descendant(
    of: find.byType(RdsAlert),
    matching: find.byWidgetPredicate(
      (Widget w) =>
          w is DecoratedBox &&
          w.decoration is BoxDecoration &&
          (w.decoration as BoxDecoration).color ==
              RapidocsTokens.actionHoverOnColorSecondary,
    ),
  );
}

/// Todas as cores de borda desenhadas dentro do alerta (é onde o anel de foco
/// aparece).
List<Color> _coresDeBorda(WidgetTester tester) {
  return tester
      .widgetList<DecoratedBox>(
        find.descendant(
          of: find.byType(RdsAlert),
          matching: find.byType(DecoratedBox),
        ),
      )
      .map((DecoratedBox caixa) => caixa.decoration)
      .whereType<BoxDecoration>()
      .map((BoxDecoration decoracao) => decoracao.border)
      .whereType<Border>()
      .map((Border borda) => borda.top.color)
      .toList();
}

void main() {
  testWidgets('constrói nos 5 status × 2 tamanhos sem estourar', (
    WidgetTester tester,
  ) async {
    for (final RdsAlertStatus status in RdsAlertStatus.values) {
      for (final RdsAlertSize size in RdsAlertSize.values) {
        await tester.pumpWidget(
          _app(
            RdsAlert(
              status: status,
              size: size,
              title: 'Título',
              body: 'Descrição',
              linkText: 'Ver',
              onLinkTap: () {},
              onDismiss: () {},
            ),
          ),
        );
        await tester.pump();

        expect(tester.takeException(), isNull, reason: '$status / $size');
        expect(find.text('Título'), findsOneWidget, reason: '$status / $size');
        expect(find.text('Ver'), findsOneWidget, reason: '$status / $size');
      }
    }
  });

  testWidgets('fundo do status sai do token, no claro e no escuro', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_app(const RdsAlert(title: 'Título')));
    await tester.pump();
    expect(_fundoDoAlerta(tester).color, RapidocsTokens.feedbackInfoSurface);

    await tester.pumpWidget(
      _app(const RdsAlert(title: 'Título'), brilho: Brightness.dark),
    );
    await tester.pump();
    expect(_fundoDoAlerta(tester).color, RapidocsTokensDark.feedbackInfoSurface);
  });

  testWidgets('descrição vazia e link vazio não aparecem', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const RdsAlert(
          title: 'Título',
          body: '', // showBody ligado, mas sem texto: não abre espaço
          linkText: '', // showLink ligado, mas sem texto: não existe link
          dismissible: false,
        ),
      ),
    );
    await tester.pump();

    expect(find.text('Título'), findsOneWidget);
    expect(find.text(''), findsNothing);
    // Nada interativo na tela: nem link, nem X.
    expect(find.byType(InkWell), findsNothing);
  });

  testWidgets('X sem onDismiss fica inerte e o alerta não usa Tooltip', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const RdsAlert(title: 'Título', showBody: false, showLink: false),
      ),
    );
    await tester.pump();

    // Decisão de paridade: sem Tooltip. O Semantics já dá o rótulo ao leitor de
    // tela e o Tooltip exigiria um Overlay na app de quem consome o DS.
    expect(find.byType(Tooltip), findsNothing);
    // Sem consumidor do evento não há área clicável.
    expect(find.byType(InkWell), findsNothing);
  });

  testWidgets('X com onDismiss dispara o callback', (
    WidgetTester tester,
  ) async {
    int fechou = 0;

    await tester.pumpWidget(
      _app(
        RdsAlert(
          title: 'Título',
          showBody: false,
          showLink: false,
          onDismiss: () => fechou++,
        ),
      ),
    );
    await tester.pump();

    expect(find.byType(Tooltip), findsNothing);
    await tester.tap(find.byType(InkWell));
    await tester.pump();

    expect(fechou, 1);

    // O alvo de toque invisível (44/40) captura o toque até a borda do
    // container — aqui, um toque no canto do alerta, FORA da caixa do ícone.
    final Offset cantoDoAlvo =
        tester.getTopRight(find.byType(RdsAlert)) + const Offset(-4, 4);
    await tester.tapAt(cantoDoAlvo);
    await tester.pump();

    expect(fechou, 2);
  });

  testWidgets('link sem onLinkTap é anunciado desativado e não recebe foco', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      _app(
        const RdsAlert(
          title: 'Título',
          showBody: false,
          linkText: 'Ver',
          dismissible: false,
        ),
      ),
    );
    await tester.pump();

    // O texto do link continua na tela (a regra de existir é showLink + texto)...
    expect(find.text('Ver'), findsOneWidget);
    // ...mas sem ação possível não há área clicável nem foco (fora do Tab).
    expect(find.byType(InkWell), findsNothing);

    // Anunciado como LINK DESATIVADO — mesma mecânica do X sem onDismiss.
    final Semantics semanticaDoLink = tester.widget<Semantics>(
      find
          .ancestor(of: find.text('Ver'), matching: find.byType(Semantics))
          .first,
    );
    expect(semanticaDoLink.properties.link, isTrue);
    expect(semanticaDoLink.properties.enabled, isFalse);
  });

  testWidgets('link sublinha no hover e no foco', (WidgetTester tester) async {
    await tester.pumpWidget(
      _app(
        RdsAlert(
          title: 'Título',
          showBody: false,
          linkText: 'Ver',
          onLinkTap: () {},
          dismissible: false,
        ),
      ),
    );
    await tester.pump();

    TextDecoration? decoracao() =>
        tester.widget<Text>(find.text('Ver')).style?.decoration;

    // Em repouso: sem sublinhado (o link se distingue pelo peso da fonte).
    expect(decoracao(), TextDecoration.none);

    // Mouse em cima: sublinha (paridade com o :hover do CSS).
    final TestGesture mouse =
        await tester.createGesture(kind: PointerDeviceKind.mouse);
    await mouse.addPointer(location: Offset.zero);
    addTearDown(mouse.removePointer);
    await tester.pump();
    await mouse.moveTo(tester.getCenter(find.text('Ver')));
    await tester.pump();
    expect(decoracao(), TextDecoration.underline);

    // Mouse sai: volta ao normal.
    await mouse.moveTo(Offset.zero);
    await tester.pump();
    expect(decoracao(), TextDecoration.none);

    // Foco de teclado: sublinha também (paridade com o :focus-visible do CSS).
    Focus.of(tester.element(find.text('Ver'))).requestFocus();
    await tester.pump();
    expect(decoracao(), TextDecoration.underline);
  });

  testWidgets('link não pinta fundo em nenhum estado (só sublinha)', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      _app(
        RdsAlert(
          title: 'Título',
          showBody: false,
          linkText: 'Ver',
          onLinkTap: () {},
          dismissible: false,
        ),
      ),
    );
    await tester.pump();

    // Na web o hover/foco do link só SUBLINHAM (.rds-alert__link:hover não tem
    // background) — aqui os overlays do InkWell são todos transparentes.
    final InkWell inkDoLink = tester.widget<InkWell>(
      find
          .ancestor(of: find.text('Ver'), matching: find.byType(InkWell))
          .first,
    );
    expect(inkDoLink.hoverColor, Colors.transparent);
    expect(inkDoLink.focusColor, Colors.transparent);
    expect(inkDoLink.highlightColor, Colors.transparent);
    expect(inkDoLink.splashColor, Colors.transparent);

    // E o hover não desenha caixa de fundo nenhuma (o realce pintado à mão é
    // exclusivo do X).
    final TestGesture mouse =
        await tester.createGesture(kind: PointerDeviceKind.mouse);
    await mouse.addPointer(location: Offset.zero);
    addTearDown(mouse.removePointer);
    await tester.pump();
    await mouse.moveTo(tester.getCenter(find.text('Ver')));
    await tester.pump();
    expect(_fundoDeHover(), findsNothing);
  });

  testWidgets('hover em qualquer ponto do alvo do X acende a caixa do ícone', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      _app(
        RdsAlert(
          title: 'Título',
          showBody: false,
          showLink: false,
          onDismiss: () {},
        ),
      ),
    );
    await tester.pump();

    // Sem mouse por perto, sem realce.
    expect(_fundoDeHover(), findsNothing);

    final TestGesture mouse =
        await tester.createGesture(kind: PointerDeviceKind.mouse);
    await mouse.addPointer(location: Offset.zero);
    addTearDown(mouse.removePointer);
    await tester.pump();

    // Canto do alerta: DENTRO do alvo invisível de 44, FORA da caixa do ícone
    // (que só começa 12 px depois da borda). Na web o ::before que amplia o
    // alvo faz parte do botão, então o hover acende daqui também.
    final Offset cantoDoAlvo =
        tester.getTopRight(find.byType(RdsAlert)) + const Offset(-4, 4);
    await mouse.moveTo(cantoDoAlvo);
    await tester.pump();

    // Acende no alvo de 44, mas PINTA só a caixa do ícone (20 px no large).
    expect(_fundoDeHover(), findsOneWidget);
    expect(tester.getSize(_fundoDeHover()), const Size(20, 20));

    // Mouse foi embora: realce apaga.
    await mouse.moveTo(Offset.zero);
    await tester.pump();
    expect(_fundoDeHover(), findsNothing);
  });

  testWidgets('anel de foco do X desenha em volta do ícone, não do alvo', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      _app(
        RdsAlert(
          title: 'Título',
          showBody: false,
          showLink: false,
          onDismiss: () {},
        ),
      ),
    );
    await tester.pump();

    // Foca o X (o Focus mais próximo do desenho do ícone é o do InkWell).
    Focus.of(
      tester.element(
        find.descendant(
          of: find.byType(InkWell),
          matching: find.byType(SvgPicture),
        ),
      ),
    ).requestFocus();
    await tester.pump();

    final Finder anel = find.descendant(
      of: find.byType(RdsAlert),
      matching: find.byWidgetPredicate(
        (Widget w) =>
            w is DecoratedBox &&
            w.decoration is BoxDecoration &&
            (w.decoration as BoxDecoration).border != null,
      ),
    );
    expect(anel, findsOneWidget);

    // Caixa do ícone (20) + folga (2) + traço do anel (2) de cada lado = 28.
    // Nunca os 44 do alvo de toque, que é invisível e serve só para o dedo.
    expect(tester.getSize(anel), const Size(28, 28));
  });

  testWidgets('anel de foco usa content/primary (nunca focusRing/neutral)', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      _app(
        RdsAlert(
          title: 'Título',
          showBody: false,
          linkText: 'Ver',
          onLinkTap: () {},
          dismissible: false,
        ),
      ),
    );
    await tester.pump();

    // Sem foco não há anel.
    expect(_coresDeBorda(tester), isEmpty);

    // Dá foco ao link (é o Focus que o InkWell cria em volta do texto).
    Focus.of(tester.element(find.text('Ver'))).requestFocus();
    await tester.pump();

    final List<Color> bordas = _coresDeBorda(tester);
    expect(bordas, contains(RapidocsTokens.contentPrimary));
    // O token de foco neutro reprova no contraste (1,73:1 no pior caso sobre
    // os fundos de status) — a versão web já o rejeitou e aqui também.
    expect(bordas, isNot(contains(RapidocsTokens.actionFocusRingNeutral)));
  });
}
