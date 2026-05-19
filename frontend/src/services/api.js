import axios from 'axios'

/*
 * Cliente Axios centralizado.
 *
 * Toda chamada HTTP do app passa por aqui. Vantagens:
 * - URL base num só lugar (muda fácil entre dev e produção)
 * - Interceptors prontos pra log/erro
 * - Timeout padrão evita requisições penduradas
 *
 * VITE_API_URL vem do arquivo .env (todas as variáveis do Vite
 * que o frontend pode ler precisam começar com VITE_).
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

export default api
