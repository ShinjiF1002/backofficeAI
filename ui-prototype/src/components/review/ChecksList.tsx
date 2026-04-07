import type { Check } from '@/data/types'
import { Badge } from 'crystalline-ui'
import { CheckCircle2, XCircle } from 'lucide-react'

interface ChecksListProps {
  checks: Check[]
}

export default function ChecksList({ checks }: ChecksListProps) {
  if (checks.length === 0) {
    return <p className="text-sm text-muted-foreground">このステップにチェック項目はありません</p>
  }

  return (
    <div className="space-y-2">
      {checks.map(check => (
        <div key={check.name} className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-2 min-w-0">
            {check.status === 'ok' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500 shrink-0" />
            )}
            <span className="text-sm truncate">{check.name}</span>
            {check.severity && (
              <Badge
                variant="outline"
                className={`text-[9px] shrink-0 ${check.severity === 'error' ? 'border-rose-200 text-rose-700' : 'border-amber-200 text-amber-700'}`}
              >
                {check.severity === 'error' ? 'ブロック' : '警告'}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {check.delta !== undefined && (
              <span className="text-sm text-red-600 font-medium tabular-nums">
                差分: ¥{check.delta.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
