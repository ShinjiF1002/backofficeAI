# Crystalline UI 全面適用 — Gap Analysis Report

> backoffice-ai の全12画面を分析し、Crystalline UI (40 components) でカバーできる範囲と不足コンポーネントを特定する。

## 1. カバー済み — そのまま置き換え可能 (22 components)

Crystalline に既存で、backoffice-ai の現行実装を直接置き換えられるもの。

| backoffice-ai 現行                            | Crystalline 対応                                       | 使用箇所                         |
| --------------------------------------------- | ------------------------------------------------------ | -------------------------------- |
| Button (brand/ghost/outline)                  | Button (primary/secondary/warm/ghost/destructive/pill) | 全画面                           |
| Card (default/featured/tinted/interactive)    | Card (同一 variants)                                   | 全画面                           |
| Badge (default/secondary/destructive/outline) | Badge (同一 variants + ghost/link)                     | 全画面                           |
| StatusPill (7 tones)                          | StatusPill (5 tones)                                   | HomePage, RunHistory, Agents 等  |
| Input                                         | Input                                                  | CommentPage                      |
| Textarea                                      | Textarea                                               | CommentPage                      |
| Alert (5 variants)                            | Alert (5 variants)                                     | HomePage, Learning, Proposals 等 |
| Avatar + AvatarFallback                       | Avatar (full composite)                                | TopBar                           |
| Separator                                     | Separator                                              | Sidebar, 各ページ                |
| Switch                                        | Switch                                                 | (軽使用)                         |
| Table                                         | Table (composite)                                      | LearningStatus                   |
| KpiTile                                       | KpiTile                                                | HomePage, RunHistory, Guardrails |
| Num                                           | Num                                                    | KPI値表示全般                    |
| PageHeader (custom)                           | Heading + Text                                         | 全画面                           |
| LoadingSpinner                                | LoadingSpinner                                         | (追加予定)                       |
| EmptyState                                    | EmptyState                                             | (追加予定)                       |
| Skeleton                                      | Skeleton                                               | (追加予定)                       |
| Dialog                                        | Dialog                                                 | (現在未使用だが必要)             |
| DropdownMenu                                  | DropdownMenu                                           | (現在未使用だが必要)             |
| Tooltip                                       | Tooltip                                                | (現在未使用だが必要)             |
| Tabs                                          | Tabs (default/line)                                    | (現在未使用だが有用)             |
| ScrollArea                                    | ScrollArea                                             | (リスト系で有用)                 |

## 2. 部分カバー — 調整が必要 (5 components)

Crystalline に存在するが、backoffice-ai の要件と差異があるもの。

| コンポーネント           | 差異                                                                                                                                     | 対応方針                                                            |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Sidebar**              | backoffice-ai: セクションヘッダー付き階層ナビ (4グループ, ロールベースフィルタ), mobile drawer 連動。Crystalline: flat な items 配列のみ | **拡張必要**: grouped items, role filtering, mobile drawer 連動     |
| **NavHeader (→ TopBar)** | backoffice-ai: 通知ベル (赤ドットバッジ付き), Avatar+名前, ハンバーガーメニュー。Crystalline: children スロットのみ                      | **拡張必要**: notification slot, avatar slot, mobile menu trigger   |
| **BottomNav**            | backoffice-ai: 5タブ, ハッシュアンカーナビ, ドロワー開閉アクション, `/tasks/*` 時非表示。Crystalline: シンプルな items 配列              | **拡張必要**: hash navigation, conditional visibility, action items |
| **Timeline**             | backoffice-ai: RecentCorrectionsTimeline (author, date, diff, category badge 付き)。Crystalline: generic dot+label                       | **拡張必要**: rich content slots (author, diff, metadata)           |
| **StepProgress**         | backoffice-ai: ステップ名+ステータスの水平表示。Crystalline: 同等だが step 数の柔軟性を検証要                                            | **検証のみ**: 大きな差異なし                                        |

## 3. 未カバー — 新規追加が必要 (11 components)

backoffice-ai で使用されているが Crystalline に存在しないもの。

### 3a. 汎用コンポーネント (他プロジェクトでも再利用可能)

| コンポーネント              | 用途                                                                                                           | 優先度 |
| --------------------------- | -------------------------------------------------------------------------------------------------------------- | ------ |
| **Breadcrumb**              | ExecuteReview, Comment, Upgrade 各ページのパンくずナビ。現在はインラインで ChevronRight + Link を手書き        | **高** |
| **Accordion / Collapsible** | OverviewPage のアーキテクチャドキュメント折りたたみ。ChevronUp/Down トグル                                     | **中** |
| **RadioCardGroup**          | CommentPage のエラーカテゴリ選択 (5択ボタングリッド), スコープ選択 (2択)。現在は RadioGroup + カスタムスタイル | **高** |
| **GaugeBar**                | UpgradePage の精度ゲージ (グラデーションバー + 現在値/閾値マーカー)。Progress とは異なる                       | **中** |
| **DataGrid / DataTable**    | LearningStatusPage のワークフローテーブル (ソート, フィルタ, ステータス列)。Table primitive だけでは不足       | **中** |

