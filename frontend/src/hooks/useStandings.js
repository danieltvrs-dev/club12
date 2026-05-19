import { useEffect, useState } from 'react'
import api from '../services/api'

/*
 * Busca a tabela da temporada atual de uma liga.
 *
 * Antes este hook recebia (league, season) porque usávamos a
 * API-Football, que exige temporada explícita. Agora usamos
 * football-data.org no backend, que retorna sempre a temporada
 * vigente — então `league` (ex: 'BSA') é tudo que precisamos.
 */
export function useStandings(league) {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!league) return
    let cancelled = false
    setIsLoading(true)
    setError(null)
    api.get('/standings', { params: { league } })
      .then((res) => { if (!cancelled) setData(res.data) })
      .catch((err) => { if (!cancelled) setError(err) })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [league])

  return { data, isLoading, error }
}
