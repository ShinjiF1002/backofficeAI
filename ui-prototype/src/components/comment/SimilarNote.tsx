import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Quote } from 'lucide-react'

interface SimilarNoteProps {
  text: string
  onQuote: (text: string) => void
}

export default function SimilarNote({ text, onQuote }: SimilarNoteProps) {
  return (
    <Card className="bg-muted/30">
      <CardContent className="py-3 flex items-center justify-between gap-3">
        <p className="text-sm min-w-0 break-words">"{text}"</p>
        <Button variant="ghost" size="sm" onClick={() => onQuote(text)} className="shrink-0 h-9 md:h-7">
          <Quote className="h-3.5 w-3.5 mr-1" />
          引用
        </Button>
      </CardContent>
    </Card>
  )
}
