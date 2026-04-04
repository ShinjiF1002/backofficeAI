import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Server, ShieldCheck, FileText, TrendingUp, AlertTriangle, ArrowRight, FolderTree } from 'lucide-react'

export default function OverviewPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">概要</h1>
        <p className="text-muted-foreground mt-1">AIによるバックオフィス省力化のご提案</p>
      </div>

      {/* What */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">何を実現するのか</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <p>
            送金処理や口座開設といったバックオフィス業務の多くは、担当者がマニュアルに沿って画面を操作する定型作業です。
            本提案は、この「マニュアルに沿った画面操作」をAIに代行させることで、バックオフィスの人件費を構造的に削減する仕組みを構築するものです。
          </p>
          <p>
            AIが担当者と同じPC上で、同じ業務アプリケーションを、同じ手順で操作します。
            <strong>新しいシステムの導入や既存システムの改修は不要</strong>です。
          </p>
        </CardContent>
      </Card>

      {/* Current Problems */}
      <div>
        <h2 className="text-base font-semibold mb-3">現状の課題</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { icon: FileText, title: '定型作業に人手を割いている', desc: '送金・口座開設・請求書承認など' },
            { icon: AlertTriangle, title: '退職・異動でノウハウが流出', desc: '暗黙知が属人化' },
            { icon: TrendingUp, title: '教育コストが人数に比例', desc: '新人ごとに同じ教育が必要' },
          ].map(item => (
            <Card key={item.title}>
              <CardContent className="pt-4 pb-4">
                <item.icon className="h-6 w-6 text-amber-500 mb-2" />
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Arrow */}
      <div className="flex items-center justify-center">
        <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
      </div>

      {/* Solution */}
      <div>
        <h2 className="text-base font-semibold mb-3">本提案のアプローチ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { icon: Server, title: 'AIが同じ画面を同じ手順で操作', desc: '既存システム改修不要', color: 'text-emerald-500' },
            { icon: ShieldCheck, title: 'ナレッジが組織に蓄積', desc: '退職しても失われない', color: 'text-blue-500' },
            { icon: TrendingUp, title: '一度の学習が全エージェントに共有', desc: '教育コスト一定', color: 'text-violet-500' },
          ].map(item => (
            <Card key={item.title} className="border-emerald-200 bg-emerald-50/30">
              <CardContent className="pt-4 pb-4">
                <item.icon className={`h-6 w-6 ${item.color} mb-2`} />
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Safety */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">安全設計の4原則</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[
              { title: 'データは社外に出ない', desc: 'AI基盤を自社クラウドテナントにホスト。データ通信はすべて社内で完結。' },
              { title: 'すべての変更は人間が承認', desc: '手順の修正もチェックルールの追加も、必ず人間のレビューと承認が必要。' },
              { title: 'すべての操作を記録', desc: '画面キャプチャを含む完全な操作証跡。監査対応。' },
              { title: '信頼は実績で獲得', desc: '初期は全ステップ人間承認。実績に基づき段階的に自律化。高リスク業務は完全自律化しない。' },
            ].map(item => (
              <div key={item.title} className="flex gap-3 p-3 rounded-md bg-muted/50">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* RPA Comparison */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">従来のRPAとの違い</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
            <div className="p-3 rounded-md bg-muted/50">
              <Badge variant="secondary" className="mb-2">RPA</Badge>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>+ 動作が完全に決定的、予測可能性が高い</li>
                <li>+ 高頻度・高速処理に強い</li>
                <li>- UIの軽微な変更で動作不能に</li>
                <li>- その都度プログラム修正が必要</li>
              </ul>
            </div>
            <div className="p-3 rounded-md bg-emerald-50/50 border border-emerald-200">
              <Badge className="mb-2">本提案のAI</Badge>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>+ マニュアルの「意図」を理解して操作</li>
                <li>+ UI変更への耐性が高い</li>
                <li>+ 使うほど賢くなる（ナレッジ蓄積）</li>
                <li>- 確率的判断のため、まれに誤操作の可能性</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            両者は補完関係。業務の特性に応じた使い分けをPOCで検討します。
          </p>
        </CardContent>
      </Card>

      {/* 詳細 (README) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FolderTree className="h-5 w-5 text-muted-foreground" />
            詳細
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <div>
            <h3 className="font-semibold mb-1">backoffice-automation-framework</h3>
            <p className="text-muted-foreground">AIによるバックオフィスオペレーション自動化フレームワーク。</p>
            <p className="text-muted-foreground mt-1">
              Claude Desktop Use を活用し、バックオフィス担当者のPC上で定型業務を自動化する仕組みを提供します。
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">ドキュメント</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>
                <a
                  href="https://github.com/ShinjiF1002/backofficeAI/blob/main/docs/architecture.md"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  アーキテクチャ設計書
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">ディレクトリ構成</h3>
            <pre className="text-xs bg-muted/50 p-3 rounded-md overflow-x-auto whitespace-pre font-mono">
{`backoffice-automation-framework/
├── manuals/              # 業務マニュアル（raw: 原本, parsed: LLM構造化済み）
├── procedures/           # [Tier 2] 実行可能手順定義（人間レビュー必須）
├── guardrails/           # [Tier 2] バリデーションルール（人間レビュー必須）
├── knowledge/            # [Tier 1] ナレッジベース（リアルタイム反映）
│   ├── corrections/      # ユーザ修正コメント（raw）
│   ├── staging/          # 未検証ナレッジ
│   ├── compiled/         # 検証済みナレッジ
│   └── edge_cases/       # エッジケース集
├── proposals/            # Procedure/Guardrail変更提案キュー
├── agents/               # エージェント定義（configs, prompts, tools）
├── runs/                 # 実行記録（全件保存、スクリーンショット含む）
├── evaluation/           # 品質追跡（metrics, reports, regression）
├── lint/                 # ナレッジベース健全性チェック
└── docs/                 # ドキュメント`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
