/*
 * Selo "AO VIVO" com bolinha vermelha pulsante.
 * Recebe o minuto atual (opcional) e mostra "AO VIVO · 39'".
 */
function LiveBadge({ minute }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/15 px-2 py-0.5 text-xs font-semibold text-red-400">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
      AO VIVO{minute ? ` · ${minute}'` : ''}
    </span>
  )
}

export default LiveBadge
