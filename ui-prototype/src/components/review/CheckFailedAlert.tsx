import type { Check } from '@/data/types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ShieldAlert } from 'lucide-react'

interface CheckFailedAlertProps {
  checks: Check[]
}

export default function CheckFailedAlert({ checks }: CheckFailedAlertProps) {
  return (
    <Alert variant="destructive">
      <ShieldAlert className="h-4 w-4" />
      <AlertTitle>ガードレールが問題を検出しました</AlertTitle>
      <AlertDescription>
        <div className="space-y-1 mt-2">
          {checks.map(check => (
            <div key={check.name} className="flex items-center gap-3 text-sm">
              <span className={check.status === 'ng' ? 'font-semibold' : ''}>
                {check.name}
              </span>
              <span className={check.status === 'ok' ? 'text-emerald-600' : 'text-red-600 font-bold'}>
                {check.status.toUpperCase()}
              </span>
              {check.delta !== undefined && (
                <span className="text-red-600">差分: {check.delta.toLocaleString()}</span>
              )}
            </div>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  )
}
