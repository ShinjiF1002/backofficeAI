import type { Step } from '@/data/types'
import { Check, ChevronRight } from 'lucide-react'

interface StepProgressProps {
  steps: Step[]
}

export default function StepProgress({ steps }: StepProgressProps) {
  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => (
        <div key={step.stepNum} className="flex items-center gap-1">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium border-2 transition-colors ${
                step.status === 'completed'
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : step.status === 'current'
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-muted border-muted-foreground/30 text-muted-foreground'
              }`}
            >
              {step.status === 'completed' ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                step.stepNum
              )}
            </div>
            <span
              className={`text-sm ${
                step.status === 'current'
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {step.name}
            </span>
          </div>
          {i < steps.length - 1 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground/50 mx-1" />
          )}
        </div>
      ))}
    </div>
  )
}
