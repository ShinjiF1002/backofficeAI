import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Num,
  Heading,
  Text,
  FadeIn,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "crystalline-ui";
import {
  Server,
  ShieldCheck,
  FileText,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ChevronDown,
  Wallet,
  Zap,
  Info,
  Compass,
  GitBranch,
  Users,
  KeyRound,
  Hourglass,
  Gavel,
  PhoneOff,
  CalendarOff,
  Gauge,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import architectureDoc from "../../../docs/architecture.md?raw";
import FlywheelDiagram from "@/components/shared/FlywheelDiagram";
import POCPhaseBadge from "@/components/shared/POCPhaseBadge";
import { learningMetrics, costMetrics, pocPhases } from "@/data/mockData";

const tintClasses = {
  emerald: "border-emerald-200/60 bg-emerald-50/40",
  amber: "border-amber-200/60 bg-amber-50/40",
  slate: "border-slate-200/60 bg-slate-50/40",
  primary: "border-primary/20 bg-primary/5",
} as const;

type ConstraintItem = { icon: LucideIcon; title: string; description: string };
type ConstraintCategory = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  tint: "slate" | "amber" | "none";
  items: ConstraintItem[];
};

const constraints: ConstraintCategory[] = [
  {
    icon: FileText,
    title: "前提となる事項",
    subtitle: "本提案の設計判断",
    tint: "slate",
    items: [
      {
        icon: GitBranch,
        title: "既存業務フローを前提に自動化",
        description:
          "BPR（業務プロセス改革）はスコープ外。現行手順の効率性はそのまま受け継ぎます。",
      },
      {
        icon: Users,
        title: "担当者の継続的な修正協力が必要",
        description:
          "AI の精度向上は修正コメントに依存します。協力が途絶えるとフライホイールが停滞します。",
      },
      {
        icon: KeyRound,
        title: "既存アプリの改修は原則不要",
        description:
          "ただし SSO 未整備のアプリは、VM 毎の認証基盤整備が情シス部の追加対応として必要。",
      },
    ],
  },
  {
    icon: Server,
    title: "外部環境への依存",
    subtitle: "他者の協力が必要",
    tint: "amber",
    items: [
      {
        icon: Hourglass,
        title: "Claude Computer Use のエンタープライズ版 GA",
        description:
          "現在 Anthropic 社のリサーチプレビュー段階。本格展開開始は GA 後（時期は未確定）。",
      },
      {
        icon: Gavel,
        title: "規制当局との方針合意（継続的）",
        description:
          "金融庁 AI 利用ガイドライン、FISC 安全対策基準、個人情報保護法への対応方針を法務・コンプラ部門と確定する必要。",
      },
    ],
  },
  {
    icon: Info,
    title: "自動化対象外の業務特性",
    subtitle: "引き続き人手処理が効率的な領域",
    tint: "none",
    items: [
      {
        icon: PhoneOff,
        title: "画面外情報を必要とする判断",
        description:
          "電話での補足、口頭の申し送り、紙メモを参照する業務は本フレームワークで処理できません。",
      },
      {
        icon: CalendarOff,
        title: "低頻度業務",
        description: "実績が蓄積せず、信頼レベルの昇格が困難です。",
      },
      {
        icon: Gauge,
        title: "瞬間的な大量処理が必要な業務",
        description:
          "処理速度は人間と同等程度。瞬発力ではなく、夜間・休日稼働を含めた総処理量で効果を発揮します。",
      },
    ],
  },
];

function ItemRow({ icon: Icon, title, description }: ConstraintItem) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-[1.4]">{title}</p>
        <p className="text-xs text-muted-foreground leading-[1.4] mt-0.5">
          {description}
        </p>
      </div>
    </div>
  );
}

