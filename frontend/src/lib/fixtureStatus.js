/*
 * Helpers para classificar o status de uma partida.
 *
 * A API-Football usa códigos curtos (short codes). Aqui agrupamos
 * eles em três categorias úteis pro nosso UI.
 *
 * Documentação: https://www.api-football.com/documentation-v3#section/Introduction/Fixtures-Status
 */

// Em andamento agora
const LIVE_STATUSES = new Set(['1H', 'HT', '2H', 'ET', 'BT', 'P', 'LIVE'])

// Acabou
const FINISHED_STATUSES = new Set(['FT', 'AET', 'PEN'])

export function isLive(status) {
  return LIVE_STATUSES.has(status)
}

export function isFinished(status) {
  return FINISHED_STATUSES.has(status)
}

// Tudo que não é "ao vivo" nem "encerrado" — geralmente NS (not started),
// TBD, ou exceções (PST, SUSP, CANC). Para o MVP tratamos tudo como
// "próximo / outro".
export function isUpcoming(status) {
  return !isLive(status) && !isFinished(status)
}
