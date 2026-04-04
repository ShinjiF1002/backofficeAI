import type { Task, Step } from '@/data/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ChecksList from './ChecksList'

interface DetailPanelProps {
  task: Task
  currentStep: Step
}

export default function DetailPanel({ task, currentStep }: DetailPanelProps) {
  const hasFailedCheck = currentStep.checks.some(c => c.status === 'ng')

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Left: Active screen simulation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">操作画面</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-6 space-y-4 border border-dashed border-muted-foreground/20">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">画面上の金額</span>
                <span className="text-sm font-mono font-semibold">
                  {hasFailedCheck ? '1,250,000' : '1,250,000'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">書類上の金額</span>
                <span className={`text-sm font-mono font-semibold ${hasFailedCheck ? 'text-red-600' : ''}`}>
                  {hasFailedCheck ? '1,350,000' : '1,250,000'}
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-muted-foreground/10 text-xs text-muted-foreground">
              スクリーンショット（プレースホルダー） — {task.workflowName} / {currentStep.name}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right: AI judgment and knowledge */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">AI判断と参照知見</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">判断</p>
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              {task.aiJudgment ?? '判断記録なし'}
            </p>
          </div>

          {task.reusedKnowledge && task.reusedKnowledge.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-1">参照した知見</p>
              <div className="space-y-1">
                {task.reusedKnowledge.map((note, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">知見</Badge>
                    <span className="text-sm">{note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-sm font-medium mb-2">チェック結果</p>
            <ChecksList checks={currentStep.checks} />
          </div>

          {task.pastApproved !== undefined && (
            <div className="pt-2 border-t text-sm text-muted-foreground">
              実績: {task.pastApproved} 件承認 / {task.pastSentBack ?? 0} 件差し戻し
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
