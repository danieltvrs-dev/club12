import { useEffect } from 'react'

/*
 * Hook minúsculo que atualiza o <title> da aba do navegador.
 * Restaura o título anterior quando o componente desmonta — assim
 * a aba sempre reflete a página atual sem "vazar" entre navegações.
 *
 * Uso:
 *   useDocumentTitle('Classificação')   →  "Classificação · CLUB12"
 *   useDocumentTitle(null)              →  "CLUB12"
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    const prev = document.title
    document.title = title ? `${title} · CLUB12` : 'CLUB12'
    return () => { document.title = prev }
  }, [title])
}
