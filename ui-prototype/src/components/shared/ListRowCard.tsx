import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ListRowCardProps {
  leading?: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  trailing?: React.ReactNode
  meta?: React.ReactNode
  accent?: "default" | "warning"
  onClick?: () => void
  showChevron?: boolean
}

/**
 * Unified list-row card. Icon + title/subtitle + optional trailing slot.
 * Interactive if onClick provided (hover-lift + cursor-pointer).
 * Warning accent adds amber stripe + tinted bg.
 */
export function ListRowCard({
  leading,
  title,
  subtitle,
  trailing,
  meta,
  accent = "default",
  onClick,
  showChevron,
}: ListRowCardProps) {
  const isClickable = !!onClick
  const Wrapper = isClickable ? "button" : "div"

  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        "w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-colors",
        accent === "warning"
          ? "border-amber-200 bg-gradient-to-r from-amber-50/50 to-transparent"
          : "border-border/60 bg-card",
        isClickable && "hover-lift cursor-pointer"
      )}
      {...(isClickable ? { type: "button" as const } : {})}
    >
      {leading}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {typeof title === "string" ? (
              <span className="text-sm font-semibold truncate">{title}</span>
            ) : (
              title
            )}
          </div>
          {trailing}
        </div>
        {(subtitle || meta) && (
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            {subtitle && (
              <span className="truncate flex-1">
                {subtitle}
              </span>
            )}
            {meta && <span className="shrink-0 font-mono text-[11px]">{meta}</span>}
          </div>
        )}
      </div>
      {showChevron && <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />}
    </Wrapper>
  )
}
