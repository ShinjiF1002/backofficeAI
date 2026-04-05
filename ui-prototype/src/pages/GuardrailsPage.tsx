import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { StatusPill } from '@/components/ui/status-pill'
import { guardrails } from '@/data/mockData'
import { Info, ShieldCheck, ShieldAlert } from 'lucide-react'

export default function GuardrailsPage() {
  const errorCount = guardrails.filter(g => g.severity === 'error').length
  const warningCount = guardrails.filter(g => g.severity === 'warning').length

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal leading-[1.4]">チェックルール（ガードレール）</h1>
        <p className="text-muted-foreground mt-1">
          AI の判断を自動検証するルール。業務の正確性を担保します。
        </p>
      </div>

      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          チェックルールは <strong>手順定義（Tier 2）</strong>と同様、どんな変更も人間の承認が必須です。
          ルール違反を検出した場合、ブロック（処理停止）または警告（確認表示）のいずれかを実施します。
        </AlertDescription>
      </Alert>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-rose-500" />
            <div>
              <p className="text-xs text-muted-foreground">ブロック</p>
              <p className="text-xl font-bold tabular-nums">{errorCount}件</p>
              <p className="text-[10px] text-muted-foreground">違反時に処理を停止</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-xs text-muted-foreground">警告</p>
              <p className="text-xl font-bold tabular-nums">{warningCount}件</p>
              <p className="text-[10px] text-muted-foreground">確認を促すが処理は継続</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guardrails list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">適用中のチェックルール</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {guardrails.map(g => (
              <div key={g.id} className="p-3 rounded-lg border border-border/60 bg-card shadow-[var(--shadow-premium-sm)]">
                <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusPill tone={g.severity === 'error' ? 'rose' : 'amber'}>
                      {g.severity === 'error' ? 'ブロック' : '警告'}
                    </StatusPill>
                    <span className="text-sm font-semibold">{g.jpName}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-num tabular-nums shrink-0">
                    直近 {g.firedCount} 回発火
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{g.description}</p>
                <div className="flex flex-wrap gap-1">
                  {g.appliesToJp.map(ap => (
                    <Badge key={ap} variant="secondary" className="text-[10px]">
                      {ap}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
