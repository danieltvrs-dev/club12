import { useEffect, useState } from 'react'
import api from '../services/api'

/*
 * Detalhes de um time + elenco + últimos jogos.
 *
 * Faz 3 chamadas em paralelo (Promise.all) — mais rápido do que
 * encadear, já que são independentes. Cada uma vira 1 requisição
 * da cota da API-Football.
 */
export function useTeam(teamId) {
  const [team, setTeam] = useState(null)
  const [squad, setSquad] = useState([])
  const [fixtures, setFixtures] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!teamId) return
    let cancelled = false
    setIsLoading(true)
    setError(null)

    Promise.all([
      api.get(`/teams/${teamId}`),
      api.get(`/teams/${teamId}/squad`),
      api.get(`/teams/${teamId}/fixtures`, { params: { limit: 10 } }),
    ])
      .then(([t, s, f]) => {
        if (cancelled) return
        setTeam(t.data)
        setSquad(s.data)
        setFixtures(f.data)
      })
      .catch((err) => { if (!cancelled) setError(err) })
      .finally(() => { if (!cancelled) setIsLoading(false) })

    return () => { cancelled = true }
  }, [teamId])

  return { team, squad, fixtures, isLoading, error }
}
