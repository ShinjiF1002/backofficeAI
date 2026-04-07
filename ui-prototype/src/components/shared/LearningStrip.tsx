import { useNavigate } from 'react-router-dom'
import type { LearningMetric } from '@/data/types'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Num } from 'crystalline-ui'

interface LearningStripProps {
  metrics: LearningMetric[]
}

/**
 * HomePage 用の学習ループ進捗ストリップ。
 * 今週の学習活動を一行で要約し、LearningStatusPage への誘導を兼ねる。
 */
export default function LearningStrip({ metrics }: LearningStripProps) {
  const navigate = useNavigate()
  const latest = metrics[metrics.length - 1]
  if (!latest) return null

  return (
    <button
      onClick={() => navigate('/learning')}
      className="w-full text-left rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/5 to-transparent shadow-[var(--shadow-premium-sm)] p-3 md:p-4 hover:shadow-[var(--shadow-cta)] hover:border-primary/30 transition-all group"
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0">
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm leading-[1.5]">
            <span className="text-muted-foreground">{latest.weekLabel}、AI は </span>
            <Num className="font-semibold text-foreground">{latest.correctionsIn}</Num>
            <span className="text-muted-foreground"> 件のコメントから学習し、</span>
            <Num className="font-semibold text-foreground">{latest.proposalsGenerated}</Num>
            <span className="text-muted-foreground"> 件の改善提案を生成しました</span>
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-primary font-medium shrink-0 group-hover:gap-2 transition-all">
          学習状況を見る
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </button>
  )
}
