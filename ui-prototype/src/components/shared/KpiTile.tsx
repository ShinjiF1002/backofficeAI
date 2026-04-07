import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { Card, CardContent } from "crystalline-ui"
import { Num } from "crystalline-ui"
import { cn } from "@/lib/utils"

export type KpiTone = "indigo" | "emerald" | "amber" | "rose" | "violet" | "teal" | "slate"

interface KpiTileProps {
  label: string
  value: number | string
  unit?: string
  icon: LucideIcon
  tone?: KpiTone
  hint?: string
  trendBadge?: React.ReactNode
  /** Optional visualization slot rendered below value (mini chart, progress bar, etc.) */
  children?: ReactNode
}

const toneIconBg: Record<KpiTone, string> = {
  indigo:  "bg-primary/10 text-primary",
  emerald: "bg-emerald-50 text-emerald-600",
  amber:   "bg-amber-50 text-amber-600",
  rose:    "bg-rose-50 text-rose-600",
  violet:  "bg-violet-50 text-violet-600",
  teal:    "bg-teal-50 text-teal-600",
  slate:   "bg-slate-100 text-slate-600",
}

/**
 * Enterprise-premium KPI card. Icon in top-right tinted circle, large tabular-num value,
 * JP label below with safe line-height.
 */
export function KpiTile({ label, value, unit, icon: Icon, tone = "indigo", hint, trendBadge, children }: KpiTileProps) {
  return (
    <Card variant="default" className="overflow-hidden">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground leading-[1.4]">{label}</p>
            <div className="mt-1.5 flex items-baseline gap-1">
              <Num className="text-2xl font-bold text-foreground">{value}</Num>
              {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            </div>
            {(hint || trendBadge) && (
              <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground leading-[1.4]">
                {trendBadge}
                {hint && <span>{hint}</span>}
              </div>
            )}
          </div>
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", toneIconBg[tone])}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        {children && <div className="mt-3">{children}</div>}
      </CardContent>
    </Card>
  )
}
