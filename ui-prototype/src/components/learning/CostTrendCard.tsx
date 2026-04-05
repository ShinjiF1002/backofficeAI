import type { CostMetric } from '@/data/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Num } from '@/components/shared/Num'
import { TrendingUp } from 'lucide-react'

interface CostTrendCardProps {
  metrics: CostMetric[]
}

export default function CostTrendCard({ metrics }: CostTrendCardProps) {
  const latest = metrics[metrics.length - 1]
  const prev = metrics[metrics.length - 2]
  const savingsGrowth = prev ? ((latest.netBenefitJpy - prev.netBenefitJpy) / prev.netBenefitJpy) * 100 : 0

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">コスト推移（月次）</CardTitle>
        <p className="text-xs text-muted-foreground">処理件数の増加とともに平均コストは低減中</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {metrics.map(m => (
            <div key={m.yearMonth} className="p-3 rounded-lg border border-border/60 bg-muted/30">
              <Num className="text-[11px] text-muted-foreground">{m.yearMonth}</Num>
              <div className="mt-1.5 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">削減額</span>
                  <Num className="font-semibold text-emerald-600">¥{(m.estimatedSavingsJpy / 1000).toFixed(0)}K</Num>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">API費</span>
                  <Num className="font-semibold text-amber-600">¥{(m.totalApiCostJpy / 1000).toFixed(0)}K</Num>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-border/60">
                  <span className="text-muted-foreground">ネット</span>
                  <Num className="font-semibold text-primary">¥{(m.netBenefitJpy / 1000).toFixed(0)}K</Num>
                </div>
              </div>
            </div>
          ))}
        </div>
        {prev && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-muted-foreground">
              前月比ネット効果: <Num className="text-emerald-600 font-semibold">+{savingsGrowth.toFixed(1)}%</Num>
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
