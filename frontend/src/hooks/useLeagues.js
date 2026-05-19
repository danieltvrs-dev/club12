import { useEffect, useState } from 'react'
import api from '../services/api'

/*
 * Busca a curadoria de ligas suportadas no backend.
 * Como é uma lista pequena e estática, não há overhead em refetch.
 */
export function useLeagues() {
  const [leagues, setLeagues] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    api.get('/standings/leagues')
      .then((res) => { if (!cancelled) setLeagues(res.data) })
      .catch((err) => { if (!cancelled) setError(err) })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [])

  return { leagues, isLoading, error }
}
