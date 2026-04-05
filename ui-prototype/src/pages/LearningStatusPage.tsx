import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import LearningKpi from '@/components/learning/LearningKpi'
import AccuracyChart from '@/components/learning/AccuracyChart'
import WorkflowTable from '@/components/learning/WorkflowTable'
import CostTrendCard from '@/components/learning/CostTrendCard'
import FlywheelDiagram from '@/components/shared/FlywheelDiagram'
import PageHeader from '@/components/shared/PageHeader'
import { Num } from '@/components/shared/Num'
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
  const driftedMobileVisible = driftedWorkflows.slice(0, 3)
  const driftedMobileHidden = driftedWorkflows.length - driftedMobileVisible.length

  const latestWeek = learningMetrics[learningMetrics.length - 1]
  const firstWeek = learningMetrics[0]
  const approvalsReduced = firstWeek.humanApprovalsRequired - latestWeek.humanApprovalsRequired
  const approvalsReducedPct = Math.round((approvalsReduced / firstWeek.humanApprovalsRequired) * 100)

  // 週次承認グラフのデータ
  const approvalsChartData = learningMetrics.map(m => ({
    name: `W${m.week}`,
    value: m.humanApprovalsRequired,
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="学習状況"
        subtitle="修正コメントがどのように AI の精度向上に寄与しているかを確認できます"
      />

      {/* 乖離検知警告 (architecture.md §10) */}
      {driftedWorkflows.length > 0 && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold leading-[1.4]">UI 変更を検知した業務があります</AlertTitle>
          <AlertDescription className="space-y-2">
            {/* desktop: 全件表示 */}
            <div className="hidden sm:block space-y-2">
              {driftedWorkflows.map(wf => (
                <div key={wf.id} className="text-sm leading-[1.4]">
                  <strong>{wf.jpName}</strong>: {wf.autoDemotedReason}
                  <span className="text-xs text-amber-700 ml-2">
                    （<Num>{wf.autoDemotedAt}</Num> に自動降格）
                  </span>
                </div>
              ))}
            </div>
            {/* mobile: 先頭3件 + 他N件 */}
            <div className="sm:hidden space-y-2">
              {driftedMobileVisible.map(wf => (
                <div key={wf.id} className="text-sm leading-[1.4]">
                  <strong>{wf.jpName}</strong>: {wf.autoDemotedReason}
                </div>
              ))}
              {driftedMobileHidden > 0 && (
                <p className="text-xs text-muted-foreground">他 <Num>{driftedMobileHidden}</Num> 件</p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* フライホイール図（中心的な学習ストーリー） */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base leading-[1.4]">継続的学習の実績（POC 期間累計）</CardTitle>
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
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base leading-[1.4]">業務別の精度と信頼レベル</CardTitle>
          <p className="text-xs text-muted-foreground leading-[1.4]">
            精度が閾値を超えた業務は、信頼レベルの昇格を検討できます
          </p>
        </CardHeader>
        <CardContent>
          <WorkflowTable workflows={workflows} />
        </CardContent>
      </Card>

      {/* 人間承認の削減推移 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base leading-[1.4]">人間の承認作業の推移（週次）</CardTitle>
          <p className="text-xs text-muted-foreground leading-[1.4]">
            学習が進むにつれて、担当者の承認負荷が軽減されます
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={approvalsChartData} margin={{ top: 5, right: 8, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis hide domain={[0, 'dataMax']} />
                <Tooltip
                  formatter={(value) => [`${value}件`, '承認作業']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                  cursor={{ fill: 'rgba(79,70,229,0.06)' }}
                />
                <Bar dataKey="value" fill="#4f46e5" fillOpacity={0.6} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs gap-2">
            <span className="text-muted-foreground tabular-nums">
              W1: <Num>{firstWeek.humanApprovalsRequired}</Num>件/週
            </span>
            <Badge variant="secondary" className="text-xs shrink-0">
              <ArrowRight className="h-3 w-3 mr-1" />
              <Num>{approvalsReducedPct}</Num>% 削減
            </Badge>
            <span className="text-muted-foreground tabular-nums">
              W12: <Num>{latestWeek.humanApprovalsRequired}</Num>件/週
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Recent Corrections canonical 表示 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 leading-[1.4]">
            <MessageSquare className="h-4 w-4" />
            直近の修正コメント
          </CardTitle>
          <p className="text-xs text-muted-foreground leading-[1.4]">担当者のフィードバックがナレッジとして蓄積されます</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {comments.map(c => (
              <div key={c.id} className="py-2 border-b border-border last:border-0">
                <div className="flex items-start gap-3 flex-wrap sm:flex-nowrap">
                  <span className="text-xs text-muted-foreground shrink-0 w-12 font-mono tabular-nums">{c.date}</span>
                  <span className="text-xs font-medium shrink-0 w-20 truncate">{c.author}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs break-words leading-[1.4]">{c.text}</p>
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
