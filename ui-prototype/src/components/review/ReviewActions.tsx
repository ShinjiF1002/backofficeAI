import { Button } from 'crystalline-ui'

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
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <Button variant="secondary" size="tap" onClick={onManualContinue ?? onApprove}>
          手動で続行
        </Button>
        <Button variant="destructive" size="tap" onClick={onSendBack}>
          差し戻し
        </Button>
        <Button variant="secondary" size="tap" onClick={onHold ?? onSendBack}>
          保留
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      <Button variant="primary" size="cta" onClick={onApprove}>
        承認して次へ
      </Button>
      <Button variant="secondary" size="tap" onClick={onSendBack}>
        差し戻し
      </Button>
    </div>
  )
}
