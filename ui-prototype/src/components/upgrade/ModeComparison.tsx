import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'

interface StepDef {
  name: string
  current: 'human' | 'ai'
  next: 'human' | 'ai'
}

interface ModeComparisonProps {
  currentMode: string
  nextMode: string
  currentApprovals: number
  nextApprovals: number
  steps: StepDef[]
}

const modeLabels: Record<string, string> = {
  'supervised': '全ステップ承認',
  'checkpoint': 'チェックポイント承認',
  'autonomous': '事後確認',
}

function StepRow({ label, steps, accessor }: { label: string; steps: StepDef[]; accessor: 'current' | 'next' }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex items-center gap-1">
        {steps.map((step, i) => (
          <div key={step.name} className="flex items-center gap-1">
            <div className="flex items-center gap-1.5">
              <div
                className={`flex items-center justify-center px-2.5 py-1.5 rounded-md text-xs font-medium border ${
                  step[accessor] === 'human'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}
              >
                <span className="mr-1">{step.name}</span>
                <span className="font-bold">[{step[accessor] === 'human' ? '人' : 'AI'}]</span>
              </div>
            </div>
            {i < steps.length - 1 && (
              <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ModeComparison({ currentMode, nextMode, currentApprovals, nextApprovals, steps }: ModeComparisonProps) {
  const reduction = Math.round((1 - nextApprovals / currentApprovals) * 100)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">承認モードの変更</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <StepRow label={`現在: ${modeLabels[currentMode] ?? currentMode}（${currentApprovals} 回承認）`} steps={steps} accessor="current" />
        <StepRow label={`変更後: ${modeLabels[nextMode] ?? nextMode}（${nextApprovals} 回承認）`} steps={steps} accessor="next" />
        <p className="text-sm text-emerald-600 font-medium">
          人間の判断回数: {reduction}% 削減
        </p>
      </CardContent>
    </Card>
  )
}