### 3b. ドメイン固有コンポーネント (backoffice-ai 専用)

| コンポーネント      | 用途                                                                             | 優先度                                                      |
| ------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **CategoryIcon**    | 手続きカテゴリの色付きアイコン (送金, 口座開設, 請求書 等 6種)。全画面で使用     | **高** (ただし Crystalline ではなく backoffice-ai 内に配置) |
| **ConfidenceBadge** | AI 信頼度の3段階バッジ (90%+/70-90%/<70%)。StatusPill ベースだが閾値ロジック内蔵 | **中** (backoffice-ai 内)                                   |
| **FlywheelDiagram** | 学習ループの循環図 (detailed/compact)。3画面で使用                               | **低** (backoffice-ai 内)                                   |
| **POCPhaseBadge**   | POC フェーズ進捗 (strip/detailed)。2画面で使用                                   | **低** (backoffice-ai 内)                                   |
| **TrustModeBadge**  | 信頼レベル表示 (supervised/checkpoint/autonomous)。色はロック済み                | **中** (backoffice-ai 内)                                   |
| **CorrectionDiff**  | 修正前/後の pill 比較表示                                                        | **中** (backoffice-ai 内)                                   |

## 4. Recharts 統合

backoffice-ai は Recharts を直接使用:

- **AccuracyChart** (LineChart) — LearningStatusPage
- **Human Approvals BarChart** — LearningStatusPage
- **CostTrendCard** — LearningStatusPage

**方針**: `@crystalline-ui/charts` パッケージの需要がここで確定。ただし初期移行では backoffice-ai 内でラッパーを維持し、共通化は後回し。

## 5. レイアウトパターンの差異

| パターン                                              | backoffice-ai 現行                                            | Crystalline 現行         | Gap                                                                |
| ----------------------------------------------------- | ------------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------ |
| **AppShell** (Sidebar + TopBar + Content + BottomNav) | 独自実装 (260px sidebar, responsive drawer)                   | PageShell (content only) | **PageShell を AppShell に拡張、または別コンポーネントとして追加** |
| **StickyFooter**                                      | ExecuteReviewPage の承認ボタン (glass-panel, safe-area-inset) | なし                     | **新規追加推奨**                                                   |
| **ReadingLayout**                                     | OverviewPage, HowItWorksPage (max-w-4xl centered)             | PageShell (max-w-7xl)    | **variant 追加で対応可能**                                         |
| **DashboardLayout**                                   | LearningStatus, Agents (full-width, multi-column)             | PageShell                | **variant 追加で対応可能**                                         |

## 6. 移行優先度マトリクス

### Phase 1 — 基盤 (Crystalline 拡張)

1. **Sidebar 拡張** — grouped items, role filter, mobile drawer
2. **NavHeader 拡張** — notification/avatar/menu slots
3. **BottomNav 拡張** — hash nav, conditional visibility, action items
4. **Breadcrumb 新規** — 汎用パンくずナビ
5. **RadioCardGroup 新規** — 選択肢カード (CommentPage パターン)
6. **AppShell / PageShell 拡張** — Sidebar+TopBar+BottomNav 統合レイアウト

### Phase 2 — 画面移行 (高頻度画面から)

1. HomePage — KpiTile, StatusPill, Card, Timeline で大半カバー
2. ExecuteReviewPage — StepProgress, Alert, StickyFooter 追加
3. CommentPage — RadioCardGroup, Input, Textarea
4. RunHistoryPage — KpiTile, ListRow, StatusPill

### Phase 3 — 残り画面 + 高度コンポーネント

1. ProposalReviewPage — バッチ承認UI (未実装機能)
2. LearningStatusPage — Recharts 統合, DataTable
3. UpgradePage — GaugeBar, ModeComparison
4. GuardrailsPage, AgentsPage, RepositoryPage
5. OverviewPage, HowItWorksPage (静的コンテンツ、優先度低)

## 7. サマリ

| 区分                            | 件数 |
| ------------------------------- | ---- |
| そのまま置き換え可能            | 22   |
| 調整・拡張が必要                | 5    |
| 汎用コンポーネント新規追加      | 5    |
| ドメイン固有 (backoffice-ai 内) | 6    |
| レイアウトパターン Gap          | 4    |

**結論**: Crystalline UI の既存 40 コンポーネントで backoffice-ai の **約 60%** をカバー可能。残りは Sidebar/NavHeader/BottomNav の拡張 (3件) + 汎用コンポーネント追加 (5件) で **約 85%** に到達。ドメイン固有コンポーネント (6件) は backoffice-ai 内に残す。
