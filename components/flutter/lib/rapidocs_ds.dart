/// Rapidocs DS — Design System do Rapidocs para Flutter.
///
/// Ponto único de entrada do pacote. Um import só e você tem tokens, resolução
/// de claro/escuro e componentes:
///
/// ```dart
/// import 'package:rapidocs_ds/rapidocs_ds.dart';
/// ```
///
/// Regra de ouro do DS: **token é compartilhado, componente não.** Os tokens
/// aqui são os mesmos que a web consome; o código do componente é próprio do
/// Flutter.
library;

// --- Fundação: tokens gerados do Figma pelo Style Dictionary ---------------
// Não edite na mão: são gerados a partir de tokens/src na raiz do repositório.
export 'src/tokens/tokens.dart'; // RapidocsTokens — modo claro + medidas
export 'src/tokens/tokens.dark.dart'; // RapidocsTokensDark — cores do modo escuro

// --- Camada única que resolve cor por modo (claro/escuro) -------------------
export 'src/theme/rapidocs_cores.dart'; // RapidocsCores.de(context)

// --- Componentes ------------------------------------------------------------
export 'src/alert/rds_alert.dart'; // RdsAlert, RdsAlertStatus, RdsAlertSize
