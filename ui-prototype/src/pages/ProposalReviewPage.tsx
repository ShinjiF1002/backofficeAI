import { useApp } from '@/context/AppContext'
import ProposalCard from '@/components/proposal/ProposalCard'
import { Badge } from '@/components/ui/badge'

export default function ProposalReviewPage() {
  const { proposals, updateProposalStatus } = useApp()

  const openCount = proposals.filter(p => p.status === 'open').length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">変更提案レビュー</h1>
        <Badge variant="secondary">未対応={openCount}</Badge>
      </div>

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
    </div>
  )
}
