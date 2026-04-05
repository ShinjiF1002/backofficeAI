import { useApp } from '@/context/AppContext'
import ProposalCard from '@/components/proposal/ProposalCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import PageHeader from '@/components/shared/PageHeader'
import { Num } from '@/components/shared/Num'
import { batchProposals } from '@/data/mockData'
import { Info, Package } from 'lucide-react'
import type { BatchProposal } from '@/data/types'

type BatchItemStatus = BatchProposal['items'][number]['status']

const batchStatusLabel: Record<BatchItemStatus, string> = {
  pending: '未対応',
  approved: '承認済',
  rejected: '却下',
  deferred: '保留中',
}

const batchStatusVariant: Record<BatchItemStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'outline',
  approved: 'default',
  rejected: 'destructive',
  deferred: 'secondary',
}

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
      <PageHeader
        title="変更提案レビュー"
        subtitle="AI が修正コメントのパターンから自動生成した手順変更の提案です。承認すると、すべての AI エージェントの動作に反映されます。"
      />

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
            <Badge variant={s.variant} className="tabular-nums">
              <Num>{s.value}</Num>
            </Badge>
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

      {/* POC 初期一括レビュー（architecture.md §6 bootstrap） */}
      {batchProposals.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 leading-[1.4]">
              <Package className="h-4 w-4 text-muted-foreground shrink-0" />
              POC 初期一括レビュー
            </CardTitle>
            <p className="text-xs text-muted-foreground leading-[1.4]">
              マニュアルから自動生成された手順のバッチレビュー。個別に承認/却下/保留を選択できます。
            </p>
          </CardHeader>
          <CardContent>
            {batchProposals.map(batch => (
              <div key={batch.id} className="space-y-2">
                <p className="text-xs text-muted-foreground mb-2 leading-[1.4]">
                  <Num>{batch.createdAt}</Num> 作成 · {batch.description}
                </p>
                <div className="space-y-1.5">
                  {batch.items.map((item, i) => (
                    <Card key={i} size="sm" className="p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium leading-[1.4]">{item.procedureJp}</span>
                            <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                              信頼度 <Num>{item.confidence}</Num>%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-[1.4] mt-0.5">{item.summary}</p>
                        </div>
                        <Badge variant={batchStatusVariant[item.status]} className="text-[10px] shrink-0">
                          {batchStatusLabel[item.status]}
                        </Badge>
                      </div>
                    </Card>
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
