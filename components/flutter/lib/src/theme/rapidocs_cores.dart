// Rapidocs DS — resolução de cor entre modo claro e modo escuro.
//
// POR QUE ISSO EXISTE
// Os tokens saem do Style Dictionary em duas classes: `RapidocsTokens` (claro) e
// `RapidocsTokensDark` (escuro). Um componente não pode escolher uma delas na
// mão — ele precisa perguntar "qual é o modo agora?". Esta é a ÚNICA camada que
// faz essa pergunta. Todo componente do DS lê cor por aqui, nunca direto das
// duas classes. Assim, quando o Alert (ou qualquer componente futuro) precisar
// de tema escuro, não tem nada novo para fazer.
//
//   final cores = RapidocsCores.de(context);
//   Text('oi', style: TextStyle(color: cores.contentPrimary));
//
// Só COR tem modo. Medida (padding, gap, raio, tamanho de ícone) é igual nos
// dois modos e continua vindo direto de `RapidocsTokens`.

import 'package:flutter/material.dart';

import '../tokens/tokens.dart';
import '../tokens/tokens.dark.dart';

/// Paleta semântica do Rapidocs DS já resolvida para o modo (claro/escuro) em
/// que o widget está sendo desenhado.
@immutable
class RapidocsCores {
  const RapidocsCores._({required this.modoEscuro});

  /// Paleta do modo claro.
  static const RapidocsCores claro = RapidocsCores._(modoEscuro: false);

  /// Paleta do modo escuro.
  static const RapidocsCores escuro = RapidocsCores._(modoEscuro: true);

  /// Resolve a paleta pelo tema em volta do widget.
  ///
  /// Se não houver `Theme` na árvore, o Flutter devolve o tema padrão (claro) —
  /// então isso também funciona fora de um `MaterialApp`.
  static RapidocsCores de(BuildContext context) =>
      doBrilho(Theme.of(context).brightness);

  /// Resolve a paleta por um brilho explícito — útil em teste e em preview.
  static RapidocsCores doBrilho(Brightness brilho) =>
      brilho == Brightness.dark ? escuro : claro;

  /// `true` quando as cores devolvidas são as do modo escuro.
  final bool modoEscuro;

  /// Escolhe entre o valor do claro e o do escuro.
  Color _cor(Color noClaro, Color noEscuro) => modoEscuro ? noEscuro : noClaro;

  // ---------------------------------------------------------------------------
  // accent/* — cores decorativas (gráficos, avatares, tags). Não usar p/ status.
  // ---------------------------------------------------------------------------
  Color get accentBlue =>
      _cor(RapidocsTokens.accentBlue, RapidocsTokensDark.accentBlue);
  Color get accentBlueLight =>
      _cor(RapidocsTokens.accentBlueLight, RapidocsTokensDark.accentBlueLight);
  Color get accentGreen =>
      _cor(RapidocsTokens.accentGreen, RapidocsTokensDark.accentGreen);
  Color get accentGreenLight =>
      _cor(RapidocsTokens.accentGreenLight, RapidocsTokensDark.accentGreenLight);
  Color get accentOrange =>
      _cor(RapidocsTokens.accentOrange, RapidocsTokensDark.accentOrange);
  Color get accentOrangeLight => _cor(
        RapidocsTokens.accentOrangeLight,
        RapidocsTokensDark.accentOrangeLight,
      );
  Color get accentPink =>
      _cor(RapidocsTokens.accentPink, RapidocsTokensDark.accentPink);
  Color get accentPinkLight =>
      _cor(RapidocsTokens.accentPinkLight, RapidocsTokensDark.accentPinkLight);
  Color get accentPurple =>
      _cor(RapidocsTokens.accentPurple, RapidocsTokensDark.accentPurple);
  Color get accentPurpleLight => _cor(
        RapidocsTokens.accentPurpleLight,
        RapidocsTokensDark.accentPurpleLight,
      );
  Color get accentRed =>
      _cor(RapidocsTokens.accentRed, RapidocsTokensDark.accentRed);
  Color get accentRedLight =>
      _cor(RapidocsTokens.accentRedLight, RapidocsTokensDark.accentRedLight);
  Color get accentYellow =>
      _cor(RapidocsTokens.accentYellow, RapidocsTokensDark.accentYellow);
  Color get accentYellowLight => _cor(
        RapidocsTokens.accentYellowLight,
        RapidocsTokensDark.accentYellowLight,
      );

