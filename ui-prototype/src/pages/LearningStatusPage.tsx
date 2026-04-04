import LearningKpi from '@/components/learning/LearningKpi'
import AccuracyChart from '@/components/learning/AccuracyChart'
import WorkflowTable from '@/components/learning/WorkflowTable'
import CommentImpact from '@/components/learning/CommentImpact'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { learningSummary, weeklyMetrics, workflows, commentImpact, comments } from '@/data/mockData'
import { Sparkles, TrendingUp, MessageSquare } from 'lucide-react'

export default function LearningStatusPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">学習状況 — 直近3ヶ月</h1>
        <p className="text-muted-foreground mt-1">
          AIの学習進捗と品質推移。修正コメントがどのように精度向上に寄与しているかを確認できます。
        </p>
      </div>

      {/* Weekly highlights */}
      <Card className="border-emerald-200 bg-emerald-50/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            今週のハイライト
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { icon: TrendingUp, text: 'Tx domestic の正答率が昇格閾値（95%）を突破 — 96.8% に到達', badge: '昇格候補' },
              { icon: MessageSquare, text: 'PDF確認ルールの追加提案が承認済み — 送金・請求書業務に適用', badge: '提案承認' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <item.icon className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{item.text}</span>
                <Badge variant="secondary" className="text-[10px] shrink-0">{item.badge}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <LearningKpi
        total={learningSummary.total}
        accuracy={learningSummary.accuracy}
        knowledge={learningSummary.knowledge}
      />

      <AccuracyChart data={weeklyMetrics} />

      {/* Section header */}
      <div>
        <h2 className="text-base font-semibold">業務別の精度と信頼レベル</h2>
        <p className="text-xs text-muted-foreground mt-1">
          各業務の正答率が閾値を超えると、信頼レベルの昇格が提案されます。
        </p>
      </div>

      <WorkflowTable workflows={workflows} />

      {/* Section header */}
      <div>
        <h2 className="text-base font-semibold">フィードバックループの効果</h2>
        <p className="text-xs text-muted-foreground mt-1">
          担当者の修正コメントがAIの品質向上にどう反映されたかの全体像。
        </p>
      </div>

      <CommentImpact {...commentImpact} />

      {/* Corrections timeline */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            直近の修正コメント
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {comments.map(c => (
              <div key={c.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                <span className="text-xs text-muted-foreground shrink-0 w-12">{c.date}</span>
                <span className="text-xs font-medium shrink-0 w-24">{c.author}</span>
                <span className="text-xs text-muted-foreground flex-1">{c.text}</span>
                <Badge variant="outline" className="text-[10px] shrink-0">{c.stepName}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
