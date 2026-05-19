import { Link, useParams } from 'react-router-dom'
import { useTeam } from '../hooks/useTeam'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import MatchCard from '../components/matches/MatchCard'

/*
 * Helper visual: traduz "Goalkeeper/Defender/..." para PT.
 */
const POSITION_PT = {
  Goalkeeper: 'Goleiro',
  Defender: 'Defensor',
  Midfielder: 'Meia',
  Attacker: 'Atacante',
}

function PlayerCard({ player }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-surface-700 bg-surface-800 p-3">
      {player.photo ? (
        <img src={player.photo} alt="" className="h-10 w-10 flex-shrink-0 rounded-full object-cover" />
      ) : (
        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-surface-700" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {player.number != null && (
            <span className="font-mono text-xs text-brand-500">#{player.number}</span>
          )}
          <p className="truncate font-medium">{player.name}</p>
        </div>
        <p className="text-xs text-brand-50/50">
          {POSITION_PT[player.position] ?? player.position ?? '—'}
          {player.age != null && ` · ${player.age} anos`}
        </p>
      </div>
    </div>
  )
}

function TeamDetails() {
  const { id } = useParams()
  const teamId = Number(id)
  const { team, squad, fixtures, isLoading, error } = useTeam(teamId)
  // Título dinâmico: muda quando os dados do time chegam.
  useDocumentTitle(team?.name)

  if (isLoading) {
    return <p className="text-brand-50/60">Carregando...</p>
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
        <p className="font-semibold">Erro ao carregar o time.</p>
        <p className="mt-1 text-sm">{error.message}</p>
        <Link to="/times" className="mt-3 inline-block text-sm text-brand-500 hover:underline">
          ← voltar para busca
        </Link>
      </div>
    )
  }

  if (!team) {
    return <p className="text-brand-50/60">Time não encontrado.</p>
  }

  return (
    <div className="space-y-8">
      <Link to="/times" className="inline-block text-sm text-brand-50/60 hover:text-brand-500">
        ← voltar para busca
      </Link>

      {/* Header */}
      <header className="flex flex-wrap items-center gap-6 rounded-xl border border-surface-700 bg-surface-800 p-6">
        {team.logo && (
          <img src={team.logo} alt="" className="h-20 w-20 object-contain" />
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
          <p className="mt-1 text-sm text-brand-50/60">
            {team.country}
            {team.founded != null && ` · fundado em ${team.founded}`}
          </p>
          {team.venue_name && (
            <p className="text-sm text-brand-50/60">
              Estádio: {team.venue_name}{team.venue_city && ` — ${team.venue_city}`}
            </p>
          )}
        </div>
      </header>

      {/* Elenco */}
      <section>
        <h2 className="mb-3 text-xl font-semibold">
          Elenco{' '}
          <span className="text-sm font-normal text-brand-50/40">({squad.length})</span>
        </h2>
        {squad.length === 0 ? (
          <p className="text-brand-50/60">Elenco não disponível no plano gratuito.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {squad.map((p) => <PlayerCard key={p.id} player={p} />)}
          </div>
        )}
      </section>

      {/* Últimos jogos — reusa MatchCard da Home */}
      <section>
        <h2 className="mb-3 text-xl font-semibold">
          Últimos jogos{' '}
          <span className="text-sm font-normal text-brand-50/40">(temporada 2023)</span>
        </h2>
        {fixtures.length === 0 ? (
          <p className="text-brand-50/60">Nenhum jogo disponível.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fixtures.map((f) => <MatchCard key={f.id} match={f} />)}
          </div>
        )}
      </section>
    </div>
  )
}

export default TeamDetails
