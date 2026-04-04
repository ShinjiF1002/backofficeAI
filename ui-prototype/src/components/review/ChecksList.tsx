import type { Check } from '@/data/types'
import { Badge } from '@/components/ui/badge'
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
          <div className="flex items-center gap-2">
            {check.status === 'ok' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm">{check.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={check.status === 'ok' ? 'secondary' : 'destructive'} className="text-xs">
              {check.status.toUpperCase()}
            </Badge>
            {check.delta !== undefined && (
              <span className="text-sm text-red-600 font-medium">
                差分: {check.delta.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
