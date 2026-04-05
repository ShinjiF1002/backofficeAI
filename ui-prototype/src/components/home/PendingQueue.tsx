import { useNavigate } from 'react-router-dom'
import type { Task } from '@/data/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import CategoryIcon from '@/components/shared/CategoryIcon'
import ConfidenceBadge from '@/components/shared/ConfidenceBadge'
import { ListRowCard } from '@/components/shared/ListRowCard'

interface PendingQueueProps {
  tasks: Task[]
}

export default function PendingQueue({ tasks }: PendingQueueProps) {
  const navigate = useNavigate()

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">承認待ちキュー</CardTitle>
        <p className="text-xs text-muted-foreground">AI の実行結果を確認し、承認または差し戻しを行ってください</p>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">承認待ちの案件はありません</p>
        ) : (
          <div className="space-y-2">
            {tasks.map(task => {
              const currentStep = task.steps.find(s => s.status === 'current')
              const hasFailedCheck = currentStep?.checks.some(c => c.status === 'ng') ?? false
              const primaryData = task.keyData[0]
              return (
                <ListRowCard
                  key={task.id}
                  leading={<CategoryIcon category={task.category} size="md" />}
                  title={
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-semibold truncate">{task.workflowName}</span>
                      {hasFailedCheck && <AlertCircle className="h-3.5 w-3.5 text-warning shrink-0" />}
                    </div>
                  }
                  subtitle={
                    <>
                      {primaryData?.value}
                      {task.keyData[1] && ` / ${task.keyData[1].value}`}
                    </>
                  }
                  meta={task.elapsedLabel}
                  trailing={<ConfidenceBadge confidence={task.confidence} size="sm" />}
                  accent={hasFailedCheck ? 'warning' : 'default'}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  showChevron
                />
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
