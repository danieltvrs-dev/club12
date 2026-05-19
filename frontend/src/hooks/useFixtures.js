import { useEffect, useState } from 'react'
import api from '../services/api'

/*
 * Custom hook — busca os jogos de hoje no nosso backend.
 *
 * "Custom hook" = uma função que começa com "use" e usa outros hooks
 * do React internamente. Serve pra encapsular lógica reutilizável.
 *
 * Devolve sempre o trio { data, isLoading, error }. Qualquer
 * componente que use esse hook não precisa se preocupar com
 * useEffect, axios, ou estados — só consome o resultado.
 */
export function useFixtures() {
  const [data, setData] = useState([])      // dados que chegaram
  const [isLoading, setIsLoading] = useState(true)  // está buscando agora?
  const [error, setError] = useState(null)  // deu erro? guarda o objeto Error

  useEffect(() => {
    // Flag pra cancelar updates se o componente desmontar antes
    // da resposta chegar (evita warning "setState on unmounted").
    let cancelled = false

    setIsLoading(true)
    setError(null)

    api.get('/fixtures/today')
      .then((res) => { if (!cancelled) setData(res.data) })
      .catch((err) => { if (!cancelled) setError(err) })
      .finally(() => { if (!cancelled) setIsLoading(false) })

    // Função de cleanup do useEffect — roda no unmount.
    return () => { cancelled = true }
  }, [])  // [] = roda só uma vez, no mount

  return { data, isLoading, error }
}
