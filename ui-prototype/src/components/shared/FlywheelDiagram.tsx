import { MessageSquare, Lightbulb, GitPullRequest, FileCheck, ArrowRight } from 'lucide-react'
import { Num } from 'crystalline-ui'
import { flywheelStageColors, type FlywheelStage } from './flywheel-colors'

interface FlywheelDiagramProps {
  correctionsIn: number
  knowledgeCompiled: number
  proposalsGenerated: number
  proposalsApproved: number
  variant?: 'compact' | 'detailed'
}

/**
 * architecture.md §5 「ナレッジコンパイルパイプライン」を視覚化
 *
 * 修正コメント → ナレッジ → 提案 → 承認済手順
 */

export default function FlywheelDiagram({
  correctionsIn,
  knowledgeCompiled,
  proposalsGenerated,
  proposalsApproved,
  variant = 'compact',
}: FlywheelDiagramProps) {
  const nodes: Array<{ stage: FlywheelStage; icon: typeof MessageSquare; label: string; sublabel: string; count: number }> = [
    { stage: 'corrections', icon: MessageSquare,   label: '修正コメント', sublabel: '担当者の気づき',           count: correctionsIn },
    { stage: 'knowledge',   icon: Lightbulb,       label: 'ナレッジ',      sublabel: '組織の資産',               count: knowledgeCompiled },
    { stage: 'proposals',   icon: GitPullRequest,  label: '変更提案',      sublabel: '管理者レビュー待ち',       count: proposalsGenerated },
    { stage: 'approved',    icon: FileCheck,       label: '承認済手順',    sublabel: '全エージェントに反映',     count: proposalsApproved },
  ]

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-0 md:flex md:items-stretch">
        {nodes.map((node, i) => {
          const c = flywheelStageColors[node.stage]
          return (
            <div key={node.stage} className="flex md:flex-1 items-center">
              <div className={`flex-1 rounded-lg border ${c.border} ${c.bg} shadow-[var(--shadow-premium-sm)] p-3 md:p-4`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <node.icon className={`h-4 w-4 ${c.icon}`} />
                  <span className="text-xs font-semibold leading-[1.4]">{node.label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <Num className={`text-2xl font-bold ${c.text}`}>{node.count}</Num>
                  <span className="text-xs text-muted-foreground">件</span>
                </div>
                {variant === 'detailed' && (
                  <p className="text-[11px] text-muted-foreground mt-1 leading-[1.4]">{node.sublabel}</p>
                )}
              </div>
              {i < nodes.length - 1 && (
                <div className="hidden md:flex items-center justify-center px-2">
                  <ArrowRight className="h-4 w-4 text-slate-300" />
                </div>
              )}
              {i < nodes.length - 1 && (
                <div className="md:hidden flex justify-center py-1">
                  <ArrowRight className="h-3 w-3 rotate-90 text-slate-300" />
                </div>
              )}
            </div>
          )
        })}
      </div>
      <p className="text-xs text-muted-foreground text-center mt-3 md:mt-4 leading-[1.5]">
        同じミスは二度と繰り返さない。担当者の気づきが全エージェントの品質を底上げします。
      </p>
    </div>
  )
}
