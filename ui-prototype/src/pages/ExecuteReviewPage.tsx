import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import StepProgress from '@/components/review/StepProgress'
import DetailPanel from '@/components/review/DetailPanel'
import CheckFailedAlert from '@/components/review/CheckFailedAlert'
import ReviewActions from '@/components/review/ReviewActions'
import {
  Card, CardContent, CardHeader, CardTitle,
  Button, Num, FadeIn, StickyFooter,
  Breadcrumb, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbPage,
} from 'crystalline-ui'
import CategoryIcon from '@/components/shared/CategoryIcon'
import ConfidenceBadge from '@/components/shared/ConfidenceBadge'

export default function ExecuteReviewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { tasks, approveTask } = useApp()

  const task = tasks.find(t => t.id === id)
  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">案件が見つかりません: {id}</p>
        <Button variant="secondary" onClick={() => navigate('/home')}>ホームに戻る</Button>
      </div>
    )
  }

  const currentStep = task.steps.find(s => s.status === 'current')
  const hasFailedCheck = currentStep?.checks.some(c => c.status === 'ng') ?? false

  const handleApprove = () => {
    approveTask(task.id)
    navigate('/home')
  }

  const handleSendBack = () => {
    navigate(`/tasks/${task.id}/comment`)
  }

  return (
    <div className="space-y-6 max-w-4xl pb-24">
      <FadeIn>
        <Breadcrumb>
          <BreadcrumbItem onClick={() => navigate('/home')}>ホーム</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem onClick={() => navigate('/home')}>タスク</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>{task.workflowName} {task.id}</BreadcrumbPage>
        </Breadcrumb>
      </FadeIn>

      <FadeIn index={1}>
        <Card variant="featured">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <CategoryIcon category={task.category} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-semibold leading-[1.4]">{task.workflowName}</h1>
                    <Num className="text-sm text-muted-foreground font-num">{task.id}</Num>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-[1.4]">
                    {currentStep?.name} · {task.elapsedLabel}
                  </p>
                  {task.keyData.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3 pt-3 border-t border-border/60">
                      {task.keyData.map(kd => (
                        <div key={kd.label} className="min-w-0">
                          <p className="text-[11px] text-muted-foreground font-semibold leading-[1.4]">{kd.label}</p>
                          <p className="text-sm font-semibold truncate mt-0.5">{kd.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[11px] text-muted-foreground font-semibold mb-1 leading-[1.4]">AI 信頼度</p>
                <ConfidenceBadge confidence={task.confidence} size="lg" />
                {task.pastApproved !== undefined && (
                  <>
                    <p className="text-[11px] text-muted-foreground mt-2 leading-[1.4]">過去の実績</p>
                    <p className="text-xs font-medium">
                      <Num className="text-emerald-600">{task.pastApproved}</Num>
                      <span className="text-emerald-600">件承認</span>
                      <span className="text-muted-foreground"> / </span>
                      <Num className="text-amber-600">{task.pastSentBack ?? 0}</Num>
                      <span className="text-amber-600">件差し戻し</span>
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn index={2}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">進捗</CardTitle>
          </CardHeader>
          <CardContent>
            <StepProgress steps={task.steps} />
          </CardContent>
        </Card>
      </FadeIn>

      {hasFailedCheck && currentStep && (
        <FadeIn index={3}>
          <CheckFailedAlert checks={currentStep.checks} />
        </FadeIn>
      )}

      {currentStep && (
        <FadeIn index={4}>
          <DetailPanel task={task} currentStep={currentStep} />
        </FadeIn>
      )}

      <StickyFooter>
        <div className="max-w-4xl mx-auto">
          <ReviewActions
            hasFailedCheck={hasFailedCheck}
            onApprove={handleApprove}
            onSendBack={handleSendBack}
          />
        </div>
      </StickyFooter>
    </div>
  )
}
