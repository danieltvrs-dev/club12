import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTeamSearch } from '../hooks/useTeamSearch'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

/*
 * Card clicável de um resultado de busca.
 * O Link envolve tudo — clique no card inteiro navega pra /times/:id.
 */
function TeamResultCard({ team }) {
  return (
    <Link
      to={`/times/${team.id}`}
      className="flex items-center gap-3 rounded-xl border border-surface-700 bg-surface-800 p-4 transition-colors hover:border-brand-500/50 hover:bg-surface-800/70"
    >
      {team.logo && (
        <img src={team.logo} alt="" className="h-10 w-10 flex-shrink-0 object-contain" />
      )}
      <div className="min-w-0">
        <p className="truncate font-medium">{team.name}</p>
        <p className="text-xs text-brand-50/50">ID #{team.id}</p>
      </div>
    </Link>
  )
}

function Teams() {
  useDocumentTitle('Times')
  // Dois estados: o que o usuário está digitando (input) e o que foi
  // de fato submetido (query). Só o submitted dispara a busca.
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState('')

  const { data: results, isLoading, error } = useTeamSearch(submitted)

  function handleSubmit(e) {
    e.preventDefault()  // evita reload da página
    setSubmitted(input.trim())
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Times</h1>
        <p className="mt-1 text-sm text-brand-50/60">
          Pesquise um time pelo nome (mínimo 3 letras).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ex: Palmeiras, Manchester, Real..."
          className="flex-1 rounded-md border border-surface-700 bg-surface-800 px-3 py-2 text-brand-50 placeholder:text-brand-50/30 focus:border-brand-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={input.trim().length < 3}
          className="rounded-md bg-brand-600 px-4 py-2 font-medium text-brand-50 transition-colors hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buscar
        </button>
      </form>

      {isLoading && <p className="text-brand-50/60">Buscando...</p>}

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          {error.message}
        </div>
      )}

      {!isLoading && !error && submitted && results.length === 0 && (
        <p className="text-brand-50/60">
          Nenhum time encontrado para "{submitted}".
        </p>
      )}

      {results.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((team) => (
            <TeamResultCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Teams
