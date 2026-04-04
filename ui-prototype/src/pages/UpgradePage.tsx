import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import ModeComparison from '@/components/upgrade/ModeComparison'
import UpgradeDetail from '@/components/upgrade/UpgradeDetail'
import { upgradeTarget } from '@/data/mockData'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2 } from 'lucide-react'

const modeLabels: Record<string, string> = {
  'full-step': '全ステップ承認',
  'checkpoint': 'チェックポイント承認',
  'post-check': '事後確認',
}

export default function UpgradePage() {
  const navigate = useNavigate()
  const { upgradeApproved, approveUpgrade } = useApp()

  const keepHuman = upgradeTarget.steps.filter(s => s.next === 'human').map(s => s.name)
  const autoRun = upgradeTarget.steps.filter(s => s.next === 'ai').map(s => s.name)

  if (upgradeApproved) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <p className="text-lg font-medium">昇格を承認しました</p>
        <p className="text-muted-foreground">
          {upgradeTarget.workflowName} を {modeLabels[upgradeTarget.nextMode]} モードに昇格しました。
        </p>
        <Button variant="outline" onClick={() => navigate('/learning')}>
          学習状況に戻る
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/learning')}>← 戻る</Button>
        <h1 className="text-2xl font-semibold tracking-tight">信頼レベル昇格の確認</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">対象:</span>
        <Badge variant="outline" className="text-sm">{upgradeTarget.workflowName}</Badge>
      </div>

      <ModeComparison
        currentMode={upgradeTarget.currentMode}
        nextMode={upgradeTarget.nextMode}
        currentApprovals={upgradeTarget.currentApprovals}
        nextApprovals={upgradeTarget.nextApprovals}
        steps={upgradeTarget.steps}
      />

      <UpgradeDetail
        workflowName={upgradeTarget.workflowName}
        reason={upgradeTarget.reason}
        safety={upgradeTarget.safety}
        keepHuman={keepHuman}
        autoRun={autoRun}
      />

      <div className="flex gap-3 pt-2">
        <Button onClick={approveUpgrade}>昇格を承認</Button>
        <Button variant="outline" onClick={() => navigate('/learning')}>キャンセル</Button>
      </div>
    </div>
  )
}
