import { Card, CardContent, CardHeader, CardTitle } from 'crystalline-ui'
import { Bot } from 'lucide-react'

interface AiJudgmentDisplayProps {
  judgment: string
}

export default function AiJudgmentDisplay({ judgment }: AiJudgmentDisplayProps) {
  return (
    <Card className="bg-muted/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
          <Bot className="h-4 w-4" />
          AIの判断
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm italic">"{judgment}"</p>
      </CardContent>
    </Card>
  )
}
