import { StatusPill, type StatusPillTone } from "@/components/ui/status-pill"

interface ConfidenceBadgeProps {
  confidence: number
  size?: 'sm' | 'md' | 'lg'
}

/**
 * AI信頼度を色付きバッジで表示。
 * - 90%以上: 緑（高信頼）
 * - 70-90%: 琥珀（要確認）
 * - <70%: 赤（慎重確認）
 */
export default function ConfidenceBadge({ confidence, size = 'sm' }: ConfidenceBadgeProps) {
  const tone: StatusPillTone =
    confidence >= 90 ? 'emerald' :
    confidence >= 70 ? 'amber' :
    'rose'

  const sizeClasses = {
    sm: '',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-2.5 py-1',
  }

  return (
    <StatusPill tone={tone} className={sizeClasses[size]}>
      {confidence}%
    </StatusPill>
  )
}
