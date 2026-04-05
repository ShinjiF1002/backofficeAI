import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import FlywheelDiagram from '@/components/shared/FlywheelDiagram'
import POCPhaseBadge from '@/components/shared/POCPhaseBadge'
import { learningMetrics, pocPhases } from '@/data/mockData'
import {
  ArrowRight, Lightbulb, ShieldCheck, Shield, ArrowRightCircle,
} from 'lucide-react'

export default function HowItWorksPage() {
  const navigate = useNavigate()

  const cumulative = learningMetrics.reduce(
    (acc, m) => ({
      corrections: acc.corrections + m.correctionsIn,
      knowledge: m.knowledgeCompiled,
      proposals: acc.proposals + m.proposalsGenerated,
      approved: acc.approved + m.proposalsApproved,
    }),
    { corrections: 0, knowledge: 0, proposals: 0, approved: 0 }
  )

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal leading-[1.4]">仕組み</h1>
        <p className="text-muted-foreground mt-1">AI が業務を代行し、担当者の気づきから継続的に学習する仕組み</p>
      </div>

      {/* 学習フライホイール — Overview と同じビジュアル */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">継続的に賢くなる仕組み</CardTitle>
          <p className="text-xs text-muted-foreground">
            担当者の修正コメントが、組織のナレッジ → 手順の改善提案 → 承認済手順へと繋がります
          </p>
        </CardHeader>
        <CardContent>
          <FlywheelDiagram
            correctionsIn={cumulative.corrections}
            knowledgeCompiled={cumulative.knowledge}
            proposalsGenerated={cumulative.proposals}
            proposalsApproved={cumulative.approved}
            variant="detailed"
          />
          <div className="mt-4 flex justify-center">
            <Button size="sm" variant="outline" onClick={() => navigate('/home')}>
              実際のオペレータ画面を見る <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2層のデータモデル */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">2 層のデータモデル</CardTitle>
          <p className="text-xs text-muted-foreground">知見と手順を明確に分離する設計</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 shadow-[var(--shadow-premium-sm)]">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Lightbulb className="h-5 w-5 text-teal-600" />
              <span className="font-semibold text-sm">Tier 1: ナレッジ（知見）</span>
              <Badge variant="secondary" className="text-xs">リアルタイム反映</Badge>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 ml-7">
              <li>・担当者の修正コメントから自動生成</li>
              <li>・リアルタイムで反映（人間レビュー不要）</li>
              <li>・AI への参考情報として注入。手順そのものは変えない</li>
            </ul>
            <div className="ml-7 mt-2 p-2 bg-white/60 rounded text-xs">
              例: 「円未満の端数は切り捨てが社内ルール」という知見
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowRightCircle className="h-5 w-5 text-muted-foreground rotate-90" />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 shadow-[var(--shadow-premium-sm)]">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Shield className="h-5 w-5 text-slate-700" />
              <span className="font-semibold text-sm">Tier 2: 手順定義 + チェックルール（ガードレール）</span>
              <Badge className="text-xs bg-amber-500">人間レビュー必須</Badge>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 ml-7">
              <li>・実行手順とバリデーションルール</li>
              <li>・どんな変更も人間の承認が必須（例外なし）</li>
              <li>・提案 → レビュー → 承認のワークフローで管理</li>
            </ul>
            <div className="ml-7 mt-2 p-2 bg-white rounded text-xs border border-slate-200">
              例: 「請求金額と証憑の金額一致を確認」というチェックルール
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 信頼レベル 3段階 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">段階的な自律化 — 信頼レベル</CardTitle>
          <p className="text-xs text-muted-foreground">実績に応じて、人間の承認ポイントを段階的に減らします</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              {
                title: '全ステップ承認',
                period: '導入初日〜',
                decisions: '人間の判断: 5回',
                steps: [true, true, true, true, true],
                desc: 'すべてのステップで担当者が確認',
              },
              {
                title: 'チェックポイント承認',
                period: '実績蓄積後',
                decisions: '人間の判断: 2回（60%削減）',
                steps: [false, false, true, false, true],
                desc: '実績が十分なステップは AI に任せる',
              },
              {
                title: '事後確認のみ',
                period: '十分な実績後',
                decisions: '人間の判断: 事後レビューのみ',
                steps: [false, false, false, false, false],
                desc: '高い実績を持つ業務のみ',
              },
            ].map((level, i) => (
              <div key={level.title} className="p-4 rounded-lg border bg-muted/30">
                <Badge variant={i === 0 ? 'secondary' : i === 1 ? 'default' : 'outline'} className="mb-2">
                  {level.period}
                </Badge>
                <p className="text-sm font-semibold">{level.title}</p>
                <div className="flex gap-1 my-3">
                  {level.steps.map((isHuman, j) => (
                    <div
                      key={j}
                      className={`flex-1 h-6 rounded text-xs flex items-center justify-center font-medium ${
                        isHuman
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {isHuman ? '人' : 'AI'}
                    </div>
                  ))}
                </div>
                <p className="text-xs font-medium">{level.decisions}</p>
                <p className="text-xs text-muted-foreground mt-1">{level.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-medium text-amber-800">高リスク業務（高額送金など）は、どれだけ実績があっても完全自律化しません。</p>
              <p className="text-muted-foreground mt-1">精度が 90% を下回った場合は自動的に全ステップ承認に戻ります（自動降格）。</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* POC実施計画（現在フェーズマーカー付き） */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">POC 実施計画</CardTitle>
          <p className="text-xs text-muted-foreground">効果測定を段階的に進めています</p>
        </CardHeader>
        <CardContent>
          <POCPhaseBadge phases={pocPhases} variant="detailed" />

          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {['自動化率', '処理精度', '介入頻度', '処理時間', 'AI 運用コスト'].map(metric => (
              <Badge key={metric} variant="secondary" className="text-xs">{metric}</Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-1">POC で計測する指標</p>
        </CardContent>
      </Card>
    </div>
  )
}
