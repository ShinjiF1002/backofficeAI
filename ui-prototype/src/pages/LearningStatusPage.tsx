import LearningKpi from '@/components/learning/LearningKpi'
import AccuracyChart from '@/components/learning/AccuracyChart'
import WorkflowTable from '@/components/learning/WorkflowTable'
import CostTrendCard from '@/components/learning/CostTrendCard'
import FlywheelDiagram from '@/components/shared/FlywheelDiagram'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  learningSummary, weeklyMetrics, workflows, comments,
  learningMetrics, costMetrics,
} from '@/data/mockData'
import { errorCategoryLabels } from '@/data/types'
import { MessageSquare, AlertTriangle, ArrowRight } from 'lucide-react'
import { CorrectionDiff } from '@/components/shared/CorrectionDiff'

export default function LearningStatusPage() {
  // 累計
  const cumulative = learningMetrics.reduce(
    (acc, m) => ({
      corrections: acc.corrections + m.correctionsIn,
      knowledge: m.knowledgeCompiled,
      proposals: acc.proposals + m.proposalsGenerated,
      approved: acc.approved + m.proposalsApproved,
    }),
    { corrections: 0, knowledge: 0, proposals: 0, approved: 0 }
  )

  // 乖離検知された業務
  const driftedWorkflows = workflows.filter(w => w.driftDetected)

  const latestWeek = learningMetrics[learningMetrics.length - 1]
  const firstWeek = learningMetrics[0]
  const approvalsReduced = firstWeek.humanApprovalsRequired - latestWeek.humanApprovalsRequired

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal leading-[1.4]">学習状況</h1>
        <p className="text-muted-foreground mt-1">
          修正コメントがどのように AI の精度向上に寄与しているかを確認できます
        </p>
      </div>

      {/* 乖離検知警告 (architecture.md §10) */}
      {driftedWorkflows.length > 0 && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold">UI 変更を検知した業務があります</AlertTitle>
          <AlertDescription className="space-y-2">
            {driftedWorkflows.map(wf => (
              <div key={wf.id} className="text-sm">
                <strong>{wf.jpName}</strong>: {wf.autoDemotedReason}
                <span className="text-xs text-amber-700 ml-2">（{wf.autoDemotedAt} に自動降格）</span>
              </div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* フライホイール図（中心的な学習ストーリー） */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">継続的学習の実績（POC 期間累計）</CardTitle>
        </CardHeader>
        <CardContent>
          <FlywheelDiagram
            correctionsIn={cumulative.corrections}
            knowledgeCompiled={cumulative.knowledge}
            proposalsGenerated={cumulative.proposals}
            proposalsApproved={cumulative.approved}
            variant="detailed"
          />
        </CardContent>
      </Card>

      <LearningKpi
        total={learningSummary.total}
        accuracy={learningSummary.accuracy}
        knowledge={learningSummary.knowledge}
        humanApprovalsReduced={approvalsReduced}
      />

      {/* 精度推移チャート */}
      <AccuracyChart data={weeklyMetrics} />

      {/* コスト推移 */}
      <CostTrendCard metrics={costMetrics} />

      {/* 業務別の精度と信頼レベル */}
      <div>
        <h2 className="text-base font-semibold">業務別の精度と信頼レベル</h2>
        <p className="text-xs text-muted-foreground mt-1">
          精度が閾値を超えた業務は、信頼レベルの昇格を検討できます
        </p>
      </div>
      <WorkflowTable workflows={workflows} />

      {/* 人間承認の削減推移 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">人間の承認作業の推移（週次）</CardTitle>
          <p className="text-xs text-muted-foreground">
            学習が進むにつれて、担当者の承認負荷が軽減されます
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-0.5 h-20">
            {learningMetrics.map(m => {
              const maxVal = Math.max(...learningMetrics.map(x => x.humanApprovalsRequired))
              const heightPct = (m.humanApprovalsRequired / maxVal) * 100
              return (
                <div key={m.week} className="flex-1 flex flex-col items-center gap-1" title={`${m.weekLabel}: ${m.humanApprovalsRequired}件`}>
                  <div
                    className="w-full rounded-t bg-primary/30 hover:bg-primary/60 transition-colors"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-muted-foreground tabular-nums">
              W1: {firstWeek.humanApprovalsRequired}件 / 週
            </span>
            <Badge variant="secondary" className="text-xs">
              <ArrowRight className="h-3 w-3 mr-1" />
              {Math.round((approvalsReduced / firstWeek.humanApprovalsRequired) * 100)}% 削減
            </Badge>
            <span className="text-muted-foreground tabular-nums">
              W12: {latestWeek.humanApprovalsRequired}件 / 週
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Recent Corrections canonical 表示 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            直近の修正コメント
          </CardTitle>
          <p className="text-xs text-muted-foreground">担当者のフィードバックがナレッジとして蓄積されます</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {comments.map(c => (
              <div key={c.id} className="py-2 border-b border-border last:border-0">
                <div className="flex items-start gap-3 flex-wrap sm:flex-nowrap">
                  <span className="text-xs text-muted-foreground shrink-0 w-12 font-mono">{c.date}</span>
                  <span className="text-xs font-medium shrink-0 w-20 truncate">{c.author}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs break-words">{c.text}</p>
                    {(c.before || c.after) && (
                      <div className="mt-1">
                        <CorrectionDiff before={c.before} after={c.after} />
                      </div>
                    )}
                  </div>
                  <Badge variant="outline" className="text-[10px] shrink-0">
                    {errorCategoryLabels[c.errorCategory]}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
