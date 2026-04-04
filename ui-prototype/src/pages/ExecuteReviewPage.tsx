import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import StepProgress from '@/components/review/StepProgress'
import DetailPanel from '@/components/review/DetailPanel'
import CheckFailedAlert from '@/components/review/CheckFailedAlert'
import ReviewActions from '@/components/review/ReviewActions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function ExecuteReviewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { tasks, approveTask } = useApp()

  const task = tasks.find(t => t.id === id)
  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">案件が見つかりません: {id}</p>
        <Button variant="outline" onClick={() => navigate('/')}>ホームに戻る</Button>
      </div>
    )
  }

  const currentStep = task.steps.find(s => s.status === 'current')
  const hasFailedCheck = currentStep?.checks.some(c => c.status === 'ng') ?? false

  const handleApprove = () => {
    approveTask(task.id)
    navigate('/')
  }

  const handleSendBack = () => {
    navigate(`/tasks/${task.id}/comment`)
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>← 戻る</Button>
          <h1 className="text-2xl font-semibold tracking-tight">{task.id}</h1>
          <Badge variant="secondary">{task.workflowName}</Badge>
        </div>
        <p className="text-muted-foreground mt-1 ml-[68px]">
          AIの実行結果を確認し、承認または差し戻しを判断してください。
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">進捗</CardTitle>
        </CardHeader>
        <CardContent>
          <StepProgress steps={task.steps} />
        </CardContent>
      </Card>

      {hasFailedCheck && currentStep && (
        <CheckFailedAlert checks={currentStep.checks} />
      )}

      {currentStep && (
        <DetailPanel task={task} currentStep={currentStep} />
      )}

      <ReviewActions
        hasFailedCheck={hasFailedCheck}
        onApprove={handleApprove}
        onSendBack={handleSendBack}
      />
    </div>
  )
}
