import { ArrowRight } from "lucide-react"

interface CorrectionDiffProps {
  before?: string
  after?: string
}

/**
 * Before → after pill for correction timelines.
 * Renders nothing if both values are missing.
 */
export function CorrectionDiff({ before, after }: CorrectionDiffProps) {
  if (!before && !after) return null
  return (
    <span className="inline-flex items-center gap-1.5 rounded border border-border/60 bg-muted/30 px-2 py-0.5 text-[11px] font-mono">
      {before && <span className="line-through text-rose-600">{before}</span>}
      {before && after && <ArrowRight className="h-3 w-3 text-muted-foreground/60" />}
      {after && <span className="text-emerald-600 font-medium">{after}</span>}
    </span>
  )
}
