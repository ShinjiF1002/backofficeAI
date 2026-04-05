import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { runHistory } from '@/data/mockData'
import CategoryIcon from '@/components/shared/CategoryIcon'
import { Num } from '@/components/shared/Num'
import { KpiTile } from '@/components/shared/KpiTile'
import { StatusPill, type StatusPillTone } from '@/components/ui/status-pill'
import { Camera, FileText, User, Clock, Database, CheckCircle2, Loader2, Wallet } from 'lucide-react'

const statusMeta: Record<string, { label: string; tone: StatusPillTone }> = {
  completed: { label: '完了', tone: 'emerald' },
  sent_back: { label: '差し戻し', tone: 'amber' },
  failed: { label: '失敗', tone: 'rose' },
  in_progress: { label: '実行中', tone: 'indigo' },
}

function formatElapsed(sec: number): string {
  if (sec < 60) return `${sec}秒`
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return s > 0 ? `${m}分${s}秒` : `${m}分`
}

export default function RunHistoryPage() {
  const totalRuns = runHistory.length
  const completed = runHistory.filter(r => r.status === 'completed').length
  const sentBack = runHistory.filter(r => r.status === 'sent_back').length
  const inProgress = runHistory.filter(r => r.status === 'in_progress').length
  const totalCost = runHistory.reduce((sum, r) => sum + r.apiCostJpy, 0)

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal leading-[1.4]">実行履歴</h1>
        <p className="text-muted-foreground mt-1">
          AI が実行したすべての業務処理の記録。完全な操作証跡を保持しています。
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiTile label="総実行件数" value={totalRuns} unit="件" icon={Database} tone="indigo" />
        <KpiTile label="完了" value={completed} unit="件" icon={CheckCircle2} tone="emerald" />
        <KpiTile label="実行中・差し戻し" value={inProgress + sentBack} unit="件" icon={Loader2} tone="amber" />
        <KpiTile label="API 費用（総計）" value={`¥${totalCost.toLocaleString()}`} icon={Wallet} tone="slate" />
      </div>

      {/* Run list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">実行記録</CardTitle>
          <p className="text-xs text-muted-foreground">各実行には、画面キャプチャ・実行ログ・承認記録・修正コメントが紐づいています</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {runHistory.map(run => {
              const st = statusMeta[run.status]
              return (
                <div key={run.id} className="p-3 rounded-lg border border-border/60 bg-card shadow-[var(--shadow-premium-sm)]">
                  <div className="flex items-start gap-3">
                    <CategoryIcon category={run.procedureCategory} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold">{run.procedureJp}</span>
                          <Num className="text-[11px] text-muted-foreground font-num">{run.id}</Num>
                          <StatusPill tone={st.tone}>{st.label}</StatusPill>
                        </div>
                        <Num className="text-[11px] text-muted-foreground font-num">{run.startedAt}</Num>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatElapsed(run.elapsedSec)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {run.humanApprovals}/{run.stepCount} 承認
                        </span>
                        {run.hasScreenshots && (
                          <span className="flex items-center gap-1 text-primary/70">
                            <Camera className="h-3 w-3" />
                            画面キャプチャあり
                          </span>
                        )}
                        {run.hasFeedback && (
                          <span className="flex items-center gap-1 text-amber-600">
                            <FileText className="h-3 w-3" />
                            修正コメントあり
                          </span>
                        )}
                        <span className="ml-auto"><Num>¥{run.apiCostJpy}</Num></span>
                      </div>
                      {run.approvedBy && (
                        <p className="text-[11px] text-muted-foreground mt-1">
                          承認者: <strong>{run.approvedBy}</strong>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
