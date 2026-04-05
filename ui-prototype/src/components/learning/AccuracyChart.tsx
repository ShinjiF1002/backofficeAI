import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts'
import type { WeeklyMetric } from '@/data/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AccuracyChartProps {
  data: WeeklyMetric[]
}

export default function AccuracyChart({ data }: AccuracyChartProps) {
  const chartData = data.map(d => ({ name: `W${d.week}`, accuracy: d.accuracy }))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">精度の推移（週次）</CardTitle>
        <p className="text-xs text-muted-foreground">修正コメントの蓄積により、12週間で 82% → 96% に向上</p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis domain={[75, 100]} stroke="#64748b" tick={{ fontSize: 12 }} unit="%" />
              <Tooltip
                formatter={(value) => [`${value}%`, '精度']}
                contentStyle={{ borderRadius: '8px', fontSize: '13px', border: '1px solid #e2e8f0' }}
              />
              <ReferenceLine
                y={95}
                stroke="#f59e0b"
                strokeDasharray="6 3"
                label={{ value: '昇格閾値 95%', position: 'insideTopRight', fontSize: 11, fill: '#f59e0b' }}
              />
              <Area
                type="monotone"
                dataKey="accuracy"
                stroke="#4f46e5"
                strokeWidth={2}
                fill="url(#accuracyGradient)"
                dot={{ r: 3, fill: '#4f46e5' }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
