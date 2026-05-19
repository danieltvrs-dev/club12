import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function NotFound() {
  useDocumentTitle('Página não encontrada')

  return (
    <div className="py-20 text-center">
      <p className="text-7xl font-bold text-brand-500">404</p>
      <h1 className="mt-4 text-2xl font-semibold">Página não encontrada</h1>
      <p className="mx-auto mt-2 max-w-md text-brand-50/60">
        O endereço que você digitou não existe no CLUB12. Pode ter caído de
        cabeça em algum link quebrado.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-md bg-brand-600 px-5 py-2 font-medium text-brand-50 transition-colors hover:bg-brand-500"
      >
        Voltar para a Home
      </Link>
    </div>
  )
}

export default NotFound
