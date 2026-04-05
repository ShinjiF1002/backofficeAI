import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import KpiCards from '@/components/home/KpiCards'
import PendingQueue from '@/components/home/PendingQueue'
import RunningTasks from '@/components/home/RunningTasks'
import WarningBanner from '@/components/home/WarningBanner'
import LearningStrip from '@/components/shared/LearningStrip'
import RecentCorrectionsTimeline from '@/components/home/RecentCorrectionsTimeline'
import { Num } from '@/components/shared/Num'
import { repeatIssue, learningMetrics, weeklyMetrics, recentCorrections } from '@/data/mockData'

export default function HomePage() {
  const { tasks, currentUser } = useApp()
  const { hash } = useLocation()

  // BottomNav「承認待ち」タブや通知ベルから /home#pending に来た時にスクロール
  useEffect(() => {
    if (hash === '#pending') {
      const el = document.getElementById('pending')
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
      }
    }
  }, [hash])

  const pending = tasks.filter(t => t.status === 'pending')
  const running = tasks.filter(t => t.status === 'running')
  const done = tasks.filter(t => t.status === 'done')

  // 精度は直近週の学習メトリクスから取得
  const latestAccuracy = weeklyMetrics[weeklyMetrics.length - 1]?.accuracy ?? 0

  // 挨拶の一人称（姓）を抽出
  const lastName = currentUser.name.split(' ')[0] ?? currentUser.name

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-normal leading-[1.4]">
          おはようございます、{lastName}さん
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          <Num>2026年4月5日（金）</Num>
          <span className="mx-2 text-muted-foreground/40" aria-hidden>·</span>
          承認待ちタスクと実行中の AI 業務を確認します
        </p>
      </header>

      <LearningStrip metrics={learningMetrics} />

      <KpiCards
        pending={pending.length}
        done={done.length}
        running={running.length}
        accuracy={latestAccuracy}
      />

      <WarningBanner issue={repeatIssue} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6 min-w-0">
          <PendingQueue tasks={pending} />
          <RunningTasks tasks={running} />
        </div>
        <aside className="xl:col-span-1 xl:sticky xl:top-20 xl:self-start min-w-0">
          <RecentCorrectionsTimeline corrections={recentCorrections} />
        </aside>
      </div>
    </div>
  )
}
