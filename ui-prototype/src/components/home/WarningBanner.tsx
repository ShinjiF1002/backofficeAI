import type { RepeatIssue } from '@/data/types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

interface WarningBannerProps {
  issue: RepeatIssue
}

export default function WarningBanner({ issue }: WarningBannerProps) {
  return (
    <Alert variant="destructive" className="border-amber-500/50 bg-amber-50 text-amber-900 [&>svg]:text-amber-600">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="font-semibold">
        「{issue.workflow}」で同じミスが繰り返されています
      </AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          直近 {issue.total} 件中 {issue.count} 件が「{issue.description}」で差し戻し
        </p>
        <div className="space-y-1 text-sm">
          {issue.entries.map((entry, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-amber-700 font-medium">{entry.date}</span>
              <span className="text-amber-700">{entry.author}:</span>
              <span>{entry.text}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm font-medium">
          変更提案: {issue.proposalStatus}
        </p>
      </AlertDescription>
    </Alert>
  )
}
