import { useApp } from '@/context/AppContext'
import KpiCards from '@/components/home/KpiCards'
import PendingQueue from '@/components/home/PendingQueue'
import RunningTasks from '@/components/home/RunningTasks'
import WarningBanner from '@/components/home/WarningBanner'
import { repeatIssue } from '@/data/mockData'

export default function HomePage() {
  const { tasks } = useApp()

  const pending = tasks.filter(t => t.status === 'pending')
  const running = tasks.filter(t => t.status === 'running')
  const done = tasks.filter(t => t.status === 'done')

  const totalReviewed = done.length + pending.length
  const accuracy = totalReviewed > 0 ? 87.5 : 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">ホーム</h1>

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
    </div>
  )
}
