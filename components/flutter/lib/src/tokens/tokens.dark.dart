//
// tokens.dark.dart
//
// Nao edite este arquivo na mao: ele e gerado pelo Style Dictionary
// a partir dos JSON em tokens/src (fonte da verdade: Figma).
//

import 'dart:ui';

class RapidocsTokensDark {
    RapidocsTokensDark._();

    /// Cor decorativa azul sólida. Uso estético (gráficos, avatares, tags). NÃO usar como status — para status use feedback/\*.
    static const accentBlue = Color(0xFF55A1F2);
    /// Fundo decorativo azul suave para tags e avatares. NÃO usar como status.
    static const accentBlueLight = Color(0xFF113760);
    /// Cor decorativa verde sólida. Uso estético (gráficos, avatares, tags). NÃO usar como status — para status use feedback/\*.
    static const accentGreen = Color(0xFF44CB93);
    /// Fundo decorativo verde suave para tags e avatares. NÃO usar como status.
    static const accentGreenLight = Color(0xFF084C30);
    /// Cor decorativa laranja sólida. Uso estético (gráficos, avatares, tags). NÃO usar como status — para status use feedback/\*.
    static const accentOrange = Color(0xFFFF9D3B);
    /// Fundo decorativo laranja suave para tags e avatares. NÃO usar como status.
    static const accentOrangeLight = Color(0xFF663504);
    /// Cor decorativa rosa sólida. Uso estético (gráficos, avatares, tags). NÃO usar como status — para status use feedback/\*.
    static const accentPink = Color(0xFFED58CC);
    /// Fundo decorativo rosa suave para tags e avatares. NÃO usar como status.
    static const accentPinkLight = Color(0xFF5D124C);
    /// Cor decorativa roxo sólida. Uso estético (gráficos, avatares, tags). NÃO usar como status — para status use feedback/\*.
    static const accentPurple = Color(0xFF9D8AFE);
    /// Fundo decorativo roxo suave para tags e avatares. NÃO usar como status.
    static const accentPurpleLight = Color(0xFF281C54);
    /// Cor decorativa vermelho sólida. Uso estético (gráficos, avatares, tags). NÃO usar como status — para status use feedback/\*.
    static const accentRed = Color(0xFFEB4B5B);
    /// Fundo decorativo vermelho suave para tags e avatares. NÃO usar como status.
    static const accentRedLight = Color(0xFF5C0C14);
    /// Cor decorativa amarelo sólida. Uso estético (gráficos, avatares, tags). NÃO usar como status — para status use feedback/\*.
    static const accentYellow = Color(0xFFFABC40);
    /// Fundo decorativo amarelo suave para tags e avatares. NÃO usar como status.
    static const accentYellowLight = Color(0xFF644406);
    /// Estado ativo/selecionado. Referencia brand/fill (segue a cor da marca).
    static const actionActive = Color(0xFF5C9AFF);
    /// Fundo de elementos desabilitados.
    static const actionDisableBackground = Color(0xFF292E36);
    /// Borda de elementos desabilitados.
    static const actionDisableBorder = Color(0xFF373E48);
    /// Texto/ícone de elementos desabilitados.
    static const actionDisableContent = Color(0xFF444D5A);
    /// Anel de foco (focus ring) para elementos brand.
    static const actionFocusRingBrand = Color(0x3D3381FF);
    /// Anel de foco para estados de erro/destrutivo. Pareie com feedback/error.
    static const actionFocusRingError = Color(0x3DE61E32);
    /// Anel de foco neutro. Inverte para permanecer visível nos dois modos.
    static const actionFocusRingNeutral = Color(0x3DFFFFFF);
    /// Anel de foco para estados de sucesso.
    static const actionFocusRingSuccess = Color(0x3D15BE78);
    /// Overlay de hover sobre botões/superfícies coloridas sólidas (escurece levemente).
    static const actionHoverOnColor = Color(0x2908090A);
    /// Overlay de hover mais leve sobre superfícies coloridas.
    static const actionHoverOnColorSecondary = Color(0x0A08090A);
    /// Overlay de hover sobre superfícies escuras.
    static const actionHoverOnDark = Color(0x2908090A);
    /// Borda na cor da marca (outline de botões, inputs, etc.).
    static const borderBrand = Color(0xFF5C9AFF);
    /// Borda sobre superfícies de contraste oposto.
    static const borderInverse = Color(0xFF9DA2AA);
    /// Borda padrão de inputs, cards e divisores com ênfase.
    static const borderPrimary = Color(0xFF444D5A);
    /// Borda/divisor sutil para separações internas discretas.
    static const borderSecondary = Color(0xFF373E48);
    /// Cor forte da marca: fundo de botão primário, borda e ícone brand. Pareie texto com brand/onFill.
    static const brandFill = Color(0xFF5C9AFF);
    /// Texto/ícone sobre brand/fill (superfície brand sólida). Contraste calibrado.
    static const brandOnFill = Color(0xFF08090A);
    /// Texto/ícone brand sobre a página ou sobre brand/surface: links, ênfase brand.
    static const brandOnSurface = Color(0xFF5C9AFF);
    /// Superfície brand tingida suave: hover de outline, destaques leves. Pareie texto com brand/onSurface.
    static const brandSurface = Color(0xFF143466);
    /// Texto/ícone sempre escuro nos dois modos.
    static const contentAlwaysDark = Color(0xFF08090A);
    /// Texto/ícone sempre claro nos dois modos.
    static const contentAlwaysLight = Color(0xFFFFFFFF);
    /// Texto/ícone sobre background/inverse. Inverte entre os modos.
    static const contentInverse = Color(0xFF08090A);
    /// Cor principal de texto e ícones. Títulos e corpo em alto contraste.
    static const contentPrimary = Color(0xFFFFFFFF);
    /// Texto e ícones de apoio (hierarquia secundária): legendas, descrições, metadados de destaque.
    static const contentSecondary = Color(0xFF9DA2AA);
    /// Texto de menor ênfase: placeholder, hints, metadados. Contraste baixo proposital; use só sobre níveis 1 e 2 de fundo.
    static const contentTertiary = Color(0xFF5B6471);
    /// Cor forte de status error: fundo de filled, ícone sobre superfície, borda/outline. Pareie texto com feedback/error/onFill.
    static const feedbackErrorFill = Color(0xFFE61E32);
    /// Texto/ícone sobre feedback/error/fill (superfície sólida). Contraste calibrado.
    static const feedbackErrorOnFill = Color(0xFFFFFFFF);
    /// Texto/ícone de status error sobre a surface ou sobre a página: validação, texto de alerta light.
    static const feedbackErrorOnSurface = Color(0xFFEB4B5B);
    /// Superfície tingida suave de status error: alert light, badge, container, input em erro.
    static const feedbackErrorSurface = Color(0xFF5C0C14);
    /// Cor forte de status info: fundo de filled, ícone sobre superfície, borda/outline. Pareie texto com feedback/info/onFill.
    static const feedbackInfoFill = Color(0xFF3381FF);
    /// Texto/ícone sobre feedback/info/fill (superfície sólida). Contraste calibrado.
    static const feedbackInfoOnFill = Color(0xFFFFFFFF);
    /// Texto/ícone de status info sobre a surface ou sobre a página: validação, texto de alerta light.
    static const feedbackInfoOnSurface = Color(0xFF5C9AFF);
    /// Superfície tingida suave de status info: alert light, badge, container, input em erro.
    static const feedbackInfoSurface = Color(0xFF143466);
    /// Cor forte de status success: fundo de filled, ícone sobre superfície, borda/outline. Pareie texto com feedback/success/onFill.
    static const feedbackSuccessFill = Color(0xFF15BE78);
    /// Texto/ícone sobre feedback/success/fill (superfície sólida). Contraste calibrado.
    static const feedbackSuccessOnFill = Color(0xFF08090A);
    /// Texto/ícone de status success sobre a surface ou sobre a página: validação, texto de alerta light.
    static const feedbackSuccessOnSurface = Color(0xFF44CB93);
    /// Superfície tingida suave de status success: alert light, badge, container, input em erro.
    static const feedbackSuccessSurface = Color(0xFF084C30);
    /// Cor forte de status warning: fundo de filled, ícone sobre superfície, borda/outline. Pareie texto com feedback/warning/onFill.
    static const feedbackWarningFill = Color(0xFFF9AB10);
    /// Texto/ícone sobre feedback/warning/fill (superfície sólida). Contraste calibrado.
    static const feedbackWarningOnFill = Color(0xFF08090A);
    /// Texto/ícone de status warning sobre a surface ou sobre a página: validação, texto de alerta light.
    static const feedbackWarningOnSurface = Color(0xFFFABC40);
    /// Superfície tingida suave de status warning: alert light, badge, container, input em erro.
    static const feedbackWarningSurface = Color(0xFF644406);
    /// Fundo que permanece escuro nos dois modos, independente do tema.
    static const surfaceAlwaysDark = Color(0xFF08090A);
    /// Fundo que permanece claro nos dois modos, independente do tema.
    static const surfaceAlwaysLight = Color(0xFFFFFFFF);
    /// Fundo de contraste oposto ao tema (tooltip, snackbar). Inverte entre os modos.
    static const surfaceInverse = Color(0xFFFFFFFF);
    /// Scrim de modal e bottom sheet: escurece o conteúdo atrás. Escuro nos dois modos.
    static const surfaceOverlay = Color(0x5208090A);
    /// Fundo base da página/tela. Nível 1 de elevação (mais ao fundo).
    static const surfacePrimary = Color(0xFF1B1F24);
    /// Fundo de cards e superfícies sobre a página. Nível 2 de elevação.
    static const surfaceSecondary = Color(0xFF292E36);
    /// Fundo de elementos aninhados dentro de cards: inputs, tiles, linhas. Nível 3 de elevação.
    static const surfaceTertiary = Color(0xFF373E48);
}