function CategoryCard({
  icon: Icon,
  title,
  subtitle,
  tint,
  items,
}: ConstraintCategory) {
  const tintClass =
    tint === "slate"
      ? tintClasses.slate
      : tint === "amber"
        ? tintClasses.amber
        : "";
  return (
    <Card size="sm" className={tintClass}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2 leading-[1.4]">
          <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
          {title}
        </CardTitle>
        <p className="text-xs text-muted-foreground leading-[1.4]">
          {subtitle}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item, i) => (
            <ItemRow key={i} {...item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function OverviewPage() {
  const navigate = useNavigate();

  const cumulative = learningMetrics.reduce(
    (acc, m) => ({
      corrections: acc.corrections + m.correctionsIn,
      knowledge: m.knowledgeCompiled,
      proposals: acc.proposals + m.proposalsGenerated,
      approved: acc.approved + m.proposalsApproved,
    }),
    { corrections: 0, knowledge: 0, proposals: 0, approved: 0 },
  );

  const latestCost = costMetrics[costMetrics.length - 1];

  return (
    <div className="space-y-8 max-w-4xl">
      <FadeIn>
        <Heading as="h1">AI によるバックオフィス省力化</Heading>
        <Text muted>担当者と同じPC・画面を操作し、定型業務を自動化します</Text>
      </FadeIn>

      <FadeIn index={1}>
        <Card variant="tinted">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-base leading-[1.4]">
                POC 進行状況
              </CardTitle>
              <Badge className="text-xs">現在 Phase 2 実施中</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <POCPhaseBadge phases={pocPhases} variant="strip" />
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn index={2}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">何を実現するのか</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              送金処理や口座開設といったバックオフィス業務の多くは、担当者がマニュアルに沿って画面を操作する定型作業です。
              この「マニュアルに沿った画面操作」を AI
              に代行させることで、人件費を構造的に削減します。
            </p>
            <p>
              AI は担当者と同じ PC
              上で、同じ業務アプリケーションを、同じ手順で操作します。
              <strong>新しいシステムの導入や既存システムの改修は不要</strong>
              です。現在の業務環境をそのまま活用します。
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate("/home")}
              >
                オペレータ画面を見る <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn index={3}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              継続的に賢くなる仕組み
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              担当者の気づき（修正コメント）が、AI
              の判断精度を継続的に向上させます
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
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn index={4}>
        <div>
          <h2 className="text-base font-semibold mb-3 leading-[1.4]">
            現状の課題
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
            {[
              {
                icon: FileText,
                title: "定型作業に人手を割いている",
                desc: "送金・口座開設・請求書承認など",
              },
              {
                icon: AlertTriangle,
                title: "退職・異動でノウハウが流出",
                desc: "暗黙知が属人化",
              },
              {
                icon: TrendingUp,
                title: "教育コストが人数に比例",
                desc: "新人ごとに同じ教育が必要",
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="pt-4 pb-4">
                  <item.icon className="h-6 w-6 text-amber-500 mb-2" />
                  <p className="text-sm font-medium leading-[1.4]">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-[1.4]">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </FadeIn>

      <div className="flex items-center justify-center">
        <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
      </div>

      <FadeIn index={5}>
        <div>
          <h2 className="text-base font-semibold mb-3 leading-[1.4]">
            本提案のアプローチ
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
            {[
              {
                icon: Server,
                title: "AI が同じ画面を同じ手順で操作",
                desc: "既存システムの改修は不要",
                color: "text-emerald-600",
              },
              {
                icon: ShieldCheck,
                title: "ナレッジが組織に蓄積",
                desc: "退職しても失われない",
                color: "text-teal-600",
              },
              {
                icon: TrendingUp,
                title: "一度の学習が全エージェントに共有",
                desc: "教育コストは一定",
                color: "text-violet-600",
              },
            ].map((item) => (
              <Card key={item.title} className={tintClasses.emerald}>
                <CardContent className="pt-4 pb-4">
                  <item.icon className={`h-6 w-6 ${item.color} mb-2`} />
                  <p className="text-sm font-medium leading-[1.4]">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-[1.4]">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn index={6}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">安全設計の4原則</CardTitle>
            <p className="text-xs text-muted-foreground">
              銀行業務における正確性とデータ管理の重要性を踏まえた設計
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                {
                  title: "業務データは自社管理下から出ない",
                  desc: "AI 基盤を自社クラウドテナント上にホスト。データ通信は社内で完結。",
                },
                {
                  title: "すべての変更は人間が承認",
                  desc: "手順変更もチェックルール追加も、例外なく人間のレビューが必要。",
                },
                {
                  title: "すべての操作を記録",
                  desc: "画面キャプチャを含む完全な操作証跡。監査対応。",
                },
                {
                  title: "信頼は実績で獲得",
                  desc: "初期は全ステップ人間承認。実績に基づき段階的に自律化。高リスク業務は完全自律化しない。",
                },
              ].map((item) => (
                <Card key={item.title} size="sm">
                  <CardContent className="flex gap-3 py-3">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-[1.4]">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 leading-[1.4]">
                        {item.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn index={7}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              コストと効果のバランス（POC 実績）
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              POC で定量的に検証します。本格展開時の ROI 試算の基礎となります。
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4 text-sm">
              <Card size="sm" className={tintClasses.emerald}>
                <CardContent className="py-3">
                  <p className="text-xs text-muted-foreground font-medium mb-1 leading-[1.4]">
                    想定削減効果（月次）
                  </p>
                  <p className="text-lg font-semibold text-emerald-700">
                    <Num>
                      ¥{latestCost.estimatedSavingsJpy.toLocaleString()}
                    </Num>
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-[1.4]">
                    定型業務の人件費換算
                  </p>
                </CardContent>
              </Card>
              <Card size="sm" className={tintClasses.amber}>
                <CardContent className="py-3">
                  <p className="text-xs text-muted-foreground font-medium mb-1 leading-[1.4]">
                    AI API 費用（月次）
                  </p>
                  <p className="text-lg font-semibold text-amber-700">
                    <Num>¥{latestCost.totalApiCostJpy.toLocaleString()}</Num>
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-[1.4]">
                    操作ステップごとに画面解析が発生
                  </p>
                </CardContent>
              </Card>
              <Card size="sm" className={tintClasses.primary}>
                <CardContent className="py-3">
                  <p className="text-xs text-muted-foreground font-medium mb-1 leading-[1.4]">
                    差引ネット効果
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    <Num>¥{latestCost.netBenefitJpy.toLocaleString()}</Num>
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-[1.4]">
                    2026-03 月の実績
                  </p>
                </CardContent>
              </Card>
            </div>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              POC 期間中は通常業務に加えて AI
              の監督・承認作業が発生するため、一時的に業務負荷が増加します。
              本格展開時には、信頼レベル昇格により承認作業が段階的に削減されます。
            </p>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn index={8}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-muted-foreground" />
              AI の特性と限界
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              判断の適切な前提となる条件
            </p>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground mt-0.5">・</span>
                <span>
                  <strong>画面内の情報のみで判断</strong>:
                  電話での補足情報や口頭の申し送りは考慮できません
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground mt-0.5">・</span>
                <span>
                  <strong>処理速度は人間と同等程度</strong>:
                  1件あたりの速度ではなく、夜間・休日稼働を含めた総処理量で効果を発揮
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground mt-0.5">・</span>
                <span>
                  <strong>確率的判断のため、まれに誤判定</strong>:
                  全ステップの人間承認、操作ログの完全記録、段階的な自律化で対処
                </span>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground pt-2 leading-relaxed">
              POC では、自動化に適した業務の見極めも検証項目に含めます。
            </p>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn index={9}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 leading-[1.4]">
              <Compass className="h-5 w-5 text-muted-foreground" />
              本提案の前提と制約
            </CardTitle>
            <p className="text-xs text-muted-foreground leading-[1.4]">
              本フレームワークが成立する条件と、対象範囲外の業務
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {constraints.map((cat) => (
              <CategoryCard key={cat.title} {...cat} />
            ))}
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn index={10}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">従来の RPA との違い</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
              <Card size="sm" className={tintClasses.slate}>
                <CardContent className="py-3">
                  <Badge variant="secondary" className="mb-2">
                    RPA
                  </Badge>
                  <ul className="space-y-1 text-xs text-muted-foreground leading-[1.5]">
                    <li>+ 動作が完全に決定的、予測可能性が高い</li>
                    <li>+ 高頻度・高速処理に強い</li>
                    <li>- UI の軽微な変更で動作不能に</li>
                    <li>- その都度プログラム修正が必要</li>
                  </ul>
                </CardContent>
              </Card>
              <Card size="sm" className={tintClasses.emerald}>
                <CardContent className="py-3">
                  <Badge className="mb-2">本提案の AI</Badge>
                  <ul className="space-y-1 text-xs text-muted-foreground leading-[1.5]">
                    <li>+ マニュアルの「意図」を理解して操作</li>
                    <li>+ UI 変更への耐性が高い</li>
                    <li>+ 使うほど賢くなる（ナレッジ蓄積）</li>
                    <li>- 確率的判断のため、まれに誤操作の可能性</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              両者は補完関係。業務の特性に応じた使い分けを POC で検討します。
            </p>
          </CardContent>
        </Card>
      </FadeIn>

      {/* アーキテクチャ設計書（折りたたみ） */}
      <FadeIn index={12}>
        <Card>
          <Collapsible>
            <CardHeader className="pb-3">
              <CollapsibleTrigger asChild>
                <button className="flex items-center justify-between w-full text-left">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    アーキテクチャ設計書（技術詳細）
                  </CardTitle>
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 data-[state=open]:rotate-180" />
                </button>
              </CollapsibleTrigger>
              <p className="text-xs text-muted-foreground">
                エンジニア向けの技術詳細ドキュメント
              </p>
            </CardHeader>
            <CollapsibleContent>
              <CardContent>
                <article className="max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-light font-display tracking-normal leading-[1.4] mt-0 mb-6 text-gradient-brand">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-lg font-semibold tracking-normal leading-[1.4] mt-10 mb-4 pb-2 border-b border-primary/10 flex items-center gap-2">
                          <span className="w-1 h-5 rounded-full bg-gradient-to-b from-primary to-[var(--primary-gradient-to)]" />
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-[15px] font-semibold tracking-normal leading-[1.4] mt-8 mb-3 text-foreground flex items-center gap-2.5">
                          <span className="w-6 h-px bg-primary/40 shrink-0" />
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="text-sm font-semibold tracking-normal leading-[1.4] mt-5 mb-2 text-foreground/80">
                          {children}
                        </h4>
                      ),
                      p: ({ children }) => (
                        <p className="text-sm leading-[1.8] my-3 max-w-[42em] text-foreground/80">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="my-3 space-y-2 pl-0 list-none">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-outside pl-5 my-3 space-y-2">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-sm leading-[1.7] pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/30">
                          {children}
                        </li>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-foreground bg-primary/5 px-0.5 rounded">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <span className="font-semibold text-primary/80">
                          {children}
                        </span>
                      ),
                      a: ({ children, href }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary font-medium hover:underline underline-offset-2"
                        >
                          {children}
                        </a>
                      ),
                      code: ({ children, ...props }) => {
                        const isInline =
                          !("data-language" in props) &&
                          typeof children === "string" &&
                          !children.includes("\n");
                        return isInline ? (
                          <code className="text-xs bg-primary/5 text-primary border border-primary/10 px-1.5 py-0.5 rounded-md font-mono">
                            {children}
                          </code>
                        ) : (
                          <code className="text-xs font-mono">{children}</code>
                        );
                      },
                      pre: ({ children }) => (
                        <pre className="text-xs bg-slate-950 text-slate-200 border border-slate-800 rounded-xl p-4 my-4 overflow-x-auto whitespace-pre shadow-crystal-sm">
                          {children}
                        </pre>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="relative text-sm text-foreground/80 bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-xl pl-5 pr-4 py-4 my-6 shadow-crystal-sm">
                          <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-gradient-to-b from-primary to-[var(--primary-gradient-to)]" />
                          {children}
                        </blockquote>
                      ),
                      hr: () => (
                        <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                      ),
                      table: ({ children }) => (
                        <div className="my-5 overflow-x-auto rounded-xl border border-border shadow-crystal-sm">
                          <table className="text-xs w-full">{children}</table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="bg-muted/60 border-b border-border">
                          {children}
                        </thead>
                      ),
                      th: ({ children }) => (
                        <th className="font-semibold px-4 py-2.5 text-left text-foreground/70 text-[11px] uppercase tracking-wider">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="px-4 py-2.5 border-b border-border/50 align-top">
                          {children}
                        </td>
                      ),
                    }}
                  >
                    {architectureDoc}
                  </ReactMarkdown>
                </article>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </FadeIn>
    </div>
  );
}
