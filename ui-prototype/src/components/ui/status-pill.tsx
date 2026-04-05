import { cn } from "@/lib/utils"

export type StatusPillTone = "emerald" | "amber" | "rose" | "indigo" | "slate" | "teal" | "violet"

interface StatusPillProps {
  tone: StatusPillTone
  children: React.ReactNode
  pulse?: boolean
  className?: string
}

const toneClasses: Record<StatusPillTone, { bg: string; border: string; text: string; dot: string }> = {
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
  amber:   { bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700",   dot: "bg-amber-500" },
  rose:    { bg: "bg-rose-50",    border: "border-rose-200",    text: "text-rose-700",    dot: "bg-rose-500" },
  indigo:  { bg: "bg-primary/10", border: "border-primary/30",  text: "text-primary",     dot: "bg-primary" },
  slate:   { bg: "bg-slate-50",   border: "border-slate-200",   text: "text-slate-700",   dot: "bg-slate-500" },
  teal:    { bg: "bg-teal-50",    border: "border-teal-200",    text: "text-teal-700",    dot: "bg-teal-500" },
  violet:  { bg: "bg-violet-50",  border: "border-violet-200",  text: "text-violet-700",  dot: "bg-violet-500" },
}

/**
 * Semantic status pill — reference HTML line 59 pattern.
 * Dot prefix + tinted bg + colored border. JP-safe (text-[11px], not bold).
 */
export function StatusPill({ tone, children, pulse, className }: StatusPillProps) {
  const c = toneClasses[tone]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-semibold tabular-nums shrink-0",
        c.bg,
        c.border,
        c.text,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", c.dot, pulse && "animate-pulse")} />
      {children}
    </span>
  )
}
