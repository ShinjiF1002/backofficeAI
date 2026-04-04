import { Card, CardContent } from '@/components/ui/card'
import { Database, TrendingUp, BookOpen } from 'lucide-react'

interface LearningKpiProps {
  total: number
  accuracy: number
  knowledge: number
}

const kpis = [
  { key: 'total', label: '処理件数', icon: Database, color: 'text-blue-500' },
  { key: 'accuracy', label: '正答率', icon: TrendingUp, color: 'text-emerald-500', suffix: '%' },
  { key: 'knowledge', label: '蓄積知見', icon: BookOpen, color: 'text-violet-500' },
] as const

export default function LearningKpi({ total, accuracy, knowledge }: LearningKpiProps) {
  const values = { total, accuracy, knowledge }

  return (
    <div className="grid grid-cols-3 gap-4">
      {kpis.map(kpi => (
        <Card key={kpi.key}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-bold mt-1">
                  {values[kpi.key]}{'suffix' in kpi ? kpi.suffix : ''}
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
