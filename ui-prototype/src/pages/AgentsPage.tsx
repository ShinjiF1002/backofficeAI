import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatusPill, type StatusPillTone } from '@/components/ui/status-pill'
import { Num } from '@/components/shared/Num'
import { agents } from '@/data/mockData'
import { Bot, Activity } from 'lucide-react'

const statusMeta: Record<string, { label: string; tone: StatusPillTone; pulse: boolean }> = {
  running:    { label: '稼働中',              tone: 'emerald', pulse: true },
  idle:       { label: '待機中',              tone: 'slate',   pulse: false },
  escalated:  { label: 'エスカレーション中', tone: 'amber',   pulse: true },
  disabled:   { label: '停止中',              tone: 'rose',    pulse: false },
}

export default function AgentsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal leading-[1.4]">AI エージェント</h1>
        <p className="text-muted-foreground mt-1">
          業務ごとに専用の AI エージェントが稼働しています
        </p>
      </div>

      <div className="space-y-3">
        {agents.map(agent => {
          const status = statusMeta[agent.currentStatus]
          return (
            <Card key={agent.id} variant="interactive">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 shadow-[var(--shadow-premium-sm)]">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{agent.jpName}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-[1.5]">{agent.description}</p>
                    </div>
                  </div>
                  <StatusPill tone={status.tone} pulse={status.pulse}>
                    {status.label}
                  </StatusPill>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* 担当業務 */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">担当業務</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.assignedProceduresJp.map(p => (
                      <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                    ))}
                  </div>
                </div>

                {/* 利用ツール */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">利用ツール</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.tools.map(t => (
                      <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                    ))}
                  </div>
                </div>

                {/* 実績 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-border/60">
                  <div>
                    <p className="text-[11px] text-muted-foreground font-semibold leading-[1.4]">直近30日実績</p>
                    <p className="text-sm font-semibold"><Num>{agent.runsLast30d}</Num>件</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground font-semibold leading-[1.4]">精度</p>
                    <p className="text-sm font-semibold"><Num>{agent.accuracyLast30d}</Num>%</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground font-semibold leading-[1.4]">同時実行数</p>
                    <p className="text-sm font-semibold">最大 <Num>{agent.maxConcurrentRuns}</Num></p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground font-semibold leading-[1.4]">タイムアウト</p>
                    <p className="text-sm font-semibold"><Num>{agent.timeoutPerStepSec}</Num>秒/ステップ</p>
                  </div>
                </div>

                {/* 現在の実行 */}
                {agent.currentStatus === 'running' && agent.currentRunId && (
                  <div className="flex items-center gap-2 text-xs bg-primary/5 rounded-md p-2 border border-primary/20">
                    <Activity className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="text-muted-foreground">現在の実行:</span>
                    <Num className="font-medium">{agent.currentRunId}</Num>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
