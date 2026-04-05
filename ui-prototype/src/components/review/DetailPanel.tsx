import type { Task, Step } from '@/data/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ChecksList from './ChecksList'
import ScreenshotPlaceholder from './ScreenshotPlaceholder'
import { Target, CheckSquare } from 'lucide-react'

interface DetailPanelProps {
  task: Task
  currentStep: Step
}

export default function DetailPanel({ task, currentStep }: DetailPanelProps) {
  const hasFailedCheck = currentStep.checks.some(c => c.status === 'ng')

  return (
    <div className="space-y-4">
      {/* このステップで何を達成すべきか (architecture.md §4: goal + expected_state) */}
      {(currentStep.goal || currentStep.expectedState) && (
        <Card variant="tinted">
          <CardContent className="pt-4 pb-4 space-y-2">
            {currentStep.goal && (
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">このステップの目的</p>
                  <p className="text-sm">{currentStep.goal}</p>
                </div>
              </div>
            )}
            {currentStep.expectedState && (
              <div className="flex items-start gap-2">
                <CheckSquare className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">期待される状態</p>
                  <p className="text-sm">{currentStep.expectedState}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Screenshot — full width */}
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

      {/* AI judgment + checks — 2-column grid below */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">AI の判断</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              {task.aiJudgment ?? '判断記録なし'}
            </p>

            {task.reusedKnowledge && task.reusedKnowledge.length > 0 && (
              <div>
                <p className="text-xs font-medium mb-1.5 text-muted-foreground">参照した組織ナレッジ</p>
                <div className="space-y-1">
                  {task.reusedKnowledge.map((note, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] shrink-0">ナレッジ</Badge>
                      <span className="text-xs">{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">チェック結果</CardTitle>
            <p className="text-[11px] text-muted-foreground">登録済のガードレール（チェックルール）で検証</p>
          </CardHeader>
          <CardContent>
            <ChecksList checks={currentStep.checks} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
