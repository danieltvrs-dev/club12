import { useState, useEffect } from 'react'
import { useLeagues } from '../hooks/useLeagues'
import { useStandings } from '../hooks/useStandings'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

/*
 * Subcomponente: a forma dos últimos 5 jogos como bolinhas coloridas.
 * Recebe uma string tipo "WWDLW" (vitória, vitória, empate, derrota...).
 */
function FormDots({ form }) {
  if (!form) return <span className="text-brand-50/30">-</span>
  const map = {
    W: { bg: 'bg-brand-500', label: 'V' },
    D: { bg: 'bg-yellow-500', label: 'E' },
    L: { bg: 'bg-red-500', label: 'D' },
  }
  return (
    <div className="flex gap-1">
      {form.split('').map((char, i) => {
        const m = map[char] ?? { bg: 'bg-surface-700', label: '?' }
        return (
          <span
            key={i}
            title={m.label}
            className={`inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold text-white ${m.bg}`}
          >
            {m.label}
          </span>
        )
      })}
    </div>
  )
}

function Standings() {
  useDocumentTitle('Classificação')
  const { leagues, isLoading: loadingLeagues } = useLeagues()
  // selectedId é o código da liga (string agora: 'BSA', 'PL', ...).
  const [selectedId, setSelectedId] = useState(null)

  // Quando a lista de ligas chegar, escolhe a primeira por padrão.
  useEffect(() => {
    if (leagues.length > 0 && selectedId === null) {
      setSelectedId(leagues[0].id)
    }
  }, [leagues, selectedId])

  const { data, isLoading, error } = useStandings(selectedId)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classificação</h1>
          <p className="mt-1 text-sm text-brand-50/60">
            Tabela de pontos corridos do campeonato escolhido.
          </p>
        </div>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-brand-50/60">Campeonato</span>
          <select
            value={selectedId ?? ''}
            onChange={(e) => setSelectedId(e.target.value)}
            disabled={loadingLeagues}
            className="rounded-md border border-surface-700 bg-surface-800 px-3 py-2 text-brand-50 focus:border-brand-500 focus:outline-none"
          >
            {leagues.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </label>
      </div>

      {isLoading && <p className="text-brand-50/60">Carregando tabela...</p>}

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          <p className="font-semibold">Não foi possível carregar a tabela.</p>
          <p className="mt-1 text-sm">{error.message}</p>
        </div>
      )}

      {!isLoading && !error && data.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-surface-700">
          <table className="min-w-full text-sm">
            <thead className="bg-surface-800 text-xs uppercase tracking-wide text-brand-50/60">
              <tr>
                <th className="px-3 py-3 text-left">#</th>
                <th className="px-3 py-3 text-left">Time</th>
                <th className="px-3 py-3 text-right" title="Pontos">PG</th>
                <th className="px-3 py-3 text-right" title="Jogos">J</th>
                <th className="px-3 py-3 text-right" title="Vitórias">V</th>
                <th className="px-3 py-3 text-right" title="Empates">E</th>
                <th className="px-3 py-3 text-right" title="Derrotas">D</th>
                <th className="px-3 py-3 text-right" title="Gols pró">GP</th>
                <th className="px-3 py-3 text-right" title="Gols contra">GC</th>
                <th className="px-3 py-3 text-right" title="Saldo de gols">SG</th>
                <th className="px-3 py-3 text-left">Últimos 5</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700">
              {data.map((row) => (
                <tr key={row.team.id} className="bg-surface-900/40 transition-colors hover:bg-surface-800">
                  <td className="px-3 py-2 font-mono text-brand-50/60">{row.rank}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      {row.team.logo && (
                        <img src={row.team.logo} alt="" className="h-5 w-5 object-contain" />
                      )}
                      <span className="font-medium">{row.team.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-semibold text-brand-500">{row.points}</td>
                  <td className="px-3 py-2 text-right font-mono">{row.played}</td>
                  <td className="px-3 py-2 text-right font-mono">{row.win}</td>
                  <td className="px-3 py-2 text-right font-mono">{row.draw}</td>
                  <td className="px-3 py-2 text-right font-mono">{row.lose}</td>
                  <td className="px-3 py-2 text-right font-mono">{row.goals_for}</td>
                  <td className="px-3 py-2 text-right font-mono">{row.goals_against}</td>
                  <td className={`px-3 py-2 text-right font-mono ${row.goals_diff > 0 ? 'text-brand-500' : row.goals_diff < 0 ? 'text-red-400' : 'text-brand-50/60'}`}>
                    {row.goals_diff > 0 ? `+${row.goals_diff}` : row.goals_diff}
                  </td>
                  <td className="px-3 py-2"><FormDots form={row.form} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Standings
