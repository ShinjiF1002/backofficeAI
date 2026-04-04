import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
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
      </CardContent>
    </Card>
  )
}
