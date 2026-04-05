import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import ModeComparison from '@/components/upgrade/ModeComparison'
import UpgradeDetail from '@/components/upgrade/UpgradeDetail'
import PageHeader from '@/components/shared/PageHeader'
import { Num } from '@/components/shared/Num'
import { upgradeTarget, workflows } from '@/data/mockData'
import { trustModeLabels } from '@/data/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, Info, AlertTriangle, ArrowRight, ChevronRight } from 'lucide-react'

const tintClasses = {
  emerald: 'border-emerald-200/60 bg-emerald-50/40',
  amber:   'border-amber-200/60 bg-amber-50/40',
  slate:   'border-slate-200/60 bg-slate-50/40',
} as const

export default function UpgradePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { upgradeApproved, approveUpgrade } = useApp()

  const wfId = searchParams.get('wf')
  const selectedWf = wfId ? workflows.find(w => w.id === wfId) : null

  // 昇格候補の workflow（昇格可能 + 現在 supervised モード）
  const candidates = workflows.filter(w => w.recommendation.kind === 'ready_to_upgrade')

  const keepHuman = upgradeTarget.steps.filter(s => s.next === 'human').map(s => s.name)
  const autoRun = upgradeTarget.steps.filter(s => s.next === 'ai').map(s => s.name)

  // 対象未指定時: 候補一覧を表示
  if (!wfId || !selectedWf) {
    return (
      <div className="space-y-6 max-w-4xl">
        <PageHeader
          title="信頼レベル昇格"
          subtitle="実績が十分な業務について、承認作業を段階的に削減します"
        />

        <Alert variant="info">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm leading-[1.4]">
            <strong>信頼レベル昇格とは:</strong> 十分な実績を積んだ業務について、人間の承認ステップを削減し処理効率を向上させます。
            高リスクステップ（金額確認、最終承認など）は常に人間が確認します。
          </AlertDescription>
        </Alert>

        {candidates.length > 0 ? (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base leading-[1.4]">昇格候補の業務</CardTitle>
              <p className="text-xs text-muted-foreground leading-[1.4]">精度が昇格閾値（95%）を超過し、十分な実績を積んだ業務</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {candidates.map(wf => (
                  <button
                    key={wf.id}
                    onClick={() => navigate(`/upgrade?wf=${wf.id}`)}
                    className={`w-full text-left p-3 rounded-lg border transition-all hover-lift shadow-[var(--shadow-premium-sm)] flex items-center justify-between gap-3 ${tintClasses.emerald}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-[1.4]">{wf.jpName}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 flex-wrap">
                        <span>精度 <strong className="text-emerald-600 tabular-nums"><Num>{wf.accuracy}</Num>%</strong></span>
                        <span className="text-muted-foreground/50">·</span>
                        <span>処理件数 <strong className="tabular-nums"><Num>{wf.totalCases}</Num>件</strong></span>
                        <span className="text-muted-foreground/50">·</span>
                        <span>現在: {trustModeLabels[wf.trustMode]}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground text-sm leading-[1.4]">現在、昇格候補の業務はありません</p>
              <p className="text-xs text-muted-foreground mt-1 leading-[1.4]">
                業務の精度が昇格閾値（95%）を超えると、ここに候補として表示されます
              </p>
            </CardContent>
          </Card>
        )}

        {/* 自動降格の安全装置 */}
        <Card className={tintClasses.amber}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 leading-[1.4]">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              自動降格の安全装置
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p className="leading-[1.4]">昇格後も、以下の場合は自動的に全ステップ承認モードに戻ります:</p>
            <ul className="space-y-1 ml-4 text-xs leading-[1.5]">
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">・</span>
                <span>精度が <strong className="text-amber-700"><Num>90</Num>%</strong> を下回った場合</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">・</span>
                <span>画面レイアウトの変更（UI 乖離）を検知した場合</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">・</span>
                <span>高リスク業務（高額送金など）は、どれだけ実績を積んでも完全自律化されません</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 昇格承認後の画面
  if (upgradeApproved) {
    return (
      <div className="space-y-8 max-w-4xl">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          <p className="text-lg font-medium leading-[1.4]">昇格を承認しました</p>
          <p className="text-muted-foreground text-center leading-[1.4]">
            {selectedWf.jpName} を {trustModeLabels[upgradeTarget.nextMode]} モードに昇格しました
          </p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base leading-[1.4]">変更内容</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
              <Card size="sm" className={tintClasses.slate}>
                <CardContent className="py-3">
                  <p className="text-xs text-muted-foreground mb-1 leading-[1.4]">変更前</p>
                  <p className="font-medium leading-[1.4]">
                    {trustModeLabels[upgradeTarget.currentMode]}（<Num>{upgradeTarget.currentApprovals}</Num> 回承認）
                  </p>
                </CardContent>
              </Card>
              <Card size="sm" className={tintClasses.emerald}>
                <CardContent className="py-3">
                  <p className="text-xs text-muted-foreground mb-1 leading-[1.4]">変更後</p>
                  <p className="font-medium text-emerald-700 leading-[1.4]">
                    {trustModeLabels[upgradeTarget.nextMode]}（<Num>{upgradeTarget.nextApprovals}</Num> 回承認）
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base leading-[1.4]">次のステップ</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2 leading-[1.4]">
            <p>チェックポイント承認モードでの稼働を開始しました。次回以降のタスクから適用されます。</p>
            <p>現在実行中のタスクには影響しません。</p>
            <p>精度が 90% を下回った場合、自動的に全ステップ承認モードに戻ります（自動降格）。</p>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button variant="brand" size="cta" onClick={() => navigate('/home')}>ホームに戻る</Button>
          <Button variant="outline" size="tap" onClick={() => navigate('/learning')}>学習状況を確認</Button>
        </div>
      </div>
    )
  }

  // 昇格承認前の画面
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
        <button onClick={() => navigate('/upgrade')} className="hover:text-foreground">信頼レベル昇格</button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">{selectedWf.jpName}</span>
      </div>

      <PageHeader
        title={`昇格の確認: ${selectedWf.jpName}`}
        subtitle="AI の実績に基づいて、承認プロセスを効率化します"
      />

      {/* 1. 昇格要件のクリア状況 */}
      <Card className={tintClasses.emerald}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base leading-[1.4]">昇格要件のクリア状況</CardTitle>
          <p className="text-xs text-muted-foreground leading-[1.4]">この昇格が提案されている客観的な根拠</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              `連続正常処理: ${upgradeTarget.reason.cleanRuns} 件（差し戻しゼロ）`,
              `精度: ${upgradeTarget.reason.accuracy}%（閾値 95% を超過）`,
              `学習済み差し戻し: ${upgradeTarget.reason.sendBacksLearned} 件（過去の指摘を学習済）`,
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-sm leading-[1.4]">{text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2. 自動降格ルールゲージ */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base leading-[1.4]">自動降格ルール</CardTitle>
          <p className="text-xs text-muted-foreground leading-[1.4]">精度が閾値を下回ると、自動的に全ステップ承認に戻ります</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-600 font-medium tabular-nums">降格閾値: <Num>{upgradeTarget.demotionThreshold}</Num>%</span>
              <span className="text-emerald-600 font-medium tabular-nums">現在: <Num>{upgradeTarget.currentAccuracy}</Num>%</span>
            </div>
            <div className="relative h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-500"
                style={{ width: '100%' }}
              />
              <div
                className="absolute inset-y-0 w-0.5 bg-amber-600"
                style={{ left: `${upgradeTarget.demotionThreshold}%` }}
                title="降格閾値"
              />
              <div
                className="absolute -top-1 w-2 h-5 bg-primary rounded-full border-2 border-white shadow"
                style={{ left: `calc(${upgradeTarget.currentAccuracy}% - 4px)` }}
                title="現在の精度"
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground tabular-nums">
              <span>80%</span>
              <span>90%</span>
              <span>100%</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 leading-[1.4]">
            降格閾値まで <strong className="text-emerald-600 tabular-nums">+<Num>{(upgradeTarget.currentAccuracy - upgradeTarget.demotionThreshold).toFixed(1)}</Num>%</strong> の余裕があります
          </p>
        </CardContent>
      </Card>

      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm leading-[1.4]">
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
        workflowName={selectedWf.jpName}
        reason={upgradeTarget.reason}
        safety={upgradeTarget.safety}
        keepHuman={keepHuman}
        autoRun={autoRun}
      />

      {/* 5. Impact summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base leading-[1.4]">期待される効果</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
            {[
              { label: '承認回数', before: `${upgradeTarget.currentApprovals}回`, after: `${upgradeTarget.nextApprovals}回`, change: `${Math.round((1 - upgradeTarget.nextApprovals / upgradeTarget.currentApprovals) * 100)}%削減` },
              { label: '担当者の関与時間', before: '約15分', after: '約6分', change: '60%短縮' },
              { label: '高リスクステップ', before: '人間承認', after: '人間承認を維持', change: '変更なし' },
            ].map(item => (
              <Card key={item.label} size="sm" className={tintClasses.slate}>
                <CardContent className="text-center py-3">
                  <p className="text-xs text-muted-foreground mb-1 leading-[1.4]">{item.label}</p>
                  <div className="flex items-center justify-center gap-1.5 text-sm flex-wrap">
                    <span className="text-muted-foreground">{item.before}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                    <span className="font-semibold">{item.after}</span>
                  </div>
                  <p className="text-[11px] text-emerald-600 mt-1 leading-[1.4]">{item.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 6. Risk warning */}
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-sm leading-[1.4]">
          <strong>注意:</strong> チェックポイント承認モードでは、AI 自動実行ステップ（{autoRun.join('、')}）の途中で人間が介入することはできません。
          精度が 90% を下回った場合、自動的に全ステップ承認モードに戻ります。
        </AlertDescription>
      </Alert>

      <div className="flex flex-wrap gap-2 sm:gap-3 pt-2">
        <Button variant="brand" size="cta" onClick={approveUpgrade}>昇格を承認</Button>
        <Button variant="outline" size="tap" onClick={() => navigate('/upgrade')}>キャンセル</Button>
      </div>
    </div>
  )
}
