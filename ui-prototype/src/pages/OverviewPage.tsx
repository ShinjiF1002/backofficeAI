import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Server, ShieldCheck, FileText, TrendingUp, AlertTriangle, ArrowRight,
  BookOpen, ChevronDown, ChevronUp, Scale, Wallet, Zap, Info,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import architectureDoc from '../../../docs/architecture.md?raw'
import FlywheelDiagram from '@/components/shared/FlywheelDiagram'
import POCPhaseBadge from '@/components/shared/POCPhaseBadge'
import { Num } from '@/components/shared/Num'
import { learningMetrics, costMetrics, pocPhases } from '@/data/mockData'

export default function OverviewPage() {
  const navigate = useNavigate()
  const [archOpen, setArchOpen] = useState(false)

  // 最新週の学習メトリクスから累計を算出
  const cumulative = learningMetrics.reduce(
    (acc, m) => ({
      corrections: acc.corrections + m.correctionsIn,
      knowledge: m.knowledgeCompiled, // 最新週の値
      proposals: acc.proposals + m.proposalsGenerated,
      approved: acc.approved + m.proposalsApproved,
    }),
    { corrections: 0, knowledge: 0, proposals: 0, approved: 0 }
  )

  const latestCost = costMetrics[costMetrics.length - 1]

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal leading-[1.4]">AI によるバックオフィス省力化</h1>
        <p className="text-muted-foreground mt-1">担当者と同じPC・画面を操作し、定型業務を自動化します</p>
      </div>

      {/* POCフェーズ進捗（現在地の明示） */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base">POC 進行状況</CardTitle>
            <Badge className="text-xs">現在 Phase 2 実施中</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <POCPhaseBadge phases={pocPhases} variant="strip" />
        </CardContent>
      </Card>

      {/* What */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">何を実現するのか</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <p>
            送金処理や口座開設といったバックオフィス業務の多くは、担当者がマニュアルに沿って画面を操作する定型作業です。
            この「マニュアルに沿った画面操作」を AI に代行させることで、人件費を構造的に削減します。
          </p>
          <p>
            AI は担当者と同じ PC 上で、同じ業務アプリケーションを、同じ手順で操作します。
            <strong>新しいシステムの導入や既存システムの改修は不要</strong>です。現在の業務環境をそのまま活用します。
          </p>
          <div className="pt-2">
            <Button variant="brand" size="sm" onClick={() => navigate('/home')}>
              オペレータ画面を見る <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 学習フライホイール — 本提案の中核 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            継続的に賢くなる仕組み
          </CardTitle>
          <p className="text-xs text-muted-foreground">担当者の気づき（修正コメント）が、AI の判断精度を継続的に向上させます</p>
        </CardHeader>
        <CardContent>
          <FlywheelDiagram
            correctionsIn={cumulative.corrections}
            knowledgeCompiled={cumulative.knowledge}
            proposalsGenerated={cumulative.proposals}
            proposalsApproved={cumulative.approved}
            variant="detailed"
          />
        </CardContent>
      </Card>

      {/* 現状の課題 → 本提案の価値 */}
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

      <div className="flex items-center justify-center">
        <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
      </div>

      <div>
        <h2 className="text-base font-semibold mb-3">本提案のアプローチ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { icon: Server, title: 'AI が同じ画面を同じ手順で操作', desc: '既存システムの改修は不要', color: 'text-emerald-500' },
            { icon: ShieldCheck, title: 'ナレッジが組織に蓄積', desc: '退職しても失われない', color: 'text-blue-500' },
            { icon: TrendingUp, title: '一度の学習が全エージェントに共有', desc: '教育コストは一定', color: 'text-violet-500' },
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

      {/* 安全設計 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">安全設計の4原則</CardTitle>
          <p className="text-xs text-muted-foreground">銀行業務における正確性とデータ管理の重要性を踏まえた設計</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[
              { title: '業務データは自社管理下から出ない', desc: 'AI 基盤を自社クラウドテナント上にホスト。データ通信は社内で完結。' },
              { title: 'すべての変更は人間が承認', desc: '手順変更もチェックルール追加も、例外なく人間のレビューが必要。' },
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

      {/* コスト両面 — 人件費削減効果と AI 運用費を正直に */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            コストと効果のバランス（POC 実績）
          </CardTitle>
          <p className="text-xs text-muted-foreground">POC で定量的に検証します。本格展開時の ROI 試算の基礎となります。</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
            <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200">
              <p className="text-xs text-muted-foreground font-medium mb-1">想定削減効果（月次）</p>
              <p className="text-lg font-semibold text-emerald-700"><Num>¥{latestCost.estimatedSavingsJpy.toLocaleString()}</Num></p>
              <p className="text-[11px] text-muted-foreground mt-1">定型業務の人件費換算</p>
            </div>
            <div className="p-3 rounded-md bg-amber-50 border border-amber-200">
              <p className="text-xs text-muted-foreground font-medium mb-1">AI API 費用（月次）</p>
              <p className="text-lg font-semibold text-amber-700"><Num>¥{latestCost.totalApiCostJpy.toLocaleString()}</Num></p>
              <p className="text-[11px] text-muted-foreground mt-1">操作ステップごとに画面解析が発生</p>
            </div>
            <div className="p-3 rounded-md bg-primary/10 border border-primary/30">
              <p className="text-xs text-muted-foreground font-medium mb-1">差引ネット効果</p>
              <p className="text-lg font-semibold text-primary"><Num>¥{latestCost.netBenefitJpy.toLocaleString()}</Num></p>
              <p className="text-[11px] text-muted-foreground mt-1">2026-03 月の実績</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            POC 期間中は通常業務に加えて AI の監督・承認作業が発生するため、一時的に業務負荷が増加します。
            本格展開時には、信頼レベル昇格により承認作業が段階的に削減されます。
          </p>
        </CardContent>
      </Card>

      {/* Desktop Use の特性と限界 — 正直に記載 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-muted-foreground" />
            AI の特性と限界
          </CardTitle>
          <p className="text-xs text-muted-foreground">判断の適切な前提となる条件</p>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground mt-0.5">・</span>
              <span><strong>画面内の情報のみで判断</strong>: 電話での補足情報や口頭の申し送りは考慮できません</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground mt-0.5">・</span>
              <span><strong>処理速度は人間と同等程度</strong>: 1件あたりの速度ではなく、夜間・休日稼働を含めた総処理量で効果を発揮</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground mt-0.5">・</span>
              <span><strong>確率的判断のため、まれに誤判定</strong>: 全ステップの人間承認、操作ログの完全記録、段階的な自律化で対処</span>
            </li>
          </ul>
          <p className="text-xs text-muted-foreground pt-2 leading-relaxed">
            POC では、自動化に適した業務の見極めも検証項目に含めます。
          </p>
        </CardContent>
      </Card>

      {/* 規制対応 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Scale className="h-5 w-5 text-muted-foreground" />
            規制対応
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed">
          <p>
            金融庁の AI 利用に関するガイドラインおよび関連する業務規制への準拠は必須要件です。
            POC の初期フェーズ（Phase 1）において、対象業務ごとの規制要件の調査と対応方針の整理を実施済みです。
          </p>
        </CardContent>
      </Card>

      {/* RPA Comparison */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">従来の RPA との違い</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
            <div className="p-3 rounded-md bg-muted/50">
              <Badge variant="secondary" className="mb-2">RPA</Badge>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>+ 動作が完全に決定的、予測可能性が高い</li>
                <li>+ 高頻度・高速処理に強い</li>
                <li>- UI の軽微な変更で動作不能に</li>
                <li>- その都度プログラム修正が必要</li>
              </ul>
            </div>
            <div className="p-3 rounded-md bg-emerald-50/50 border border-emerald-200">
              <Badge className="mb-2">本提案の AI</Badge>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>+ マニュアルの「意図」を理解して操作</li>
                <li>+ UI 変更への耐性が高い</li>
                <li>+ 使うほど賢くなる（ナレッジ蓄積）</li>
                <li>- 確率的判断のため、まれに誤操作の可能性</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            両者は補完関係。業務の特性に応じた使い分けを POC で検討します。
          </p>
        </CardContent>
      </Card>

      {/* アーキテクチャ設計書（折りたたみ） */}
      <Card>
        <CardHeader className="pb-3">
          <button
            className="flex items-center justify-between w-full text-left"
            onClick={() => setArchOpen(!archOpen)}
          >
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              アーキテクチャ設計書（技術詳細）
            </CardTitle>
            {archOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          <p className="text-xs text-muted-foreground">エンジニア向けの技術詳細ドキュメント</p>
        </CardHeader>
        {archOpen && (
          <CardContent>
            <article className="max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 className="text-2xl font-semibold tracking-normal leading-[1.4] mt-0 mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-semibold tracking-normal leading-[1.4] mt-8 mb-3 border-b pb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-semibold tracking-normal leading-[1.4] mt-6 mb-2">{children}</h3>,
                  h4: ({ children }) => <h4 className="text-sm font-semibold tracking-normal leading-[1.4] mt-4 mb-2">{children}</h4>,
                  p: ({ children }) => <p className="text-sm leading-[1.7] my-3 max-w-[40em]">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-outside pl-5 my-3 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-outside pl-5 my-3 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  em: ({ children }) => <span className="font-semibold text-foreground">{children}</span>,
                  a: ({ children, href }) => (
                    <a href={href} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                      {children}
                    </a>
                  ),
                  code: ({ children, ...props }) => {
                    const isInline = !('data-language' in props) && typeof children === 'string' && !children.includes('\n')
                    return isInline ? (
                      <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">{children}</code>
                    ) : (
                      <code className="text-xs font-mono">{children}</code>
                    )
                  },
                  pre: ({ children }) => (
                    <pre className="text-xs bg-muted/50 border rounded-md p-3 my-3 overflow-x-auto whitespace-pre">{children}</pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="text-sm text-muted-foreground border-l-4 border-primary/50 pl-4 my-3">
                      {children}
                    </blockquote>
                  ),
                  hr: () => <hr className="my-6 border-border" />,
                  table: ({ children }) => (
                    <div className="my-4 overflow-x-auto">
                      <table className="text-xs border-collapse w-full">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
                  th: ({ children }) => <th className="font-semibold px-3 py-2 border text-left">{children}</th>,
                  td: ({ children }) => <td className="px-3 py-2 border align-top">{children}</td>,
                }}
              >
                {architectureDoc}
              </ReactMarkdown>
            </article>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
