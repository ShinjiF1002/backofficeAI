import type { TrustMode } from "@/data/types"
import { trustModeLabels } from "@/data/types"
import { StatusPill, type StatusPillTone } from "@/components/ui/status-pill"

interface TrustModeBadgeProps {
  mode: TrustMode
}

/**
 * Trust-mode pill with locked semantic color mapping (architecture.md §4):
 * - supervised  → slate  (most restrictive, neutral)
 * - checkpoint  → indigo (brand, partial autonomy)
 * - autonomous  → emerald (trusted, fully delegated)
 */
const modeTone: Record<TrustMode, StatusPillTone> = {
  supervised: "slate",
  checkpoint: "indigo",
  autonomous: "emerald",
}

export function TrustModeBadge({ mode }: TrustModeBadgeProps) {
  return <StatusPill tone={modeTone[mode]}>{trustModeLabels[mode]}</StatusPill>
}
