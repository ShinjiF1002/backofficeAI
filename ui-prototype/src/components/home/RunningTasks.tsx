import type { Task } from '@/data/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface RunningTasksProps {
  tasks: Task[]
}

export default function RunningTasks({ tasks }: RunningTasksProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">実行中</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">実行中の案件はありません</p>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => {
              const currentStep = task.steps.find(s => s.status === 'current')
              const total = task.steps.length
              const completedCount = task.steps.filter(s => s.status === 'completed').length

              return (
                <div key={task.id} className="flex items-center justify-between gap-2 py-2 px-3 rounded-md bg-muted/50">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <span className="font-medium text-sm shrink-0">{task.id}</span>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {task.currentStepNum === 0
                        ? '待機中'
                        : `ステップ ${completedCount}/${total}`}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground truncate">
                    {currentStep?.name ?? '待機中'}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
