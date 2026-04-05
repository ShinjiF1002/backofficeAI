import { Clock, CheckCircle2, Loader2, TrendingUp } from 'lucide-react'
import { KpiTile } from '@/components/shared/KpiTile'

interface KpiCardsProps {
  pending: number
  done: number
  running: number
  accuracy: number
}

export default function KpiCards({ pending, done, running, accuracy }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <KpiTile label="承認待ち" value={pending} unit="件" icon={Clock} tone="amber" />
      <KpiTile label="実行中" value={running} unit="件" icon={Loader2} tone="indigo" />
      <KpiTile label="本日完了" value={done} unit="件" icon={CheckCircle2} tone="emerald" />
      <KpiTile
        label="精度（直近週）"
        value={accuracy}
        unit="%"
        icon={TrendingUp}
        tone="violet"
        hint={accuracy < 95 ? '昇格閾値 95%' : '閾値を超過'}
      />
    </div>
  )
}
