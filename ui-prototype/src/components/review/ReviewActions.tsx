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
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <Button variant="outline" className="h-10 md:h-8" onClick={onManualContinue ?? onApprove}>
          手動で続行
        </Button>
        <Button variant="destructive" className="h-10 md:h-8" onClick={onSendBack}>
          差し戻し
        </Button>
        <Button variant="secondary" className="h-10 md:h-8" onClick={onHold ?? onSendBack}>
          保留
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      <Button className="h-10 md:h-8" onClick={onApprove}>
        承認して次へ
      </Button>
      <Button variant="outline" className="h-10 md:h-8" onClick={onSendBack}>
        差し戻し
      </Button>
    </div>
  )
}
