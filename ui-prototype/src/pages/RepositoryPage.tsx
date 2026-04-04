import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FolderOpen, FileText, Shield, Lightbulb, GitPullRequest, Bot, ClipboardList, BarChart3, Search, BookOpen } from 'lucide-react'

interface FolderItemProps {
  icon: typeof FolderOpen
  name: string
  tier?: '1' | '2'
  desc: string
  children?: { name: string; desc: string }[]
  color?: string
}

function FolderItem({ icon: Icon, name, tier, desc, children, color = 'text-muted-foreground' }: FolderItemProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-start gap-2">
        <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${color}`} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-semibold">{name}/</span>
            {tier && (
              <Badge variant={tier === '2' ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0">
                Tier {tier}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      {children && (
        <div className="ml-6 border-l border-border pl-3 space-y-1.5">
          {children.map(child => (
            <div key={child.name}>
              <span className="text-xs font-mono text-muted-foreground">{child.name}</span>
              <span className="text-xs text-muted-foreground"> — {child.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function RepositoryPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">リポジトリ構成</h1>
        <p className="text-muted-foreground mt-1">システムを構成するデータとファイルの全体像</p>
      </div>

      {/* Overview Diagram */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">全体構成図</CardTitle>
          <p className="text-xs text-muted-foreground">
            すべてのデータはGitリポジトリで管理。変更履歴が完全に追跡可能です。
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">

            {/* manuals */}
            <FolderItem
              icon={BookOpen}
              name="manuals"
              desc="原本（ユーザ提供の業務マニュアル）"
              color="text-blue-500"
              children={[
                { name: 'raw/', desc: 'アップロードされたままのマニュアル' },
                { name: 'parsed/', desc: 'AIが構造化・分割したもの' },
              ]}
            />

            {/* procedures */}
            <FolderItem
              icon={ClipboardList}
              name="procedures"
              tier="2"
              desc="実行可能な手順定義"
              color="text-violet-500"
              children={[
                { name: '{domain}/{procedure}.md', desc: '人間可読な手順書' },
                { name: '{domain}/{procedure}.schema.yaml', desc: '機械可読な手順定義' },
                { name: '_index.md', desc: '自動生成される目次・依存グラフ' },
              ]}
            />

            {/* guardrails */}
            <FolderItem
              icon={Shield}
              name="guardrails"
              tier="2"
              desc="バリデーションルール（ガードレール）"
              color="text-red-500"
              children={[
                { name: '{domain}/{rule}.yaml', desc: 'ルール定義（severity: error/warning）' },
                { name: '_index.md', desc: 'ガードレール一覧・対応手順' },
              ]}
            />

            {/* knowledge */}
            <FolderItem
              icon={Lightbulb}
              name="knowledge"
              tier="1"
              desc="リアルタイム反映ナレッジ"
              color="text-teal-500"
              children={[
                { name: 'corrections/', desc: 'ユーザ修正コメント（raw）' },
                { name: 'staging/', desc: '未検証ナレッジ（即時参照可、低重み）' },
                { name: 'compiled/', desc: '検証済みナレッジ（正式知見）' },
                { name: 'edge_cases/', desc: '発見されたエッジケース集' },
                { name: 'error_taxonomy.md', desc: 'エラー分類体系' },
              ]}
            />

            {/* proposals */}
            <FolderItem
              icon={GitPullRequest}
              name="proposals"
              desc="手順・ガードレールの変更提案キュー"
              color="text-amber-500"
              children={[
                { name: 'pending/', desc: 'レビュー待ちの提案' },
                { name: 'approved/', desc: '承認済みの提案' },
                { name: 'rejected/', desc: '却下された提案' },
              ]}
            />

            {/* agents */}
            <FolderItem
              icon={Bot}
              name="agents"
              desc="エージェント定義"
              color="text-indigo-500"
              children={[
                { name: 'configs/', desc: '担当手順、信頼レベル、ツール権限' },
                { name: 'prompts/', desc: 'システムプロンプトテンプレート' },
                { name: 'tools/', desc: 'カスタムツール定義' },
              ]}
            />

            {/* runs */}
            <FolderItem
              icon={FileText}
              name="runs"
              desc="実行記録（全件保存、保持期間制限なし）"
              color="text-emerald-500"
              children={[
                { name: 'plan.md', desc: '実行前の計画' },
                { name: 'execution_log.md', desc: 'ステップごとの実行ログ' },
                { name: 'screenshots/', desc: '画面キャプチャ' },
                { name: 'approval.yaml', desc: '承認記録（who, when, decision）' },
                { name: 'feedback.md', desc: 'ユーザの修正コメント' },
              ]}
            />

            {/* evaluation */}
            <FolderItem
              icon={BarChart3}
              name="evaluation"
              desc="品質追跡"
              color="text-pink-500"
              children={[
                { name: 'metrics/', desc: '手順別の精度・介入率・処理時間' },
                { name: 'reports/', desc: '定期レポート' },
                { name: 'regression/', desc: '承認済みrunから自動生成されたテストケース' },
              ]}
            />

            {/* lint */}
            <FolderItem
              icon={Search}
              name="lint"
              desc="ナレッジベース健全性チェック"
              color="text-orange-500"
              children={[
                { name: 'rules/', desc: 'lintルール定義' },
                { name: 'reports/', desc: 'lint結果' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tier Explanation */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-teal-200 bg-teal-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Badge variant="secondary">Tier 1</Badge>
              リアルタイム反映
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p><strong>対象:</strong> knowledge/</p>
            <p><strong>反映:</strong> 修正コメント → 即座にAIが参照可能</p>
            <p><strong>人間レビュー:</strong> 不要（矛盾検出時のみフラグ）</p>
            <p><strong>役割:</strong> AIへの文脈情報。手順そのものは変えない。</p>
          </CardContent>
        </Card>

        <Card className="border-slate-300 bg-slate-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Badge>Tier 2</Badge>
              人間レビュー必須
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p><strong>対象:</strong> procedures/ + guardrails/</p>
            <p><strong>反映:</strong> 提案 → 人間レビュー → 承認後に反映</p>
            <p><strong>人間レビュー:</strong> 必須（例外なし）</p>
            <p><strong>役割:</strong> 実行手順とバリデーションルール。逸脱不可。</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Flow */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">データの流れ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {[
              { label: 'manuals/', color: 'bg-blue-100 text-blue-700 border-blue-200' },
              { label: '→', color: '' },
              { label: 'procedures/', color: 'bg-violet-100 text-violet-700 border-violet-200' },
              { label: '+', color: '' },
              { label: 'guardrails/', color: 'bg-red-100 text-red-700 border-red-200' },
              { label: '+', color: '' },
              { label: 'knowledge/', color: 'bg-teal-100 text-teal-700 border-teal-200' },
              { label: '→', color: '' },
              { label: 'エージェント実行', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
              { label: '→', color: '' },
              { label: 'runs/', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
              { label: '→', color: '' },
              { label: 'evaluation/', color: 'bg-pink-100 text-pink-700 border-pink-200' },
            ].map((item, i) =>
              item.color ? (
                <span key={i} className={`px-2 py-1 rounded border font-medium ${item.color}`}>{item.label}</span>
              ) : (
                <span key={i} className="text-muted-foreground">{item.label}</span>
              )
            )}
          </div>
          <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-muted-foreground">フィードバックループ:</span>
            <span className="px-2 py-1 rounded border bg-emerald-100 text-emerald-700 border-emerald-200 font-medium">runs/feedback</span>
            <span className="text-muted-foreground">→</span>
            <span className="px-2 py-1 rounded border bg-teal-100 text-teal-700 border-teal-200 font-medium">knowledge/</span>
            <span className="text-muted-foreground">→</span>
            <span className="px-2 py-1 rounded border bg-amber-100 text-amber-700 border-amber-200 font-medium">proposals/</span>
            <span className="text-muted-foreground">→ 人間承認 →</span>
            <span className="px-2 py-1 rounded border bg-violet-100 text-violet-700 border-violet-200 font-medium">procedures/</span>
          </div>
        </CardContent>
      </Card>

      {/* Agent Execution Context */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">エージェント実行時の情報合成</CardTitle>
          <p className="text-xs text-muted-foreground">エージェントは以下の優先順位で情報を使用します</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { priority: '1', label: 'procedure.schema.yaml', desc: '実行手順（最優先、逸脱不可）', color: 'bg-violet-50 border-violet-200' },
              { priority: '2', label: 'guardrails/*.yaml', desc: '各ステップのバリデーション（違反時はブロックまたは警告）', color: 'bg-red-50 border-red-200' },
              { priority: '3', label: 'knowledge/compiled/', desc: '文脈情報（参考情報として使用、直接の行動変更はしない）', color: 'bg-teal-50 border-teal-200' },
              { priority: '4', label: 'knowledge/staging/', desc: '未検証情報（最低重み、注意喚起のみ）', color: 'bg-slate-50 border-slate-200' },
            ].map(item => (
              <div key={item.priority} className={`flex items-start gap-3 p-3 rounded-lg border ${item.color}`}>
                <span className="text-xs font-bold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center shrink-0">{item.priority}</span>
                <div>
                  <span className="text-sm font-mono font-medium">{item.label}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
