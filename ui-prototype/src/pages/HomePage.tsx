import { useApp } from '@/context/AppContext'
import KpiCards from '@/components/home/KpiCards'
import PendingQueue from '@/components/home/PendingQueue'
import RunningTasks from '@/components/home/RunningTasks'
import WarningBanner from '@/components/home/WarningBanner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { repeatIssue, comments } from '@/data/mockData'
import { MessageSquare } from 'lucide-react'

export default function HomePage() {
  const { tasks } = useApp()

  const pending = tasks.filter(t => t.status === 'pending')
  const running = tasks.filter(t => t.status === 'running')
  const done = tasks.filter(t => t.status === 'done')

  const totalReviewed = done.length + pending.length
  const accuracy = totalReviewed > 0 ? 87.5 : 0

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          現在、確認待ちの重要タスクが {pending.length} 件あります。
        </h1>
        <p className="text-muted-foreground mt-1">
          本日のオペレーション状況。承認待ち案件とAIエージェントの稼働状況を一覧できます。
        </p>
      </div>

      <KpiCards
        pending={pending.length}
        done={done.length}
        running={running.length}
        accuracy={accuracy}
      />

      <WarningBanner issue={repeatIssue} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PendingQueue tasks={pending} />
        <RunningTasks tasks={running} />
      </div>

      {/* Recent corrections — surfacing unused comments[] data */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            直近の修正コメント
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            担当者のフィードバックがナレッジとして蓄積され、AIの精度向上に寄与します。
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {comments.slice(0, 4).map(c => (
              <div key={c.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                <span className="text-xs text-muted-foreground shrink-0 w-12">{c.date}</span>
                <span className="text-xs font-medium shrink-0 w-24">{c.author}</span>
                <span className="text-xs text-muted-foreground flex-1">{c.text}</span>
                <span className="text-[10px] text-muted-foreground/60 shrink-0">{c.stepName}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
