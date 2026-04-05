import { useApp } from '@/context/AppContext'
import ProposalCard from '@/components/proposal/ProposalCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { batchProposals } from '@/data/mockData'
import { Info, Package } from 'lucide-react'

export default function ProposalReviewPage() {
  const { proposals, updateProposalStatus } = useApp()

  const counts = {
    open: proposals.filter(p => p.status === 'open').length,
    approved: proposals.filter(p => p.status === 'approved').length,
    rejected: proposals.filter(p => p.status === 'rejected').length,
    held: proposals.filter(p => p.status === 'held').length,
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal leading-[1.4]">変更提案レビュー</h1>
        <p className="text-muted-foreground mt-1">
          AI が修正コメントのパターンから自動生成した手順変更の提案です。承認すると、すべての AI エージェントの動作に反映されます。
        </p>
      </div>

      {/* Status summary */}
      <div className="flex gap-4 flex-wrap">
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
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          これらの提案は <strong>手順定義・チェックルール（Tier 2）</strong>の変更です。
          ナレッジ（Tier 1）と異なり、どんな変更も人間の承認が必須です。
          承認された提案は即座にすべての AI エージェントに反映されます。
        </AlertDescription>
      </Alert>

      {/* 個別提案 */}
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

      {/* バッチ提案（ブートストラップ時の一括レビュー、architecture.md §6） */}
      {batchProposals.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              初回一括レビュー（ブートストラップ）
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              マニュアルから自動生成された手順のバッチレビュー。個別に承認/却下/保留を選択できます。
            </p>
          </CardHeader>
          <CardContent>
            {batchProposals.map(batch => (
              <div key={batch.id} className="space-y-2">
                <p className="text-xs text-muted-foreground mb-2">
                  {batch.createdAt} 作成 · {batch.description}
                </p>
                <div className="space-y-1.5">
                  {batch.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/30 border border-border">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{item.procedureJp}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">信頼度 {item.confidence}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.summary}</p>
                      </div>
                      <Badge
                        variant={
                          item.status === 'approved' ? 'default' :
                          item.status === 'rejected' ? 'destructive' :
                          item.status === 'deferred' ? 'secondary' : 'outline'
                        }
                        className="text-[10px] shrink-0"
                      >
                        {item.status === 'approved' ? '承認済' :
                         item.status === 'rejected' ? '却下' :
                         item.status === 'deferred' ? '保留中' : '未対応'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
