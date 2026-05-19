import LiveBadge from './LiveBadge'
import { isLive, isFinished } from '../../lib/fixtureStatus'

// Formatter de hora em português. Criar fora do componente pra
// não recriar a cada render (microperformance + boa prática).
const timeFmt = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

/*
 * Subcomponente: uma linha "logo - nome do time - placar".
 * highlight=true deixa em negrito (usado pra marcar quem venceu).
 */
function TeamRow({ team, score, highlight }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        {team.logo && (
          <img src={team.logo} alt="" className="h-5 w-5 flex-shrink-0 object-contain" />
        )}
        <span className={`truncate ${highlight ? 'font-semibold text-brand-50' : 'text-brand-50/90'}`}>
          {team.name}
        </span>
      </div>
      <span className="font-mono tabular-nums text-brand-50/90">
        {score ?? '-'}
      </span>
    </div>
  )
}

/*
 * Card de uma partida.
 * Cabeçalho: liga + status/horário.
 * Corpo: time da casa e visitante com placares.
 */
function MatchCard({ match }) {
  const live = isLive(match.status)
  const finished = isFinished(match.status)
  const winnerHome = finished && match.score_home > match.score_away
  const winnerAway = finished && match.score_away > match.score_home

  return (
    <article className="rounded-xl border border-surface-700 bg-surface-800 p-4 shadow-sm shadow-black/20 transition-colors hover:border-brand-500/50">
      <header className="mb-3 flex items-center justify-between text-xs">
        <div className="flex min-w-0 items-center gap-2 text-brand-50/60">
          {match.league.logo && (
            <img src={match.league.logo} alt="" className="h-4 w-4 object-contain" />
          )}
          <span className="truncate">{match.league.name}</span>
        </div>
        {live ? (
          <LiveBadge minute={match.minute} />
        ) : finished ? (
          <span className="uppercase tracking-wide text-brand-50/40">Encerrado</span>
        ) : (
          <span className="text-brand-50/60">{timeFmt.format(new Date(match.date))}</span>
        )}
      </header>

      <div className="space-y-2">
        <TeamRow team={match.home} score={match.score_home} highlight={winnerHome} />
        <TeamRow team={match.away} score={match.score_away} highlight={winnerAway} />
      </div>
    </article>
  )
}

export default MatchCard
