import type { Task, Step } from '@/data/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ChecksList from './ChecksList'
import ScreenshotPlaceholder from './ScreenshotPlaceholder'

interface DetailPanelProps {
  task: Task
  currentStep: Step
}

export default function DetailPanel({ task, currentStep }: DetailPanelProps) {
  const hasFailedCheck = currentStep.checks.some(c => c.status === 'ng')

  return (
    <div className="space-y-4">
      {/* Screenshot — full width, top position */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">操作画面</CardTitle>
        </CardHeader>
        <CardContent>
          <ScreenshotPlaceholder
            workflowName={task.workflowName}
            stepName={currentStep.name}
            hasError={hasFailedCheck}
            size="full"
          />
        </CardContent>
      </Card>

      {/* AI judgment + checks + knowledge — 2-column grid below */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">AI判断</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              {task.aiJudgment ?? '判断記録なし'}
            </p>

            {task.reusedKnowledge && task.reusedKnowledge.length > 0 && (
              <div>
                <p className="text-xs font-medium mb-1.5 text-muted-foreground">参照した知見</p>
                <div className="space-y-1">
                  {task.reusedKnowledge.map((note, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] shrink-0">知見</Badge>
                      <span className="text-xs">{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {task.pastApproved !== undefined && (
              <div className="pt-2 border-t text-xs text-muted-foreground">
                実績: {task.pastApproved} 件承認 / {task.pastSentBack ?? 0} 件差し戻し
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">チェック結果</CardTitle>
          </CardHeader>
          <CardContent>
            <ChecksList checks={currentStep.checks} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
