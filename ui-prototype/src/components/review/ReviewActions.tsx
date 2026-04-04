import { Button } from '@/components/ui/button'

interface ReviewActionsProps {
  hasFailedCheck: boolean
  onApprove: () => void
  onSendBack: () => void
  onManualContinue?: () => void
  onHold?: () => void
}

export default function ReviewActions({
  hasFailedCheck,
  onApprove,
  onSendBack,
  onManualContinue,
  onHold,
}: ReviewActionsProps) {
  if (hasFailedCheck) {
    return (
      <div className="flex gap-3">
        <Button variant="outline" onClick={onManualContinue ?? onApprove}>
          手動で続行
        </Button>
        <Button variant="destructive" onClick={onSendBack}>
          差し戻し
        </Button>
        <Button variant="secondary" onClick={onHold ?? onSendBack}>
          保留
        </Button>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <Button onClick={onApprove}>
        承認して次へ
      </Button>
      <Button variant="outline" onClick={onSendBack}>
        差し戻し
      </Button>
    </div>
  )
}
