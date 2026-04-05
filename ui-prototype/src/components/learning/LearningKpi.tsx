import { Database, TrendingUp, BookOpen, Users } from 'lucide-react'
import { KpiTile } from '@/components/shared/KpiTile'

interface LearningKpiProps {
  total: number
  accuracy: number
  knowledge: number
  humanApprovalsReduced: number
}

export default function LearningKpi({ total, accuracy, knowledge, humanApprovalsReduced }: LearningKpiProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <KpiTile label="処理件数（累計）" value={total} unit="件" icon={Database} tone="indigo" hint="POC 開始以降" />
      <KpiTile label="精度（直近週）" value={accuracy} unit="%" icon={TrendingUp} tone="emerald" hint="昇格閾値 95%" />
      <KpiTile label="蓄積ナレッジ" value={knowledge} unit="件" icon={BookOpen} tone="violet" hint="うち検証済多数" />
      <KpiTile label="承認削減数" value={humanApprovalsReduced} unit="件" icon={Users} tone="amber" hint="12週で 186→112" />
    </div>
  )
}
