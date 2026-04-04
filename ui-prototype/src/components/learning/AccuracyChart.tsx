import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
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
        <CardTitle className="text-base">正答率の推移</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 12 }} />
              <YAxis domain={[75, 100]} className="text-xs" tick={{ fontSize: 12 }} unit="%" />
              <Tooltip
                formatter={(value) => [`${value}%`, '正答率']}
                contentStyle={{ borderRadius: '8px', fontSize: '13px' }}
              />
              <ReferenceLine
                y={95}
                stroke="hsl(25, 95%, 53%)"
                strokeDasharray="6 3"
                label={{ value: '昇格閾値 95%', position: 'insideTopRight', fontSize: 11, fill: 'hsl(25, 95%, 53%)' }}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="hsl(142, 71%, 45%)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          12週間で 82% → 96% に向上。修正コメントの蓄積により安定した精度向上を実現。Week 8 以降は昇格閾値（95%）付近で安定推移。
        </p>
      </CardContent>
    </Card>
  )
}
