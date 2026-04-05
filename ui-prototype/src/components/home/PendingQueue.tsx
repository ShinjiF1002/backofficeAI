import { useNavigate } from 'react-router-dom'
import type { Task } from '@/data/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import CategoryIcon from '@/components/shared/CategoryIcon'
import ConfidenceBadge from '@/components/shared/ConfidenceBadge'
import { ListRowCard } from '@/components/shared/ListRowCard'

interface PendingQueueProps {
  tasks: Task[]
}

export default function PendingQueue({ tasks }: PendingQueueProps) {
  const navigate = useNavigate()
  const count = tasks.length

  return (
    <Card id="pending" className="relative scroll-mt-20">
      {/* amber gradient accent top stripe */}
      <span
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
      />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              aria-hidden
              className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)] shrink-0"
            />
            <h2 className="text-base font-semibold leading-[1.4] truncate">承認待ちキュー</h2>
          </div>
          {count > 0 && (
            <span className="text-[11px] font-medium text-muted-foreground tabular-nums shrink-0">
              {count} 件
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">AI の実行結果を確認し、承認または差し戻しを行ってください</p>
      </CardHeader>
      <CardContent>
        {count === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">承認待ちの案件はありません</p>
        ) : (
          <div className="space-y-2">
            {tasks.map(task => {
              const currentStep = task.steps.find(s => s.status === 'current')
              const hasFailedCheck = currentStep?.checks.some(c => c.status === 'ng') ?? false
              const primaryData = task.keyData[0]
              const secondaryData = task.keyData[1]
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
                    <span className="flex flex-wrap gap-x-1.5 gap-y-0 items-baseline min-w-0">
                      {primaryData?.value && <span className="truncate">{primaryData.value}</span>}
                      {secondaryData?.value && (
                        <>
                          <span className="text-muted-foreground/50" aria-hidden>/</span>
                          <span className="truncate">{secondaryData.value}</span>
                        </>
                      )}
                    </span>
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
