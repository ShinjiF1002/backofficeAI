import type { Task } from '@/data/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CategoryIcon from '@/components/shared/CategoryIcon'

interface RunningTasksProps {
  tasks: Task[]
}

export default function RunningTasks({ tasks }: RunningTasksProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">実行中</CardTitle>
        <p className="text-xs text-muted-foreground">AI が現在処理中の業務</p>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">実行中の案件はありません</p>
        ) : (
          <div className="space-y-2">
            {tasks.map(task => {
              const currentStep = task.steps.find(s => s.status === 'current')
              const total = task.steps.length
              const completedCount = task.steps.filter(s => s.status === 'completed').length
              const progressPct = total > 0 ? (completedCount / total) * 100 : 0
              const isPending = task.currentStepNum === 0
              const primaryData = task.keyData[0]

              return (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-card shadow-[var(--shadow-premium-sm)]">
                  <CategoryIcon category={task.category} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-semibold truncate">{task.workflowName}</span>
                      <span className="text-[11px] font-mono text-muted-foreground shrink-0 tabular-nums">
                        {isPending ? '開始待ち' : `${completedCount}/${total} ステップ`}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mb-1">
                      <div
                        className="h-full rounded-full progress-shimmer-bar transition-all"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate leading-[1.4]">
                      {primaryData ? `${primaryData.value} · ` : ''}
                      {currentStep?.name ?? '待機中'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
