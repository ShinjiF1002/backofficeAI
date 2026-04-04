import { useApp } from '@/context/AppContext'
import ProposalCard from '@/components/proposal/ProposalCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { knowledgeItems } from '@/data/mockData'
import { Info, Lightbulb, BookOpen } from 'lucide-react'

export default function ProposalReviewPage() {
  const { proposals, updateProposalStatus } = useApp()

  const counts = {
    open: proposals.filter(p => p.status === 'open').length,
    approved: proposals.filter(p => p.status === 'approved').length,
    rejected: proposals.filter(p => p.status === 'rejected').length,
    held: proposals.filter(p => p.status === 'held').length,
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">変更提案レビュー</h1>
        <p className="text-muted-foreground mt-1">
          AIが修正コメントのパターンから自動生成した手順変更の提案です。承認すると、すべてのAIエージェントの動作に反映されます。
        </p>
      </div>

      {/* Summary stats */}
      <div className="flex gap-4">
        {[
          { label: '未対応', value: counts.open, variant: 'default' as const },
          { label: '承認済', value: counts.approved, variant: 'secondary' as const },
          { label: '却下', value: counts.rejected, variant: 'secondary' as const },
          { label: '保留', value: counts.held, variant: 'secondary' as const },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{s.label}</span>
            <Badge variant={s.variant}>{s.value}</Badge>
          </div>
        ))}
      </div>

      {/* Tier 2 explanation */}
      <Alert className="border-slate-300 bg-slate-50 [&>svg]:text-slate-500">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          提案は <strong>Tier 2（手順定義・ガードレール）</strong>の変更です。
          ナレッジ（Tier 1）と異なり、どんな変更も人間の承認が必須です。
          承認された提案は即座にすべてのAIエージェントの実行ルールに反映されます。
        </AlertDescription>
      </Alert>

      {/* Proposal cards */}
      <div className="space-y-4">
        {proposals.map(proposal => (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            onStatusChange={updateProposalStatus}
          />
        ))}
      </div>

      {proposals.length === 0 && (
        <p className="text-muted-foreground text-center py-12">提案はありません</p>
      )}

      {/* Knowledge section — surfacing unused knowledgeItems[] */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            蓄積されたナレッジ（Tier 1 — リアルタイム反映済み）
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            修正コメントから自動生成された知見。提案（Tier 2）と異なり、人間の承認なしでAIが即座に参照します。
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {knowledgeItems.map(k => (
              <div key={k.id} className="flex items-center justify-between py-2 px-3 rounded-md bg-teal-50/50 border border-teal-100">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-3.5 w-3.5 text-teal-600" />
                  <span className="text-sm">{k.text}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>参照元: {k.sourceCount}件</span>
                  <span>使用: {k.usageCount}回</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
