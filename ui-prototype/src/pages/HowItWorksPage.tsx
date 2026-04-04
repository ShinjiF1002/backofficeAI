import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowDown, ArrowRight, BookOpen, Brain, CheckCircle2, FileText, Lightbulb, MessageSquare, ShieldCheck, User } from 'lucide-react'

export default function HowItWorksPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">How it works</h1>
        <p className="text-muted-foreground mt-1">システムの動作の仕組み</p>
      </div>

      {/* Core Cycle */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">基本サイクル</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { step: '1', icon: BookOpen, title: 'マニュアルを読み込む', desc: '既存の業務マニュアルをAIが解析し、操作手順を構造化', color: 'bg-blue-50 border-blue-200' },
              { step: '2', icon: Brain, title: 'AIが業務を実行', desc: '担当者と同じPC・同じアプリで画面操作', color: 'bg-violet-50 border-violet-200' },
              { step: '3', icon: User, title: '人間が確認・承認', desc: '重要なステップごとに担当者が結果を確認', color: 'bg-emerald-50 border-emerald-200' },
              { step: '4', icon: MessageSquare, title: '修正があればコメント', desc: '担当者の暗黙知がナレッジとして蓄積', color: 'bg-amber-50 border-amber-200' },
            ].map(item => (
              <div key={item.step} className={`p-4 rounded-lg border ${item.color} text-center`}>
                <div className="flex items-center justify-center mb-2">
                  <span className="text-xs font-bold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center mr-2">{item.step}</span>
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm font-medium text-muted-foreground mt-4">
            このサイクルを繰り返すことで、AIは使うほど賢くなります
          </p>
        </CardContent>
      </Card>

      {/* Two-Tier Data Model */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">2層のデータモデル</CardTitle>
          <p className="text-xs text-muted-foreground">知見と手順を明確に分離する設計</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-teal-50 border border-teal-200">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5 text-teal-600" />
              <span className="font-semibold text-sm">Tier 1: ナレッジ（知見）</span>
              <Badge variant="secondary" className="text-xs">リアルタイム反映</Badge>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 ml-7">
              <li>担当者の修正コメントから自動生成</li>
              <li>リアルタイムで反映（人間レビュー不要）</li>
              <li>AIへの参考情報として注入。手順そのものは変えない</li>
            </ul>
            <div className="ml-7 mt-2 p-2 bg-white/60 rounded text-xs">
              例:「端数は切り捨てが社内ルール」という知見
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="p-4 rounded-lg bg-slate-800 text-white border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-slate-300" />
              <span className="font-semibold text-sm">Tier 2: 手順定義 + ガードレール</span>
              <Badge className="text-xs bg-amber-500">人間レビュー必須</Badge>
            </div>
            <ul className="text-xs text-slate-300 space-y-1 ml-7">
              <li>実行手順とバリデーションルール</li>
              <li>どんな変更も人間の承認が必須（例外なし）</li>
              <li>提案 → レビュー → 承認のワークフローで管理</li>
            </ul>
            <div className="ml-7 mt-2 p-2 bg-slate-700 rounded text-xs text-slate-300">
              例:「請求金額と証憑の金額一致を確認」というチェックルール
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            知見が蓄積 → 手順改善の提案を自動生成 → 人間が承認して初めて反映
          </p>
        </CardContent>
      </Card>

      {/* Knowledge Pipeline */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">修正コメントが組織の資産になる</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { icon: MessageSquare, label: '担当者が修正コメントを入力', example: '「PDFが2ページあるのに1ページ目しか見ていない」', color: 'border-amber-200 bg-amber-50' },
              { icon: FileText, label: 'AIが自動で分類', example: '手順の誤解 / UI変更 / エッジケース / 判断基準の不一致', color: 'border-blue-200 bg-blue-50' },
              { icon: Lightbulb, label: 'ナレッジ記事を自動生成', example: 'この時点でAIは即座に参照可能（低い重み）', color: 'border-violet-200 bg-violet-50' },
              { icon: CheckCircle2, label: '整合性を自動チェック', example: '矛盾なし → 正式知見に昇格 / 矛盾あり → 保留してフラグ', color: 'border-emerald-200 bg-emerald-50' },
            ].map((item, i) => (
              <div key={item.label}>
                <div className={`flex items-start gap-3 p-3 rounded-lg border ${item.color}`}>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">{i + 1}</span>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.example}</p>
                  </div>
                </div>
                {i < 3 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="h-3 w-3 text-muted-foreground/50" />
                  </div>
                )}
              </div>
            ))}

            {/* Two paths */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <div className="p-3 rounded-lg border border-teal-200 bg-teal-50">
                <p className="text-sm font-medium text-teal-700">知見として蓄積（Tier 1）</p>
                <p className="text-xs text-muted-foreground mt-1">全エージェントに即時共有</p>
              </div>
              <div className="p-3 rounded-lg border border-slate-300 bg-slate-50">
                <p className="text-sm font-medium">手順変更が必要な場合（Tier 2）</p>
                <p className="text-xs text-muted-foreground mt-1">提案を自動生成 → 人間が承認</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4 font-medium">
            同じミスは二度と繰り返さない。一人の気づきが、すべてのAIエージェントの品質を底上げする。
          </p>
        </CardContent>
      </Card>

      {/* Trust Levels */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">段階的な自律化 — 信頼レベルの昇格</CardTitle>
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
                desc: '実績が十分なステップはAIに任せる',
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
              <p className="font-medium text-amber-800">高リスク業務（高額送金等）は、どれだけ実績があっても完全自律化しない設計です。</p>
              <p className="text-muted-foreground mt-1">精度が低下した場合は自動的に全ステップ承認に戻ります（自動降格）。</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* POC Roadmap */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">POC実施計画</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              {
                phase: 'Phase 1',
                title: 'マニュアル取り込み',
                color: 'border-blue-200 bg-blue-50',
                items: ['業務マニュアルをAIが解析', '操作手順を自動生成', '管理者がレビュー・承認', '規制要件の調査'],
              },
              {
                phase: 'Phase 2',
                title: '全承認モードで実行',
                color: 'border-violet-200 bg-violet-50',
                items: ['全ステップ人間承認で業務実行', '修正コメントの蓄積', 'ナレッジベース構築', '精度の継続的向上'],
              },
              {
                phase: 'Phase 3',
                title: '省力化効果の測定',
                color: 'border-emerald-200 bg-emerald-50',
                items: ['承認ポイントの削減', '自動化率・精度・処理時間を計測', 'ROI試算', '本格展開の判断材料'],
              },
            ].map((phase) => (
              <div key={phase.phase} className={`p-4 rounded-lg border ${phase.color}`}>
                <Badge variant="outline" className="mb-2">{phase.phase}</Badge>
                <p className="text-sm font-semibold">{phase.title}</p>
                <ul className="mt-2 space-y-1">
                  {phase.items.map(item => (
                    <li key={item} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <ArrowRight className="h-3 w-3 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {['自動化率', '処理精度', '介入頻度', '処理時間', 'AI運用コスト'].map(metric => (
              <Badge key={metric} variant="secondary" className="text-xs">{metric}</Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-1">POCで計測する指標</p>
        </CardContent>
      </Card>
    </div>
  )
}
