import { Link } from 'react-router-dom'
import { Pencil, Search, Ban, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { RecentCorrection, ErrorCategory } from '@/data/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { StatusPill } from '@/components/ui/status-pill'
import type { StatusPillTone } from '@/components/ui/status-pill'
import { cn } from '@/lib/utils'

interface RecentCorrectionsTimelineProps {
  corrections: RecentCorrection[]
}

/**
 * architecture.md §9 error taxonomy + routing を可視化するタイムライン。
 * 各エントリ: 時刻 + 担当者 + 要約 + ルーティング結果 chip。
 * dot の色は error category のルーティング先（Tier 2 → amber / Tier 1 → teal / log-only → slate）。
 */
const dotStyleByCategory: Record<ErrorCategory, { bg: string; icon: LucideIcon }> = {
  misunderstanding: { bg: 'bg-amber-400', icon: Pencil },
  ui_change:        { bg: 'bg-amber-400', icon: Pencil },
  edge_case:        { bg: 'bg-teal-400',  icon: Search },
  judgment_gap:     { bg: 'bg-teal-400',  icon: Search },
  data_error:       { bg: 'bg-slate-300', icon: Ban },
}

const routingChipByOutcome: Record<RecentCorrection['routingOutcome'], { tone: StatusPillTone; label: string }> = {
  tier2:    { tone: 'violet', label: '手順の変更提案を作成' },
  tier1:    { tone: 'teal',   label: 'ナレッジに追加' },
  log_only: { tone: 'slate',  label: '記録のみ' },
}

export default function RecentCorrectionsTimeline({ corrections }: RecentCorrectionsTimelineProps) {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-base font-semibold leading-[1.4]">最近の修正事項</h2>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          担当者のコメントから AI がどう学習したか
        </p>
      </CardHeader>
      <CardContent>
        {corrections.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">修正事項はありません</p>
        ) : (
          <div className="relative">
            {/* 縦ライン */}
            <span
              aria-hidden
              className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-gradient-to-b from-border via-border/60 to-transparent"
            />
            <ol className="space-y-4">
              {corrections.map(c => {
                const style = dotStyleByCategory[c.errorCategory]
                const chip = routingChipByOutcome[c.routingOutcome]
                const DotIcon = style.icon
                return (
                  <li key={c.id} className="relative pl-8">
                    {/* dot marker */}
                    <span
                      aria-hidden
                      className={cn(
                        'absolute left-0 top-0.5 w-6 h-6 rounded-full border-[3px] border-background flex items-center justify-center',
                        style.bg,
                      )}
                    >
                      <DotIcon className="h-3 w-3 text-white" strokeWidth={2.5} />
                    </span>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-[10px] font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded shrink-0">
                        {c.timestamp}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">{c.operator}</span>
                      <span className="text-[11px] text-muted-foreground/70">・</span>
                      <span className="text-[11px] text-muted-foreground">{c.workflowName}</span>
                    </div>
                    <p className="mt-1.5 text-[13px] text-foreground leading-[1.5]">{c.summary}</p>
                    <div className="mt-2">
                      <StatusPill tone={chip.tone}>{chip.label}</StatusPill>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        )}
        <div className="mt-4 pt-3 border-t border-border/60">
          <Link
            to="/runs"
            className="flex items-center justify-between text-xs text-primary font-medium hover:underline"
          >
            <span>すべての履歴を見る</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
