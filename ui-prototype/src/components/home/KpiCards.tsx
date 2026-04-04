import { Card, CardContent } from '@/components/ui/card'
import { Clock, CheckCircle2, Loader2, TrendingUp } from 'lucide-react'

interface KpiCardsProps {
  pending: number
  done: number
  running: number
  accuracy: number
}

const kpis = [
  { key: 'pending', label: '承認待ち', icon: Clock, color: 'text-amber-500' },
  { key: 'done', label: '本日完了', icon: CheckCircle2, color: 'text-emerald-500' },
  { key: 'running', label: '実行中', icon: Loader2, color: 'text-blue-500' },
  { key: 'accuracy', label: '正答率', icon: TrendingUp, color: 'text-violet-500' },
] as const

export default function KpiCards({ pending, done, running, accuracy }: KpiCardsProps) {
  const values = { pending, done, running, accuracy }

  return (
    <div className="grid grid-cols-4 gap-4">
      {kpis.map(kpi => (
        <Card key={kpi.key}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-bold mt-1">
                  {kpi.key === 'accuracy' ? `${values[kpi.key]}%` : values[kpi.key]}
                </p>
              </div>
              <kpi.icon className={`h-8 w-8 ${kpi.color} opacity-80`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
