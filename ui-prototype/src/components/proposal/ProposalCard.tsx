import { useState } from 'react'
import type { Proposal } from '@/data/types'
import { changeTypeLabels, riskLevelLabels } from '@/data/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StatusPill, type StatusPillTone } from '@/components/ui/status-pill'
import { MessageSquareQuote, FileText, TrendingUp, Shield } from 'lucide-react'
import { Num } from '@/components/shared/Num'

interface ProposalCardProps {
  proposal: Proposal
  onStatusChange: (id: string, status: Proposal['status']) => void
}

const riskTone: Record<string, StatusPillTone> = {
  low: 'emerald',
  medium: 'amber',
  high: 'rose',
}

const statusLabels: Record<string, string> = { open: '未対応', approved: '承認済', rejected: '却下', held: '保留' }

const changeTypeColors: Record<string, string> = {
  hint_update: 'border-blue-200 bg-blue-50 text-blue-700',
  step_add: 'border-violet-200 bg-violet-50 text-violet-700',
  validation_change: 'border-amber-200 bg-amber-50 text-amber-700',
  guardrail_add: 'border-rose-200 bg-rose-50 text-rose-700',
  guardrail_modify: 'border-rose-200 bg-rose-50 text-rose-700',
}

export default function ProposalCard({ proposal, onStatusChange }: ProposalCardProps) {
  const [comment, setComment] = useState(proposal.adminComment ?? '')
  const isResolved = proposal.status !== 'open'

  return (
    <Card className={isResolved ? 'opacity-60' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <CardTitle className="text-base">提案 #{proposal.id}</CardTitle>
              <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded border ${changeTypeColors[proposal.changeType]}`}>
                {changeTypeLabels[proposal.changeType]}
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate">対象: {proposal.targetProcedureJp}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <StatusPill tone={riskTone[proposal.riskLevel]}>
              リスク: {riskLevelLabels[proposal.riskLevel]}
            </StatusPill>
            {isResolved && (
              <Badge variant={proposal.status === 'approved' ? 'default' : 'secondary'}>
                {statusLabels[proposal.status]}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* What / Why */}
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

        {/* 実 diff 表示 */}
        <div className="rounded-md border bg-muted/30 p-3 space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            変更差分: {proposal.diff.pathJp}
          </p>
          {proposal.diff.before.map((line, i) => (
            <div key={`before-${i}`} className="text-xs font-mono bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200 line-through break-words">
              − {line}
            </div>
          ))}
          {proposal.diff.after.map((line, i) => (
            <div key={`after-${i}`} className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200 break-words">
              + {line}
            </div>
          ))}
        </div>

        {/* 影響分析 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-md bg-amber-50/50 border border-amber-200">
            <p className="text-xs text-muted-foreground font-medium mb-1.5 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> 影響範囲
            </p>
            <p className="text-sm">
              直近30日で <Num className="font-semibold">{proposal.impactAnalysis.affectedRunsLast30d}</Num>件 に影響
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              対象業務: {proposal.scopeWorkflows.join(', ')}
            </p>
          </div>
          <div className="p-3 rounded-md bg-emerald-50/50 border border-emerald-200">
            <p className="text-xs text-muted-foreground font-medium mb-1.5 flex items-center gap-1">
              <Shield className="h-3 w-3" /> 期待効果
            </p>
            <p className="text-sm">
              過去 <Num className="font-semibold">{proposal.impactAnalysis.preventableMissesCount}</Num>件 の差し戻しを防止可能
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {proposal.impactAnalysis.riskAssessment}
            </p>
          </div>
        </div>

        {/* リスク根拠 */}
        <div className="p-3 rounded-md bg-muted/30 border border-border">
          <p className="text-xs font-medium text-muted-foreground mb-1">リスク評価の根拠</p>
          <p className="text-xs">{proposal.riskRationale}</p>
        </div>

        {/* Voices — 根拠となる現場コメント */}
        <div>
          <p className="text-xs font-medium mb-2 flex items-center gap-1.5 text-muted-foreground">
            <MessageSquareQuote className="h-3.5 w-3.5" />
            現場の声（根拠となる修正コメント）
          </p>
          <div className="space-y-1.5 pl-1">
            {proposal.voices.map((v, i) => (
              <div key={i} className="text-sm flex flex-wrap sm:flex-nowrap gap-x-2 gap-y-1 py-1 px-2 rounded bg-muted/30">
                <span className="text-muted-foreground shrink-0 text-xs font-mono">{v.date}</span>
                <span className="font-medium shrink-0 text-xs">{v.author}:</span>
                <span className="text-muted-foreground text-xs min-w-0 break-words basis-full sm:basis-auto">{v.text}</span>
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

            <div className="flex flex-wrap gap-2 pt-1">
              <Button variant="brand" size="tap" onClick={() => onStatusChange(proposal.id, 'approved')}>
                承認
              </Button>
              <Button variant="destructive" size="tap" onClick={() => onStatusChange(proposal.id, 'rejected')}>
                却下
              </Button>
              <Button variant="secondary" size="tap" onClick={() => onStatusChange(proposal.id, 'held')}>
                保留
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
