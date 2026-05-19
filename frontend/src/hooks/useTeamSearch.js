import { useEffect, useState } from 'react'
import api from '../services/api'

/*
 * Busca times por termo. Só dispara quando `query` for não-vazio
 * e tiver pelo menos 3 caracteres (regra da API-Football).
 *
 * Passe query='' (string vazia) para resetar/silenciar o hook.
 */
export function useTeamSearch(query) {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query || query.length < 3) {
      setData([])
      return
    }
    let cancelled = false
    setIsLoading(true)
    setError(null)
    api.get('/teams/search', { params: { q: query } })
      .then((res) => { if (!cancelled) setData(res.data) })
      .catch((err) => { if (!cancelled) setError(err) })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [query])

  return { data, isLoading, error }
}
