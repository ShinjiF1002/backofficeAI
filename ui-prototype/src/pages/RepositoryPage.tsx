import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { runHistory, proposals, guardrails } from '@/data/mockData'
import {
  ShieldCheck, Camera, FileCheck, History, GitBranch, Lock,
  ArrowRight, Database, Server,
} from 'lucide-react'

export default function RepositoryPage() {
  const navigate = useNavigate()

  const runsTotal = runHistory.length
  const runsWithScreenshot = runHistory.filter(r => r.hasScreenshots).length
  const proposalsOpen = proposals.filter(p => p.status === 'open').length
  const proposalsApproved = proposals.filter(p => p.status === 'approved').length
  const proposalsRejected = proposals.filter(p => p.status === 'rejected').length

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal leading-[1.4]">データガバナンス</h1>
        <p className="text-muted-foreground mt-1">
          監査対応とデータ管理の仕組み。すべての操作・承認・変更を完全に記録しています。
        </p>
      </div>

      {/* データ所在の明示 */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            データの所在
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex gap-3">
              <Server className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">自社クラウドテナント内で完結</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  AI 基盤（Claude）を自社テナント上にホスト。業務データは社外に出ません。
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Database className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">既存アクセス権限で動作</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  担当者の PC 上で既にアクセス権のあるアプリを操作。新たなシステム連携は不要です。
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 監査証跡の4点セット */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            完全な操作証跡
          </CardTitle>
          <p className="text-xs text-muted-foreground">すべての AI 実行は 4 点セットで完全に追跡可能です</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Camera, label: '画面キャプチャ', desc: 'AI が操作した全画面を保存', count: `${runsWithScreenshot}件` },
              { icon: History, label: '実行ログ', desc: 'ステップごとの詳細ログ', count: `${runsTotal}件` },
              { icon: FileCheck, label: '承認記録', desc: '誰がいつ承認したかを記録', count: `${runsTotal}件` },
              { icon: GitBranch, label: '変更履歴', desc: 'すべての変更を Git で管理', count: '全履歴' },
            ].map(item => (
              <div key={item.label} className="p-3 rounded-lg border border-border/60 bg-card shadow-[var(--shadow-premium-sm)]">
                <item.icon className="h-5 w-5 text-primary mb-2" />
                <p className="text-sm font-medium leading-[1.4]">{item.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 mb-1.5 leading-[1.4]">{item.desc}</p>
                <p className="text-xs font-num text-primary tabular-nums font-semibold">{item.count}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/runs')}
            >
              実行履歴を見る <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 変更管理の透明性 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-primary" />
            変更管理の透明性
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            手順変更・チェックルール変更は、すべて提案として記録されます
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-center">
              <p className="text-2xl font-bold text-amber-700 tabular-nums">{proposalsOpen}</p>
              <p className="text-xs text-muted-foreground mt-1">レビュー待ち</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
              <p className="text-2xl font-bold text-emerald-700 tabular-nums">{proposalsApproved}</p>
              <p className="text-xs text-muted-foreground mt-1">承認済</p>
            </div>
            <div className="p-3 rounded-lg bg-muted border text-center">
              <p className="text-2xl font-bold text-muted-foreground tabular-nums">{proposalsRejected}</p>
              <p className="text-xs text-muted-foreground mt-1">却下</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            どの変更が、いつ、誰のコメントを根拠に、どのレビュアーによって承認/却下されたかがすべて記録されます。
            AI が自律的にルールを変更することはありません。
          </p>
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/proposals')}>
              変更提案を見る <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ガードレール */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            現在適用中のチェックルール
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {guardrails.length} 件のガードレールが、AI の判断を自動チェックしています
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {guardrails.slice(0, 3).map(g => (
              <div key={g.id} className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/30 border">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Badge
                    variant="outline"
                    className={`text-[10px] shrink-0 ${g.severity === 'error' ? 'border-rose-200 text-rose-700 bg-rose-50' : 'border-amber-200 text-amber-700 bg-amber-50'}`}
                  >
                    {g.severity === 'error' ? 'ブロック' : '警告'}
                  </Badge>
                  <span className="text-sm truncate">{g.jpName}</span>
                </div>
                <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                  直近 {g.firedCount}回
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/guardrails')}>
              全チェックルールを見る <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 監査シナリオ */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">監査シナリオ（例）</CardTitle>
          <p className="text-xs text-muted-foreground">「ある 1 件の業務処理」を完全に追跡できます</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { step: '1', text: 'いつ実行されたか', detail: '開始時刻・完了時刻が記録されています' },
              { step: '2', text: 'AI が何を判断したか', detail: '各ステップでの AI の判断内容と根拠が残っています' },
              { step: '3', text: 'どの画面を操作したか', detail: '全画面のスクリーンショットが保存されています' },
              { step: '4', text: '誰が承認したか', detail: '各ステップの承認者と承認時刻が記録されています' },
              { step: '5', text: '修正があったか', detail: '担当者の修正コメントとその反映状況が追跡可能です' },
            ].map(item => (
              <div key={item.step} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                <span className="text-xs font-bold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                  {item.step}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.text}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
