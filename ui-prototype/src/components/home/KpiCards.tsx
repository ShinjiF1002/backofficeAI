import { Clock, CheckCircle2, Loader2, TrendingUp } from "lucide-react";
import { KpiTile } from "@/components/shared/KpiTile";
import { Card, CardContent, Num, AnimatedNum, FadeIn } from "crystalline-ui";
import { weeklyMetrics, learningMetrics } from "@/data/mockData";

interface KpiCardsProps {
  pending: number;
  done: number;
  running: number;
  accuracy: number;
  runningPct?: number;
}

export default function KpiCards({
  pending,
  done,
  running,
  accuracy,
  runningPct = 66,
}: KpiCardsProps) {
  const recent6 = learningMetrics.slice(-6);
  const maxApprovals = Math.max(
    ...recent6.map((m) => m.humanApprovalsRequired),
  );

  const recentAccuracy = weeklyMetrics.slice(-8).map((m) => m.accuracy);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <FadeIn index={0}>
        <KpiTile
          label="承認待ち"
          value={pending}
          unit="件"
          icon={Clock}
          tone="amber"
        >
          <div className="flex items-end gap-1 h-6" aria-hidden>
            {recent6.map((m, i) => {
              const h = Math.round(
                (m.humanApprovalsRequired / maxApprovals) * 100,
              );
              const isLast = i === recent6.length - 1;
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-[2px] ${isLast ? "bg-amber-500" : "bg-amber-200"}`}
                  style={{ height: `${Math.max(h, 15)}%` }}
                />
              );
            })}
          </div>
        </KpiTile>
      </FadeIn>

      <FadeIn index={1}>
        <KpiTile
          label="実行中"
          value={running}
          unit="件"
          icon={Loader2}
          tone="indigo"
        >
          <div
            className="h-1.5 w-full rounded-full bg-muted overflow-hidden"
            aria-hidden
          >
            <div
              className="h-full rounded-full progress-shimmer-bar"
              style={{ width: `${runningPct}%` }}
            />
          </div>
        </KpiTile>
      </FadeIn>

      <FadeIn index={2}>
        <KpiTile
          label="本日完了"
          value={done}
          unit="件"
          icon={CheckCircle2}
          tone="emerald"
        >
          <Sparkline values={recentAccuracy} />
        </KpiTile>
      </FadeIn>

      <FadeIn index={3}>
        <AccuracyCard accuracy={accuracy} />
      </FadeIn>
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return <div className="h-6" aria-hidden />;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 100;
  const height = 24;
  const step = width / (values.length - 1);
  const points = values.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * height;
    return [x, y] as const;
  });
  const linePath = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-6"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="kpi-sparkline-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#kpi-sparkline-area)" />
      <path
        d={linePath}
        fill="none"
        stroke="rgb(5 150 105)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AccuracyCard({ accuracy }: { accuracy: number }) {
  const hint = accuracy < 95 ? "昇格閾値 95%" : "閾値を超過";
  return (
    <Card variant="tinted" className="overflow-hidden">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground leading-[1.4]">
              精度（直近週）
            </p>
            <div className="mt-1.5 flex items-baseline gap-1">
              <Num className="text-2xl font-bold text-gradient-brand">
                <AnimatedNum
                  value={Math.round(accuracy * 10)}
                  format={(n) => (n / 10).toFixed(1)}
                />
              </Num>
              <span className="text-sm font-semibold text-primary">%</span>
            </div>
            <div className="mt-1.5 text-[11px] text-muted-foreground leading-[1.4]">
              {hint}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 text-primary">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
