import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

interface CommentImpactProps {
  totalComments: number
  learned: number
  proposalsGenerated: number
  proposalsApproved: number
  example: string
}

export default function CommentImpact({ totalComments, learned, proposalsGenerated, proposalsApproved, example }: CommentImpactProps) {
  const stages = [
    { label: 'コメント', value: totalComments },
    { label: '学習済', value: learned },
    { label: '提案生成', value: proposalsGenerated },
    { label: '承認済', value: proposalsApproved },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">修正コメントの反映状況</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          {stages.map((stage, i) => (
            <div key={stage.label} className="flex items-center gap-2">
              <div className="text-center">
                <p className="text-2xl font-bold">{stage.value}</p>
                <p className="text-xs text-muted-foreground">{stage.label}</p>
              </div>
              {i < stages.length - 1 && (
                <ArrowRight className="h-4 w-4 text-muted-foreground/50 mx-1" />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">
          例: {example}
        </p>
      </CardContent>
    </Card>
  )
}
