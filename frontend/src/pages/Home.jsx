import { useFixtures } from '../hooks/useFixtures'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import MatchCard from '../components/matches/MatchCard'
import { isLive, isFinished, isUpcoming } from '../lib/fixtureStatus'

/*
 * Sub-componente local: uma seção com título e grid de cards.
 * Se a lista vier vazia, retorna null (não renderiza nada).
 */
function Section({ title, matches }) {
  if (matches.length === 0) return null
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold text-brand-50">
        {title}{' '}
        <span className="text-sm font-normal text-brand-50/40">({matches.length})</span>
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((m) => (
          <MatchCard key={m.id} match={m} />
        ))}
      </div>
    </section>
  )
}

function Home() {
  useDocumentTitle('Jogos de hoje')
  const { data, isLoading, error } = useFixtures()

  // --- Estado 1: carregando ---
  if (isLoading) {
    return (
      <p className="text-brand-50/60">Carregando jogos...</p>
    )
  }

  // --- Estado 2: erro ---
  if (error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
        <p className="font-semibold">Não foi possível carregar os jogos.</p>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    )
  }

  // --- Estado 3: sucesso (mesmo que lista vazia) ---
  const live = data.filter((m) => isLive(m.status))
  const upcoming = data.filter((m) => isUpcoming(m.status))
  const finished = data.filter((m) => isFinished(m.status))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Jogos de hoje</h1>
        <p className="mt-1 text-sm text-brand-50/60">
          {data.length} {data.length === 1 ? 'partida' : 'partidas'} no total
        </p>
      </div>

      {data.length === 0 && (
        <p className="text-brand-50/60">
          Nenhum jogo encontrado para hoje no plano gratuito da API-Football.
        </p>
      )}

      <Section title="Ao vivo" matches={live} />
      <Section title="Próximas partidas" matches={upcoming} />
      <Section title="Encerradas" matches={finished} />
    </div>
  )
}

export default Home
