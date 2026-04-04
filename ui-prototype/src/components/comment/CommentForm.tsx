import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CommentFormProps {
  value: string
  onChange: (value: string) => void
}

const examples = [
  'PDFが2ページあるのに、2ページ目が読み飛ばされた',
  '切り捨てではなく切り上げが使われている',
  '半角カナでも受理して問題ない',
]

export default function CommentForm({ value, onChange }: CommentFormProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">コメント入力</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          placeholder="何が間違っていたかを記入してください..."
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={4}
          className="resize-none"
        />
        <div>
          <p className="text-xs text-muted-foreground mb-1">記入例:</p>
          <ul className="text-xs text-muted-foreground space-y-0.5">
            {examples.map((ex, i) => (
              <li key={i} className="before:content-['•_']">{ex}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
