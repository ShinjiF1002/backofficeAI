import type { POCPhase } from '@/data/types'
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface POCPhaseBadgeProps {
  phases: POCPhase[]
  variant?: 'strip' | 'detailed'
}

export default function POCPhaseBadge({ phases, variant = 'strip' }: POCPhaseBadgeProps) {
  if (variant === 'strip') {
    return (
      <div className="flex items-center gap-3 text-sm flex-wrap">
        {phases.map((p, i) => {
          const isCurrent = p.status === 'in_progress'
          const isDone = p.status === 'completed'
          return (
            <div key={p.phase} className="flex items-center gap-3">
              <div className={cn(
                'flex items-center gap-1.5',
                isCurrent ? 'text-primary font-medium' :
                isDone ? 'text-emerald-600' : 'text-muted-foreground'
              )}>
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : isCurrent ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
                <span className="text-xs">Phase {p.phase}: {p.jpTitle.replace('（現在）', '')}</span>
              </div>
              {i < phases.length - 1 && <span className="text-muted-foreground/30">→</span>}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
      {phases.map(p => {
        const isCurrent = p.status === 'in_progress'
        const isDone = p.status === 'completed'
        const statusLabel = isDone ? '完了' : isCurrent ? '実施中' : '予定'
        const statusColor = isDone ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                            isCurrent ? 'bg-primary/10 border-primary/30 text-primary' :
                            'bg-muted border-border text-muted-foreground'
        return (
          <div
            key={p.phase}
            className={cn(
              "p-4 rounded-xl border",
              isCurrent
                ? 'border-primary/30 bg-gradient-to-br from-primary/5 to-transparent shadow-[var(--shadow-premium-md)]'
                : 'border-border/60 bg-card shadow-[var(--shadow-premium-sm)]'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground tabular-nums">Phase {p.phase}</span>
              <span className={cn('text-[10px] px-1.5 py-0.5 rounded border font-medium', statusColor)}>{statusLabel}</span>
            </div>
            <p className="text-sm font-semibold mb-1 leading-[1.4]">{p.jpTitle.replace('（現在）', '')}</p>
            <p className="text-xs text-muted-foreground mb-2 leading-[1.5]">{p.subtitle}</p>
            <ul className="space-y-0.5">
              {p.keyPoints.map(pt => (
                <li key={pt} className="text-xs text-muted-foreground flex items-start gap-1 leading-[1.5]">
                  <span className="text-muted-foreground/40 mt-0.5">・</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