  // ---------------------------------------------------------------------------
  // action/* — estados de interação (ativo, desabilitado, foco, hover).
  // ---------------------------------------------------------------------------
  Color get actionActive =>
      _cor(RapidocsTokens.actionActive, RapidocsTokensDark.actionActive);
  Color get actionDisableBackground => _cor(
        RapidocsTokens.actionDisableBackground,
        RapidocsTokensDark.actionDisableBackground,
      );
  Color get actionDisableBorder => _cor(
        RapidocsTokens.actionDisableBorder,
        RapidocsTokensDark.actionDisableBorder,
      );
  Color get actionDisableContent => _cor(
        RapidocsTokens.actionDisableContent,
        RapidocsTokensDark.actionDisableContent,
      );
  Color get actionFocusRingBrand => _cor(
        RapidocsTokens.actionFocusRingBrand,
        RapidocsTokensDark.actionFocusRingBrand,
      );
  Color get actionFocusRingError => _cor(
        RapidocsTokens.actionFocusRingError,
        RapidocsTokensDark.actionFocusRingError,
      );
  Color get actionFocusRingNeutral => _cor(
        RapidocsTokens.actionFocusRingNeutral,
        RapidocsTokensDark.actionFocusRingNeutral,
      );
  Color get actionFocusRingSuccess => _cor(
        RapidocsTokens.actionFocusRingSuccess,
        RapidocsTokensDark.actionFocusRingSuccess,
      );
  Color get actionHoverOnColor => _cor(
        RapidocsTokens.actionHoverOnColor,
        RapidocsTokensDark.actionHoverOnColor,
      );
  Color get actionHoverOnColorSecondary => _cor(
        RapidocsTokens.actionHoverOnColorSecondary,
        RapidocsTokensDark.actionHoverOnColorSecondary,
      );
  Color get actionHoverOnDark => _cor(
        RapidocsTokens.actionHoverOnDark,
        RapidocsTokensDark.actionHoverOnDark,
      );

  // ---------------------------------------------------------------------------
  // border/* — bordas e divisores.
  // ---------------------------------------------------------------------------
  Color get borderBrand =>
      _cor(RapidocsTokens.borderBrand, RapidocsTokensDark.borderBrand);
  Color get borderInverse =>
      _cor(RapidocsTokens.borderInverse, RapidocsTokensDark.borderInverse);
  Color get borderPrimary =>
      _cor(RapidocsTokens.borderPrimary, RapidocsTokensDark.borderPrimary);
  Color get borderSecondary =>
      _cor(RapidocsTokens.borderSecondary, RapidocsTokensDark.borderSecondary);

  // ---------------------------------------------------------------------------
  // brand/* — cor da marca.
  // ---------------------------------------------------------------------------
  Color get brandFill =>
      _cor(RapidocsTokens.brandFill, RapidocsTokensDark.brandFill);
  Color get brandOnFill =>
      _cor(RapidocsTokens.brandOnFill, RapidocsTokensDark.brandOnFill);
  Color get brandOnSurface =>
      _cor(RapidocsTokens.brandOnSurface, RapidocsTokensDark.brandOnSurface);
  Color get brandSurface =>
      _cor(RapidocsTokens.brandSurface, RapidocsTokensDark.brandSurface);

  // ---------------------------------------------------------------------------
  // content/* — texto e ícone.
  // ---------------------------------------------------------------------------
  Color get contentAlwaysDark => _cor(
        RapidocsTokens.contentAlwaysDark,
        RapidocsTokensDark.contentAlwaysDark,
      );
  Color get contentAlwaysLight => _cor(
        RapidocsTokens.contentAlwaysLight,
        RapidocsTokensDark.contentAlwaysLight,
      );
  Color get contentInverse =>
      _cor(RapidocsTokens.contentInverse, RapidocsTokensDark.contentInverse);
  Color get contentPrimary =>
      _cor(RapidocsTokens.contentPrimary, RapidocsTokensDark.contentPrimary);
  Color get contentSecondary =>
      _cor(RapidocsTokens.contentSecondary, RapidocsTokensDark.contentSecondary);
  Color get contentTertiary =>
      _cor(RapidocsTokens.contentTertiary, RapidocsTokensDark.contentTertiary);

