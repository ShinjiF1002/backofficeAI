import { useApp } from '@/context/AppContext'
import KpiCards from '@/components/home/KpiCards'
import PendingQueue from '@/components/home/PendingQueue'
import RunningTasks from '@/components/home/RunningTasks'
import WarningBanner from '@/components/home/WarningBanner'
import LearningStrip from '@/components/shared/LearningStrip'
import { repeatIssue, learningMetrics, weeklyMetrics } from '@/data/mockData'

export default function HomePage() {
  const { tasks } = useApp()

  const pending = tasks.filter(t => t.status === 'pending')
  const running = tasks.filter(t => t.status === 'running')
  const done = tasks.filter(t => t.status === 'done')

  // 精度は直近週の学習メトリクスから取得
  const latestAccuracy = weeklyMetrics[weeklyMetrics.length - 1]?.accuracy ?? 0

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal leading-[1.4]">本日のオペレーション</h1>
        <p className="text-muted-foreground mt-1">承認待ちタスクと実行中の AI 業務を確認します</p>
      </div>

      <LearningStrip metrics={learningMetrics} />

      <KpiCards
        pending={pending.length}
        done={done.length}
        running={running.length}
        accuracy={latestAccuracy}
      />

      <WarningBanner issue={repeatIssue} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingQueue tasks={pending} />
        <RunningTasks tasks={running} />
      </div>
    </div>
  )
}
