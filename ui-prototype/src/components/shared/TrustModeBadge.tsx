import type { TrustMode } from "@/data/types";
import { trustModeLabels } from "@/data/types";
import { StatusPill } from "crystalline-ui";
import type { StatusTone } from "crystalline-ui";

interface TrustModeBadgeProps {
  mode: TrustMode;
}

/**
 * Trust-mode pill with locked semantic color mapping (architecture.md §4):
 * - supervised  → neutral  (most restrictive, neutral)
 * - checkpoint  → info (brand, partial autonomy)
 * - autonomous  → success (trusted, fully delegated)
 */
const modeTone: Record<TrustMode, StatusTone> = {
  supervised: "neutral",
  checkpoint: "info",
  autonomous: "success",
};

export function TrustModeBadge({ mode }: TrustModeBadgeProps) {
  return <StatusPill tone={modeTone[mode]}>{trustModeLabels[mode]}</StatusPill>;
}
