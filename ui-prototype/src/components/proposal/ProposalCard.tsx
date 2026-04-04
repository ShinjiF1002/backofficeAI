import { useState } from 'react'
import type { Proposal } from '@/data/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquareQuote, FileText, TrendingUp } from 'lucide-react'

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
const statusLabels: Record<string, string> = { open: '未対応', approved: '承認済', rejected: '却下', held: '保留' }

export default function ProposalCard({ proposal, onStatusChange }: ProposalCardProps) {
  const [comment, setComment] = useState(proposal.adminComment ?? '')
  const isResolved = proposal.status !== 'open'

  return (
    <Card className={isResolved ? 'opacity-60' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">提案 #{proposal.id}</CardTitle>
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
        {/* What / Why / Scope */}
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1">変更内容</p>
            <p className="text-sm font-semibold">{proposal.what}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1">理由</p>
            <p className="text-sm">{proposal.why}</p>
          </div>
        </div>

        {/* Diff visualization — hardcoded static UI (Proposal type has no diff field) */}
        <div className="rounded-md border bg-muted/30 p-3 space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            変更差分
          </p>
          <div className="text-xs font-mono bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200 line-through">
            - 添付ファイルタブで証憑を確認
          </div>
          <div className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200">
            + 添付ファイルタブで証憑を確認
          </div>
          <div className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200">
            + PDFの場合はスクロールして全ページ確認が必要
          </div>
        </div>

        {/* Impact & expected effect */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2.5 rounded-md bg-muted/50">
            <p className="text-xs text-muted-foreground font-medium mb-1">影響する手順</p>
            <div className="flex flex-wrap gap-1">
              {proposal.scopeWorkflows.map(w => (
                <Badge key={w} variant="outline" className="text-[10px]">{w}</Badge>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">直近 {proposal.scopeCaseCount} 件に適用</p>
          </div>
          <div className="p-2.5 rounded-md bg-emerald-50/50 border border-emerald-100">
            <p className="text-xs text-muted-foreground font-medium mb-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> 期待効果
            </p>
            <p className="text-xs">承認により、同種のミスの再発を防止。</p>
          </div>
        </div>

        {/* Voices */}
        <div>
          <p className="text-xs font-medium mb-2 flex items-center gap-1.5 text-muted-foreground">
            <MessageSquareQuote className="h-3.5 w-3.5" />
            現場の声（根拠となる修正コメント）
          </p>
          <div className="space-y-1.5 pl-1">
            {proposal.voices.map((v, i) => (
              <div key={i} className="text-sm flex gap-2 py-1 px-2 rounded bg-muted/30">
                <span className="text-muted-foreground shrink-0 text-xs">{v.date}</span>
                <span className="font-medium shrink-0 text-xs">{v.author}:</span>
                <span className="text-muted-foreground text-xs">{v.text}</span>
              </div>
            ))}
          </div>
        </div>

        {!isResolved && (
          <>
            <div>
              <p className="text-xs font-medium mb-1.5 text-muted-foreground">管理者コメント</p>
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