  // ---------------------------------------------------------------------------
  // feedback/* — status (info, warning, success, error).
  // ---------------------------------------------------------------------------
  Color get feedbackErrorFill => _cor(
        RapidocsTokens.feedbackErrorFill,
        RapidocsTokensDark.feedbackErrorFill,
      );
  Color get feedbackErrorOnFill => _cor(
        RapidocsTokens.feedbackErrorOnFill,
        RapidocsTokensDark.feedbackErrorOnFill,
      );
  Color get feedbackErrorOnSurface => _cor(
        RapidocsTokens.feedbackErrorOnSurface,
        RapidocsTokensDark.feedbackErrorOnSurface,
      );
  Color get feedbackErrorSurface => _cor(
        RapidocsTokens.feedbackErrorSurface,
        RapidocsTokensDark.feedbackErrorSurface,
      );
  Color get feedbackInfoFill => _cor(
        RapidocsTokens.feedbackInfoFill,
        RapidocsTokensDark.feedbackInfoFill,
      );
  Color get feedbackInfoOnFill => _cor(
        RapidocsTokens.feedbackInfoOnFill,
        RapidocsTokensDark.feedbackInfoOnFill,
      );
  Color get feedbackInfoOnSurface => _cor(
        RapidocsTokens.feedbackInfoOnSurface,
        RapidocsTokensDark.feedbackInfoOnSurface,
      );
  Color get feedbackInfoSurface => _cor(
        RapidocsTokens.feedbackInfoSurface,
        RapidocsTokensDark.feedbackInfoSurface,
      );
  Color get feedbackSuccessFill => _cor(
        RapidocsTokens.feedbackSuccessFill,
        RapidocsTokensDark.feedbackSuccessFill,
      );
  Color get feedbackSuccessOnFill => _cor(
        RapidocsTokens.feedbackSuccessOnFill,
        RapidocsTokensDark.feedbackSuccessOnFill,
      );
  Color get feedbackSuccessOnSurface => _cor(
        RapidocsTokens.feedbackSuccessOnSurface,
        RapidocsTokensDark.feedbackSuccessOnSurface,
      );
  Color get feedbackSuccessSurface => _cor(
        RapidocsTokens.feedbackSuccessSurface,
        RapidocsTokensDark.feedbackSuccessSurface,
      );
  Color get feedbackWarningFill => _cor(
        RapidocsTokens.feedbackWarningFill,
        RapidocsTokensDark.feedbackWarningFill,
      );
  Color get feedbackWarningOnFill => _cor(
        RapidocsTokens.feedbackWarningOnFill,
        RapidocsTokensDark.feedbackWarningOnFill,
      );
  Color get feedbackWarningOnSurface => _cor(
        RapidocsTokens.feedbackWarningOnSurface,
        RapidocsTokensDark.feedbackWarningOnSurface,
      );
  Color get feedbackWarningSurface => _cor(
        RapidocsTokens.feedbackWarningSurface,
        RapidocsTokensDark.feedbackWarningSurface,
      );

  // ---------------------------------------------------------------------------
  // surface/* — fundos.
  // ---------------------------------------------------------------------------
  Color get surfaceAlwaysDark => _cor(
        RapidocsTokens.surfaceAlwaysDark,
        RapidocsTokensDark.surfaceAlwaysDark,
      );
  Color get surfaceAlwaysLight => _cor(
        RapidocsTokens.surfaceAlwaysLight,
        RapidocsTokensDark.surfaceAlwaysLight,
      );
  Color get surfaceInverse =>
      _cor(RapidocsTokens.surfaceInverse, RapidocsTokensDark.surfaceInverse);
  Color get surfaceOverlay =>
      _cor(RapidocsTokens.surfaceOverlay, RapidocsTokensDark.surfaceOverlay);
  Color get surfacePrimary =>
      _cor(RapidocsTokens.surfacePrimary, RapidocsTokensDark.surfacePrimary);
  Color get surfaceSecondary =>
      _cor(RapidocsTokens.surfaceSecondary, RapidocsTokensDark.surfaceSecondary);
  Color get surfaceTertiary =>
      _cor(RapidocsTokens.surfaceTertiary, RapidocsTokensDark.surfaceTertiary);
}
