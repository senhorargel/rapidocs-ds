/**
 * @rapidocs/ds-angular — ponto de entrada único da biblioteca.
 *
 * É por aqui que a aplicação importa tudo. Nunca importe de caminhos internos
 * (`.../alert/alert.component`): eles podem mudar de lugar entre versões.
 *
 * ```ts
 * import { AlertComponent, type AlertStatus } from '@rapidocs/ds-angular';
 * ```
 */

// ---- Alert / Notification ----
export { AlertComponent, type AlertSize } from './alert/alert.component';
export { type AlertStatus, ALERT_ICONS, ALERT_CLOSE_ICON } from './alert/alert-icons';
