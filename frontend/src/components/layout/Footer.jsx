function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-16 border-t border-surface-700 py-6">
      <div className="mx-auto max-w-6xl px-4 text-center text-xs text-brand-50/40">
        <p>
          CLUB12 · projeto de portfólio · {year}
        </p>
        <p className="mt-1">
          Dados fornecidos por{' '}
          <a
            href="https://www.api-football.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-50/60 hover:text-brand-500"
          >
            API-Football
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
