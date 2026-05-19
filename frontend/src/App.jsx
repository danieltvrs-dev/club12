import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Standings from './pages/Standings'
import Teams from './pages/Teams'
import TeamDetails from './pages/TeamDetails'
import NotFound from './pages/NotFound'

/*
 * Componente raiz.
 * - Navbar e Footer ficam fora de <Routes> → aparecem em todas as páginas.
 * - <Routes> escolhe qual <Route> renderizar conforme a URL atual.
 * - path="*" no final captura qualquer URL não-mapeada → 404.
 */
function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/classificacao" element={<Standings />} />
          <Route path="/times" element={<Teams />} />
          <Route path="/times/:id" element={<TeamDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
