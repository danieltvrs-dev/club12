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
 *
 * Timeout de 60s: o backend roda no plano gratuito do Render, que
 * "dorme" após 15min sem uso. A primeira requisição pós-soneca
 * dispara o cold start e pode levar 30-50s. Um timeout curto (ex: 10s)
 * faria o usuário ver erro mesmo com o backend funcionando.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000',
  timeout: 60_000,
  headers: { 'Content-Type': 'application/json' },
})

export default api
