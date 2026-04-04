import { Card, CardContent } from '@/components/ui/card'
import { Database, TrendingUp, BookOpen } from 'lucide-react'

interface LearningKpiProps {
  total: number
  accuracy: number
  knowledge: number
}

const kpis = [
  { key: 'total', label: '処理件数', icon: Database, color: 'text-blue-500', target: 'POC目標: 500件', delta: '↑ 先週比 +18件', deltaColor: 'text-emerald-600' },
  { key: 'accuracy', label: '正答率', icon: TrendingUp, color: 'text-emerald-500', suffix: '%', target: '昇格閾値: 95%', delta: '↑ 先週比 +0.8%', deltaColor: 'text-emerald-600' },
  { key: 'knowledge', label: '蓄積知見', icon: BookOpen, color: 'text-violet-500', target: 'うち検証済: 18件', delta: '↑ +2件', deltaColor: 'text-emerald-600' },
] as const

export default function LearningKpi({ total, accuracy, knowledge }: LearningKpiProps) {
  const values = { total, accuracy, knowledge }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {kpis.map(kpi => {
        const value = values[kpi.key]
        const isAccuracy = kpi.key === 'accuracy'
        const belowThreshold = isAccuracy && value < 95

        return (
          <Card key={kpi.key}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold mt-1">
                    {value}{'suffix' in kpi ? kpi.suffix : ''}
                  </p>
                  <p className={`text-[11px] mt-1 ${belowThreshold ? 'text-amber-600' : 'text-muted-foreground'}`}>
                    {kpi.target}
                  </p>
                  <p className={`text-[11px] ${kpi.deltaColor}`}>
                    {kpi.delta}
                  </p>
                </div>
                <kpi.icon className={`h-8 w-8 ${kpi.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
