/**
 * Flywheel stage colors are LOCKED (V7 design principle): amber → teal → violet → emerald.
 * Other surfaces that reference this concept must use these same hues.
 */

export type FlywheelStage = 'corrections' | 'knowledge' | 'proposals' | 'approved'

export const flywheelStageColors: Record<FlywheelStage, {
  bg: string
  border: string
  text: string
  icon: string
}> = {
  corrections: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'text-amber-600' },
  knowledge:   { bg: 'bg-teal-50',  border: 'border-teal-200',  text: 'text-teal-700',  icon: 'text-teal-600' },
  proposals:   { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', icon: 'text-violet-600' },
  approved:    { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: 'text-emerald-600' },
}
