import { NavLink } from 'react-router-dom'

/*
 * NavLink (em vez de Link) adiciona automaticamente uma classe "active"
 * quando a URL atual bate com o "to". Usamos isso para destacar a
 * página selecionada.
 *
 * Responsivo: em telas muito pequenas o texto "CLUB12" some,
 * sobrando só o badge "12" — ganhamos espaço para os links.
 */
const linkBase =
  'px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-surface-800'

const linkClass = ({ isActive }) =>
  `${linkBase} ${isActive ? 'text-brand-500' : 'text-brand-50/80 hover:text-brand-50'}`

function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-surface-700 bg-surface-900/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 font-bold text-brand-50">
            12
          </span>
          <span className="hidden text-lg font-semibold tracking-tight sm:inline">
            CLUB12
          </span>
        </NavLink>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/classificacao" className={linkClass}>Classificação</NavLink>
          <NavLink to="/times" className={linkClass}>Times</NavLink>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
