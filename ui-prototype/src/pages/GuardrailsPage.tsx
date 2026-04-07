import {
  Card, CardContent, CardHeader, CardTitle,
  Badge, Alert, AlertDescription,
  StatusPill, type StatusTone,
  Heading, Text, FadeIn,
} from 'crystalline-ui'
import { KpiTile } from '@/components/shared/KpiTile'
import { guardrails } from '@/data/mockData'
import { guardrailSeverityLabels, type GuardrailSeverity } from '@/data/types'
import { Info, ShieldCheck, ShieldAlert } from 'lucide-react'

const severityTone: Record<GuardrailSeverity, StatusTone> = {
  error: 'danger',
  warning: 'warning',
}

export default function GuardrailsPage() {
  const errorCount = guardrails.filter(g => g.severity === 'error').length
  const warningCount = guardrails.filter(g => g.severity === 'warning').length

  return (
    <div className="space-y-6">
      <FadeIn>
        <Heading as="h1">チェックルール（ガードレール）</Heading>
        <Text muted>AI の判断を自動検証するルール。業務の正確性を担保します。</Text>
      </FadeIn>

      <FadeIn index={1}>
        <Alert variant="info">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm leading-[1.4]">
            チェックルールは <strong>手順定義（Tier 2）</strong>と同様、どんな変更も人間の承認が必須です。
            ルール違反を検出した場合、ブロック（処理停止）または警告（確認表示）のいずれかを実施します。
          </AlertDescription>
        </Alert>
      </FadeIn>

      <FadeIn index={2}>
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <KpiTile
            label="ブロック"
            value={errorCount}
            unit="件"
            icon={ShieldAlert}
            tone="rose"
            hint="違反時に処理を停止"
          />
          <KpiTile
            label="警告"
            value={warningCount}
            unit="件"
            icon={ShieldCheck}
            tone="amber"
            hint="確認を促すが処理は継続"
          />
        </div>
      </FadeIn>

      {/* Guardrails list */}
      <FadeIn index={3}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base leading-[1.4]">適用中のチェックルール</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {guardrails.map(g => {
              const visible = g.appliesToJp.slice(0, 2)
              const hidden = g.appliesToJp.length - visible.length
              return (
                <Card key={g.id} variant="default" size="sm">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <StatusPill tone={severityTone[g.severity]}>
                          {guardrailSeverityLabels[g.severity]}
                        </StatusPill>
                        <span className="text-sm font-semibold leading-[1.4]">{g.jpName}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-num tabular-nums shrink-0">
                        直近 {g.firedCount} 回発火
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 leading-[1.4]">{g.description}</p>
                    {/* desktop: 全件 / mobile: 先頭 2 件 + 他N件 */}
                    <div className="hidden sm:flex flex-wrap gap-1">
                      {g.appliesToJp.map(ap => (
                        <Badge key={ap} variant="secondary" className="text-[10px]">{ap}</Badge>
                      ))}
                    </div>
                    <div className="sm:hidden flex flex-wrap gap-1">
                      {visible.map(ap => (
                        <Badge key={ap} variant="secondary" className="text-[10px]">{ap}</Badge>
                      ))}
                      {hidden > 0 && (
                        <Badge variant="outline" className="text-[10px]">+{hidden}件</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
      </FadeIn>
    </div>
  )
}
