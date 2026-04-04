import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import ModeComparison from '@/components/upgrade/ModeComparison'
import UpgradeDetail from '@/components/upgrade/UpgradeDetail'
import { upgradeTarget } from '@/data/mockData'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, Info, AlertTriangle, ArrowRight } from 'lucide-react'

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
      <div className="space-y-8 max-w-4xl">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          <p className="text-lg font-medium">昇格を承認しました</p>
          <p className="text-muted-foreground text-center">
            {upgradeTarget.workflowName} を {modeLabels[upgradeTarget.nextMode]} モードに昇格しました。
          </p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">変更内容</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">変更前</p>
                <p className="font-medium">{modeLabels[upgradeTarget.currentMode]}（{upgradeTarget.currentApprovals}回承認）</p>
              </div>
              <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200">
                <p className="text-xs text-muted-foreground mb-1">変更後</p>
                <p className="font-medium text-emerald-700">{modeLabels[upgradeTarget.nextMode]}（{upgradeTarget.nextApprovals}回承認）</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">次のステップ</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>チェックポイント承認モードでの稼働を開始しました。</p>
            <p>正答率が90%を下回った場合、自動的に全ステップ承認モードに戻ります（自動降格）。</p>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={() => navigate('/')}>ホームに戻る</Button>
          <Button variant="outline" onClick={() => navigate('/learning')}>学習状況を確認</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/learning')}>← 戻る</Button>
          <h1 className="text-2xl font-semibold tracking-tight">信頼レベル昇格の確認</h1>
        </div>
        <p className="text-muted-foreground mt-1 ml-[68px]">
          AIの実績に基づいて、承認プロセスを効率化します。
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">対象:</span>
        <Badge variant="outline" className="text-sm">{upgradeTarget.workflowName}</Badge>
      </div>

      {/* 1. Qualification checklist */}
      <Card className="border-emerald-200 bg-emerald-50/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">昇格要件のクリア状況</CardTitle>
          <p className="text-xs text-muted-foreground">この昇格が提案されている客観的な根拠です。</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              `連続正常処理: ${upgradeTarget.reason.cleanRuns}件（差し戻しゼロ）`,
              `正答率: ${upgradeTarget.reason.accuracy}%（閾値 95% を超過）`,
              `学習済み差し戻し: ${upgradeTarget.reason.sendBacksLearned}件（過去の指摘を学習済み）`,
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2. Explanation */}
      <Alert className="border-blue-200 bg-blue-50/50 [&>svg]:text-blue-500">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>信頼レベル昇格とは:</strong> 十分な実績を積んだ業務について、人間の承認ステップを削減し処理効率を向上させます。
          金額確認や最終承認など高リスクステップは常に人間が確認します。
        </AlertDescription>
      </Alert>

      {/* 3. Mode comparison */}
      <ModeComparison
        currentMode={upgradeTarget.currentMode}
        nextMode={upgradeTarget.nextMode}
        currentApprovals={upgradeTarget.currentApprovals}
        nextApprovals={upgradeTarget.nextApprovals}
        steps={upgradeTarget.steps}
      />

      {/* 4. What stays human + what goes AI */}
      <UpgradeDetail
        workflowName={upgradeTarget.workflowName}
        reason={upgradeTarget.reason}
        safety={upgradeTarget.safety}
        keepHuman={keepHuman}
        autoRun={autoRun}
      />

      {/* 5. Impact summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">インパクトサマリー</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: '承認回数', before: `${upgradeTarget.currentApprovals}回`, after: `${upgradeTarget.nextApprovals}回`, change: `${Math.round((1 - upgradeTarget.nextApprovals / upgradeTarget.currentApprovals) * 100)}%削減` },
              { label: '推定処理時間', before: '約15分', after: '約6分', change: '60%短縮' },
              { label: '高リスクステップ', before: '人間承認', after: '人間承認を維持', change: '変更なし' },
            ].map(item => (
              <div key={item.label} className="text-center p-3 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                <div className="flex items-center justify-center gap-1.5 text-sm">
                  <span className="text-muted-foreground">{item.before}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
                  <span className="font-semibold">{item.after}</span>
                </div>
                <p className="text-[11px] text-emerald-600 mt-1">{item.change}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 6. Risk warning */}
      <Alert variant="destructive" className="border-amber-400 bg-amber-50 text-amber-900 [&>svg]:text-amber-600">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>注意:</strong> チェックポイント承認モードでは、AI自動実行ステップ（{autoRun.join('、')}）の途中で人間が介入することはできません。
          正答率が90%を下回った場合、自動的に全ステップ承認モードに戻ります。
        </AlertDescription>
      </Alert>

      <div className="flex gap-3 pt-2">
        <Button onClick={approveUpgrade}>昇格を承認</Button>
        <Button variant="outline" onClick={() => navigate('/learning')}>キャンセル</Button>
      </div>
    </div>
  )
}
