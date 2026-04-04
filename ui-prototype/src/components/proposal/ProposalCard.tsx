import { useState } from 'react'
import type { Proposal } from '@/data/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquareQuote } from 'lucide-react'

interface ProposalCardProps {
  proposal: Proposal
  onStatusChange: (id: string, status: Proposal['status']) => void
}

const riskColors = {
  low: 'bg-emerald-100 text-emerald-800',
  medium: 'bg-amber-100 text-amber-800',
  high: 'bg-red-100 text-red-800',
}

const riskLabels = { low: '低', medium: '中', high: '高' }
const statusLabels = { open: '未対応', approved: '承認済', rejected: '却下', held: '保留' }

export default function ProposalCard({ proposal, onStatusChange }: ProposalCardProps) {
  const [comment, setComment] = useState(proposal.adminComment ?? '')
  const isResolved = proposal.status !== 'open'

  return (
    <Card className={isResolved ? 'opacity-60' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            提案 #{proposal.id}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={riskColors[proposal.riskLevel]}>
              リスク: {riskLabels[proposal.riskLevel]}
            </Badge>
            {isResolved && (
              <Badge variant={proposal.status === 'approved' ? 'default' : 'secondary'}>
                {statusLabels[proposal.status]}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-[80px_1fr] gap-y-2 text-sm">
          <span className="text-muted-foreground font-medium">変更内容</span>
          <span>{proposal.what}</span>
          <span className="text-muted-foreground font-medium">理由</span>
          <span>{proposal.why}</span>
          <span className="text-muted-foreground font-medium">影響範囲</span>
          <span>
            {proposal.scopeWorkflows.join(' + ')} / 直近 {proposal.scopeCaseCount} 件
          </span>
        </div>

        <div>
          <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
            <MessageSquareQuote className="h-3.5 w-3.5" />
            現場の声
          </p>
          <div className="space-y-1.5 pl-1">
            {proposal.voices.map((v, i) => (
              <div key={i} className="text-sm flex gap-2">
                <span className="text-muted-foreground shrink-0">{v.date}</span>
                <span className="font-medium shrink-0">{v.author}:</span>
                <span className="text-muted-foreground">{v.text}</span>
              </div>
            ))}
          </div>
        </div>

        {!isResolved && (
          <>
            <div>
              <p className="text-sm font-medium mb-1.5">管理者コメント</p>
              <Textarea
                placeholder="記録用のメモを入力..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={2}
                className="resize-none text-sm"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={() => onStatusChange(proposal.id, 'approved')}>
                承認
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onStatusChange(proposal.id, 'rejected')}>
                却下
              </Button>
              <Button size="sm" variant="secondary" onClick={() => onStatusChange(proposal.id, 'held')}>
                保留
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
