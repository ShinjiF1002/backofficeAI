import LearningKpi from '@/components/learning/LearningKpi'
import AccuracyChart from '@/components/learning/AccuracyChart'
import WorkflowTable from '@/components/learning/WorkflowTable'
import CommentImpact from '@/components/learning/CommentImpact'
import { learningSummary, weeklyMetrics, workflows, commentImpact } from '@/data/mockData'

export default function LearningStatusPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">学習状況 — 直近3ヶ月</h1>

      <LearningKpi
        total={learningSummary.total}
        accuracy={learningSummary.accuracy}
        knowledge={learningSummary.knowledge}
      />

      <AccuracyChart data={weeklyMetrics} />

      <WorkflowTable workflows={workflows} />

      <CommentImpact {...commentImpact} />
    </div>
  )
}
