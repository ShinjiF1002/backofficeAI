import { cn } from "@/lib/utils"

interface NumProps {
  children: React.ReactNode
  className?: string
  /** Disables tracking-tighter (for large hero numbers where extra tightness looks crushed) */
  loose?: boolean
}

/**
 * Numeric wrapper. Forces Inter + tabular-nums to prevent Inter/Noto baseline jitter
 * in mixed JP+number strings (e.g., `¥342,000` `96.8%`).
 */
export function Num({ children, className, loose }: NumProps) {
  return (
    <span className={cn("font-num tabular-nums", !loose && "tracking-tighter", className)}>
      {children}
    </span>
  )
}
