# バックオフィスオペレーション自動化 アーキテクチャ設計書

---

## エグゼクティブサマリー: AIによるバックオフィス省力化のご提案

> **本提案の位置づけ:** AI基盤（Claude）を自社クラウドテナント上にホストし、AIによる画面操作技術（Desktop Use）を用いてバックオフィス業務を自動化するコンセプトのご提案です。自社テナントでのDesktop Use利用が可能になる時期を見据え、その実現時にPOCを迅速に開始できるよう、仕組みの全体像と進め方を整理しています。

### 何を実現するのか

送金処理や口座開設といったバックオフィス業務の多くは、担当者がマニュアルに沿って画面を操作する定型作業です。本提案は、この「マニュアルに沿った画面操作」をAIに代行させることで、バックオフィスの人件費を構造的に削減する仕組みを構築するものです。

具体的には、AIが担当者と同じPC上で、同じ業務アプリケーションを、同じ手順で操作します。新しいシステムの導入や既存システムの改修は不要です。現在の業務環境をそのまま活用します。

### どのように動くのか

動作の概要は、「極めて忠実で、一度教えたことを絶対に忘れないスタッフの育成」に近いものです。

まず、既存の業務マニュアルをAIに読み込ませます。AIはマニュアルの内容を解析し、画面上でどのような操作を行えばよいか、各ステップで何が正しい状態かを構造化します。

次に、AIが実際の業務を実行します。ただし、初期段階では重要なステップごとに必ず人間の担当者が確認・承認を行います。AIが勝手に処理を完了させることはありません。承認なしには一歩も進みません。

ここからが重要です。AIが誤った操作をした場合、担当者はその場で修正コメントを残します。「ここは四捨五入ではなく切り捨て」「この画面ではスクロールして全ページ確認が必要」といった、ベテラン担当者の頭の中にある暗黙知です。このコメントはナレッジとして蓄積され、AIの判断精度を継続的に向上させます。

ただし、AIには明確な限界があります。AIは画面に表示されている情報をもとに判断するため、画面外の文脈（電話での補足情報、口頭での申し送りなど）を考慮することはできません。また、現時点の技術では処理速度が人間より遅い場合があり、1件あたりの処理時間ではなく、夜間・休日稼働を含めた総処理量で効果を発揮する領域が中心となります。こうした特性を踏まえ、POCでは自動化に適した業務の見極めも検証項目に含めます。

一方、人間のスタッフと比較した構造的な優位性もあります。一度蓄積されたナレッジは全エージェントに即座に共有されるため、教育コストが人数に比例しません。また、退職や異動によるノウハウの喪失が発生しません。

### 安全性について

銀行業務における正確性とデータ管理の重要性を十分に認識した上で、本システムは以下の安全設計を採用しています。

**業務データは自社管理下から出ません。** 本構想では、AI基盤（Claude）を自社クラウドテナント上にホストすることを前提としています。AIが画面内容を解析する際のデータ通信は、すべて自社管理下のインフラ内で完結します。加えて、AIは担当者のPC上で、既にアクセス権限のあるアプリケーションをそのまま操作するため、新たなシステム連携やデータ連携の構築は不要です。なお、自社テナント上でのDesktop Use提供はAI基盤提供元のロードマップに依存するため、POC開始時期はその提供状況を踏まえて判断します。

**すべての変更は人間が承認します。** AIの動作精度を向上させるための仕組み（手順の修正、チェックルールの追加など）は、どんなに軽微なものであっても、必ず人間のレビューと承認を経て反映されます。AIが自律的にルールを変更することはありません。

**すべての操作は記録されます。** AIが行ったすべての操作は、画面キャプチャを含めて完全に記録されます。何をいつ実行し、誰が承認したかを事後に追跡可能です。監査対応の観点からも、完全な操作証跡を保持します。

**信頼は実績で獲得します。** 各業務プロセスには信頼レベルが設定されており、初期は全ステップで人間の承認が必要です。連続して正確な処理が確認された場合にのみ、段階的に承認ポイントを減らしていきます。高リスク業務（高額送金など）については、どれだけ実績を積んでも完全自律化はしない設計です。

**規制対応を前提とします。** 金融庁のAI利用に関するガイドラインおよび関連する業務規制への準拠は必須要件です。POCの初期フェーズにおいて、対象業務ごとの規制要件の調査と対応方針の整理を実施します。

### コストについて

本提案は人件費削減を主要な効果として見込んでいますが、実現にあたっては新たなコストも発生します。AI基盤の利用料（Desktop Useでは操作ステップごとに画面解析が発生するため、処理量に応じたAPI費用がかかります）、自社クラウドテナントの運用費、およびPOC期間中は通常業務に加えてAIの監督・承認作業が発生するため、一時的に業務負荷が増加します。

POCの重要な目的の一つは、こうした投入コストと省力化効果のバランスを定量的に検証し、本格展開時のROIを見積もることにあります。

### POCの進め方

初期POCでは、送金処理・口座開設など5つの業務プロセスを対象とし、省力化の効果と処理精度を検証します。

POCは3つのフェーズで進行します。第1フェーズでは、対象業務のマニュアルをAIに読み込ませ、自動化の手順定義を作成します。この手順定義は一括または個別にレビューいただきます。並行して、対象業務の規制要件を調査します。第2フェーズでは、全ステップ人間承認付きでAIが業務を実行し、修正コメントの蓄積を通じて精度を向上させます。第3フェーズでは、十分な精度が確認された業務プロセスについて、承認ポイントを削減し、実際の省力化効果を測定します。

POC期間を通じて、業務プロセスごとの自動化率、処理精度、人間の介入頻度、処理時間、およびAI運用コストを定量的に計測し、本格展開時のROIを試算します。

なお、5業務から先のスケーリングについては、業務数の増加に伴い、蓄積されたナレッジ間の整合性管理や、人間によるレビュー負荷の増加といった新たな課題が生じます。本アーキテクチャではこれらに対する技術的な対処（差分更新、自動整合性チェック等）を設計に織り込んでいますが、スケーリングの各段階で効果と課題を評価しながら段階的に拡大していく方針です。

### 従来のRPAとの違い

銀行業務ではRPA（ロボティック・プロセス・オートメーション）の導入実績がある場合も多いため、本提案との違いを整理します。

RPAは画面上の特定のボタンやフィールドの位置を厳密に指定して操作するため、動作は完全に決定的（同じ入力に対して必ず同じ出力）であり、予測可能性が高い点が強みです。一方で、UIの軽微な変更（ボタンの位置移動、画面レイアウトの更新など）で動作しなくなり、その都度プログラムの修正が必要です。

本提案のAIは、マニュアルの「意図」を理解した上で操作を行うため、UIの変更に対する耐性が高い反面、判断に確率的な要素を含みます。すなわち、まれに誤った操作を行う可能性があります。この弱点に対しては、全ステップの人間承認、操作ログの完全記録、段階的な自律化という多層的な安全設計で対処しています。

両者は競合するものではなく、補完関係にあります。高頻度・高速処理が求められ、UIが安定している業務にはRPAが適しており、UI変更が頻繁な業務や、マニュアルの解釈を伴う業務にはAIが適しています。POCを通じて、各業務の特性に応じた最適な手段の使い分けを検討します。

### なぜ今検討を始めるべきか

AIによる画面操作技術（Desktop Use）は、2025年から2026年にかけて急速に実用性が向上しています。自社テナントでの利用が可能になった時点で速やかにPOCを開始するためには、事前にアーキテクチャの設計、対象業務の選定、規制要件の整理を済ませておくことが重要です。

加えて、本提案の仕組みは運用を通じて精度が向上する構造になっています。担当者が残す修正コメントがナレッジとして蓄積され、同種の業務全体の品質を底上げします。早期に着手することでこのナレッジの蓄積期間を確保でき、本格展開時の精度と省力化効果を高めることができます。

---

*以下、技術的な設計詳細*

---

## 1. 設計原則

本システムは以下の原則に基づいて設計される。

**正確性最優先**: バックオフィスオペレーションの正確性は最優先事項である。自動反映により正確性が損なわれることは厳に回避する。すべてのprocedure変更（hints含む）およびガードレールの追加・変更は人間のレビューを経て反映される。

**段階的自律性**: 初期段階では少数のエージェントで定型業務をテストし、実績に基づいて自律性を段階的に拡大する。複雑な判断を伴う業務は人間が担当する。

**継続的強化**: Human-in-the-loopによるフィードバックをナレッジベースに蓄積し、ハーネスを継続的に強化する。強化の反映は人間のレビューを通じて行う。

**LLMナレッジベースパターンの選択的採用**: Karpathyの提唱するLLM Knowledge Baseパターン（raw → compiled wiki、linting、incremental enhancement）を採用するが、本システムの目的は知識の探索ではなく手続きの自動実行であるため、実行レイヤーと承認レイヤーを追加する。

---

## 2. データティアモデル

リポジトリ内のデータは2つのティアに明確に分離される。

### Tier 1: Knowledge（リアルタイム反映）

ユーザの修正コメントから生成されるナレッジ記事。エージェントが実行時に参照する文脈情報として機能するが、実行手順そのものは変更しない。

- 反映タイミング: リアルタイム（staging → validation → compiled）
- 人間レビュー: 不要（ただしvalidationで既存knowledgeとの矛盾が検出された場合はフラグ）
- 用途: エージェントが「このステップでは過去にこういう落とし穴があった」という文脈情報として参照

### Tier 2: Procedure + Guardrail（人間レビュー必須）

実行手順定義（schema.yaml、hints含む）およびknowledgeから生成されるバリデーションルール（ガードレール）。どんなに軽微な変更でも人間の承認を経る。

- 反映タイミング: 提案 → 人間レビュー → 承認後に反映
- 人間レビュー: 必須（例外なし）
- 管理: `proposals/`ディレクトリでPRモデルにより管理

---

## 3. リポジトリ構成

```
backoffice-automation/
│
├── manuals/                              # 原本（ユーザ提供）
│   ├── raw/                              # アップロードされたままのマニュアル
│   └── parsed/                           # LLMが構造化・分割したもの
│
├── procedures/                           # [Tier 2] 実行可能手順定義
│   ├── _index.md                         # 自動生成される目次・要約・依存グラフ
│   └── {domain}/                         # 例: accounting/, hr/, procurement/
│       ├── {procedure}.md                # 人間可読な手順書
│       └── {procedure}.schema.yaml       # 機械可読な手順定義
│
├── guardrails/                           # [Tier 2] knowledgeから生成されたバリデーションルール
│   ├── _index.md                         # ガードレール一覧・対応procedure
│   └── {domain}/
│       └── {rule}.yaml                   # バリデーションルール定義
│
├── knowledge/                            # [Tier 1] リアルタイム反映ナレッジ
│   ├── corrections/                      # ユーザ修正コメント（raw）
│   │   └── {timestamp}_{procedure}_{run_id}.md
│   ├── staging/                          # 未検証ナレッジ（即時参照可能、低重み）
│   ├── compiled/                         # 検証済みナレッジ
│   │   ├── _index.md                     # 自動生成目次・要約・依存グラフ
│   │   └── {topic}.md                    # ナレッジ記事（affects, confidence付き）
│   ├── edge_cases/                       # 発見されたエッジケース集
│   └── error_taxonomy.md                 # エラー分類体系
│
├── proposals/                            # Procedure/Guardrail変更提案キュー
│   ├── pending/
│   │   └── {proposal_id}.yaml
│   ├── approved/
│   │   └── {proposal_id}.yaml
│   └── rejected/
│       └── {proposal_id}.yaml
│
├── agents/                               # エージェント定義
│   ├── configs/
│   │   └── {agent_name}.yaml             # 担当手順、信頼レベル、ツール権限
│   ├── prompts/                          # システムプロンプトテンプレート
│   └── tools/                            # カスタムツール定義
│
├── runs/                                 # 実行記録（全件保存、スクリーンショット含む、保持期間制限なし）
│   └── {YYYY-MM}/
│       └── {run_id}/
│           ├── plan.md                   # 実行前の計画
│           ├── execution_log.md          # ステップごとの実行ログ
│           ├── screenshots/              # computer useのスクリーンショット
│           ├── approval.yaml             # 承認記録（who, when, decision）
│           └── feedback.md               # ユーザの修正コメント
│
├── evaluation/                           # 品質追跡
│   ├── metrics/
│   │   └── {procedure}_metrics.yaml      # 手順別の精度・介入率・処理時間
│   ├── reports/                          # 定期レポート
│   └── regression/                       # 回帰テストケース
│       └── {procedure}/
│           └── {case}.yaml               # 承認済みrunから自動生成
│
├── lint/                                 # ナレッジベース健全性チェック
│   ├── rules/                            # lintルール定義
│   └── reports/                          # lint結果
│
└── docs/
    └── architecture.md                   # 本ドキュメント
```

---

## 4. Procedure Schema設計

定型業務向けに、**目的 + 期待状態 + 操作ヒント**の3層構造を採用する。

### 設計方針

- `goal`と`expected_state`は不変 — UIが変わっても達成すべきことは変わらない
- `hints`はUIナビゲーションの補助情報 — 古くなっても動作可能
- `checkpoint`がhuman-in-the-loopの制御点を明示
- `on_mismatch`でエッジケースの処理ルートを定義

### スキーマ例

```yaml
# procedures/accounting/invoice_approval.schema.yaml
procedure:
  id: invoice_approval
  domain: accounting
  version: "1.0.0"
  trust_level: supervised        # supervised → checkpoint → autonomous
  risk_level: medium             # low / medium / high（金額閾値で動的変更可能）
  estimated_duration_sec: 120

  preconditions:
    - app: "経費精算システム"
      state: "ログイン済み"
    - required_data: ["invoice_id"]

  steps:
    - id: navigate_to_invoice
      goal: "対象の請求書詳細画面を開く"
      expected_state:
        description: "請求書番号{invoice_id}の詳細が表示されている"
        visual_cues: ["請求書番号", "承認ステータス: 未承認"]
      hints:
        - "メニュー「請求書一覧」から検索"
        - "請求書番号で検索フィルタを使用"
      checkpoint: false

    - id: verify_amount
      goal: "請求金額と添付証憑の金額が一致することを確認"
      expected_state:
        description: "金額の一致が確認できた"
        validation: "invoice_amount == receipt_amount"
      hints:
        - "添付ファイルタブで証憑を確認"
      checkpoint: true             # human-in-the-loopポイント
      on_mismatch:
        action: escalate
        message: "金額不一致: 請求書{invoice_amount} vs 証憑{receipt_amount}"

    - id: approve
      goal: "承認ボタンを押下し、承認完了を確認"
      expected_state:
        description: "承認ステータスが「承認済み」に変更された"
        visual_cues: ["承認ステータス: 承認済み", "承認者:"]
      hints:
        - "画面下部の「承認」ボタン"
      checkpoint: true

  rollback:
    description: "承認取消が可能な場合は取消を実行"
    steps: ["承認済み画面から「承認取消」を選択"]

  guardrails:
    - guardrails/accounting/invoice_amount_rounding.yaml
    - guardrails/accounting/duplicate_invoice_check.yaml
```

### trust_level定義

| レベル | 説明 | checkpointの扱い |
|--------|------|------------------|
| `supervised` | 全ステップで人間承認 | すべてのcheckpoint有効 + 各ステップ後に停止 |
| `checkpoint` | checkpoint付きステップのみ人間承認 | checkpoint=trueのステップのみ停止 |
| `autonomous` | 事後レビューのみ | 停止なし、実行後にログレビュー |

昇格条件: 連続N回成功（Nはrisk_levelに依存）。risk_level=highの場合、autonomousへの昇格は不可。

---

## 5. ナレッジコンパイルパイプライン

### リアルタイムコンパイルフロー

```
ユーザ修正コメント
    │
    ▼
corrections/ に保存（raw）
    │
    ▼
LLMがエラー分類（error_taxonomy.md参照）
    │
    ├─ 手順の誤解 → affects: procedure解釈
    ├─ UI変更 → affects: hints
    ├─ エッジケース → affects: edge_cases
    └─ 判断基準の不一致 → affects: validation rules
    │
    ▼
staging/ にナレッジ記事ドラフト生成
    │ （エージェントは即時参照可能、ただし低重み）
    │
    ▼
自動validation
    │
    ├─ 既存knowledgeとの整合性チェック
    ├─ 矛盾検出 → フラグ付きでstaging保留
    └─ 整合性OK → compiled/ に昇格
    │
    ▼
影響分析
    │
    ├─ Tier 1影響のみ → 自動反映完了
    └─ Tier 2影響あり → proposals/ に変更提案を自動生成
                            │
                            ▼
                        人間レビューキューへ
```

### 差分コンパイル

`_index.md`に依存グラフを保持し、変更の影響範囲を特定する。影響を受けるナレッジ記事のみを再コンパイルする。影響範囲が不明な修正はstagingに留め、次回の定期フルコンパイル（lint実行時）で処理する。

### ナレッジ記事フォーマット

```markdown
<!-- knowledge/compiled/invoice_amount_rounding.md -->
---
id: invoice_amount_rounding
created: 2026-04-04
last_compiled: 2026-04-04
source_corrections:
  - corrections/20260404_invoice_approval_run123.md
  - corrections/20260410_invoice_creation_run456.md
affects:
  - procedures/accounting/invoice_approval#verify_amount
  - procedures/accounting/invoice_creation#set_amount
confidence: verified       # staging / verified / contested
---

## 請求金額の端数処理

税込金額の端数は切り捨てで処理する。
四捨五入ではないことに注意。

### 根拠
- run123: ユーザ指摘「端数は切り捨てが社内ルール」
- run456: 同様の指摘、invoice_creationでも確認
```

---

## 6. 変更管理ワークフロー（Proposals）

### 提案フォーマット

```yaml
# proposals/pending/proposal_20260404_001.yaml
proposal:
  id: proposal_20260404_001
  created: 2026-04-04T10:30:00+09:00
  review_mode: individual        # individual | batch

  target: procedures/accounting/invoice_approval.schema.yaml
  change_type: hint_update       # hint_update | step_add | validation_change |
                                 # guardrail_add | guardrail_modify

  diff:
    path: "steps[1].hints"
    before:
      - "添付ファイルタブで証憑を確認"
    after:
      - "添付ファイルタブで証憑を確認"
      - "PDFの場合はスクロールして全ページ確認が必要"

  rationale:
    description: "証憑が複数ページのPDFの場合、1ページ目のみ確認して金額を見落とすケースが発生"
    source_corrections:
      - corrections/20260403_invoice_approval_run789.md
    supporting_knowledge:
      - knowledge/compiled/multi_page_receipt_handling.md

  impact_analysis:
    affected_runs_last_30d: 12
    related_procedures:
      - procedures/accounting/invoice_creation
    risk_assessment: "低リスク。hintsの追加であり、既存動作への影響なし"

  status: pending                # pending → approved | rejected
  reviewer: null
  reviewed_at: null
  review_comment: null
```

### ブートストラップ時のbatchレビュー

初回のマニュアル→procedure変換では、`review_mode: batch`の提案を生成する。

```yaml
# proposals/pending/bootstrap_batch_001.yaml
proposal:
  id: bootstrap_batch_001
  created: 2026-04-04T09:00:00+09:00
  review_mode: batch

  items:
    - target: procedures/accounting/invoice_approval.schema.yaml
      status: pending            # 個別にapprove/reject/defer可能
    - target: procedures/accounting/invoice_creation.schema.yaml
      status: pending
    - target: procedures/hr/leave_request.schema.yaml
      status: pending
    # ... 全procedureが列挙される

  bulk_actions_available: true   # 全件一括承認可能

  audit_trail:                   # batchでも監査証跡は残る
    reviewer: null
    reviewed_at: null
    individual_decisions: {}     # 個別判断の記録
```

batchレビューでは、LLMが各procedureの要約と信頼度スコアを提示し、人間が個別にapprove/reject/deferを選択するか、全件一括承認できる。ファストトラックであっても「人間がレビューなしに反映されることはない」という原則は維持される。

---

## 7. ガードレールシステム

knowledgeから抽出されたバリデーションルール。Tier 2として管理され、追加・変更は人間レビュー必須。

### ガードレール定義

```yaml
# guardrails/accounting/invoice_amount_rounding.yaml
guardrail:
  id: invoice_amount_rounding
  created: 2026-04-04

  applies_to:
    - procedures/accounting/invoice_approval#verify_amount
    - procedures/accounting/invoice_creation#set_amount

  rule:
    type: validation
    description: "税込金額の端数は切り捨てであること"
    check: "floor(tax_included_amount) == displayed_amount"
    severity: error              # error（ブロック） | warning（警告のみ）

  source_knowledge:
    - knowledge/compiled/invoice_amount_rounding.md

  proposal_id: proposal_20260405_003    # 承認された提案への参照
```

### エージェント実行時のknowledge + guardrail合成

```
procedure.schema.yaml（固定の手順定義）
    +
guardrails/*.yaml（Tier 2: 構造化されたバリデーションルール）
    +
knowledge/compiled/*.md（Tier 1: 文脈情報として注入）
    ↓
エージェント実行コンテキスト
```

エージェントは以下の優先順位で情報を使用する:
1. procedure.schema.yaml — 実行手順（最優先、逸脱不可）
2. guardrails — 各ステップのバリデーション（違反時はブロックまたは警告）
3. knowledge/compiled — 文脈情報（参考情報として使用、直接の行動変更はしない）
4. knowledge/staging — 未検証情報（最低重み、注意喚起のみ）

---

## 8. エージェント構成

### エージェント設定

```yaml
# agents/configs/accounting_agent.yaml
agent:
  id: accounting_agent
  description: "経理業務自動化エージェント"

  assigned_procedures:
    - procedures/accounting/invoice_approval
    - procedures/accounting/invoice_creation

  tools:
    - computer_use                # Claude computer use
    - screenshot_capture          # スクリーンショット取得
    - knowledge_search            # ナレッジベース検索

  constraints:
    max_concurrent_runs: 1        # 同時実行数
    timeout_per_step_sec: 60      # ステップごとのタイムアウト
    max_retries_per_step: 2       # ステップごとのリトライ上限
    escalation_on_timeout: true   # タイムアウト時は人間にエスカレーション
```

---

## 9. エラー分類体系

ユーザの修正コメントを以下のカテゴリに分類し、修正の反映先レイヤーを決定する。

| カテゴリ | 説明 | 反映先 |
|----------|------|--------|
| `misunderstanding` | マニュアルの解釈ミス | procedure（Tier 2） |
| `ui_change` | アプリ側のUI変更に追従できていない | procedure.hints（Tier 2） |
| `edge_case` | マニュアルに記載のない例外 | knowledge + guardrail提案（Tier 1→2） |
| `judgment_gap` | 人間の暗黙知との乖離 | knowledge + procedure提案（Tier 1→2） |
| `data_error` | 入力データの問題（エージェント起因でない） | runs/のログに記録のみ |

---

## 10. 品質管理・Observability

### 追跡メトリクス

procedure別に以下を記録する:

- **自動化率**: 人間介入なしで完了したrun数 / 全run数
- **精度**: 修正コメントなしで承認されたrun数 / 全run数
- **平均処理時間**: エージェントの実行時間
- **エラー分類分布**: カテゴリ別のエラー発生頻度
- **trust_level推移**: 信頼レベルの昇格/降格履歴

### 回帰テスト

承認済みのrunから自動的にテストケースを生成する。

```yaml
# evaluation/regression/invoice_approval/case_001.yaml
regression_case:
  id: case_001
  source_run: runs/2026-04/run_abc123
  procedure: procedures/accounting/invoice_approval

  input:
    invoice_id: "INV-2026-0042"
    # ... その他の入力パラメータ

  expected_outcomes:
    - step: verify_amount
      result: "金額一致確認済み"
    - step: approve
      result: "承認ステータス: 承認済み"

  generated_at: 2026-04-04
```

ナレッジベース更新、プロンプト変更、procedure変更時に回帰テストを実行し、意図しない劣化を検出する。

### マニュアル乖離検知

定期的にアプリケーションのUI状態をスクリーンショットで検証し、マニュアルおよびprocedure記載のUIとの乖離を検出する。乖離検出時は該当procedureのtrust_levelを自動的に`supervised`に降格し、人間レビューをトリガーする。

### Lintルール

Karpathyパターンに基づき、ナレッジベースの健全性を定期チェックする:

- 矛盾するナレッジ記事の検出
- 欠損データの補完提案
- 未リンクの関連記事の接続提案
- 古いknowledge（長期間参照されていない記事）のフラグ
- procedureとknowledgeの整合性検証

---

## 11. ブートストラッププロセス

### Phase 1: マニュアル取り込み

```
manuals/raw/ にユーザマニュアルを配置
    ↓
LLMがマニュアルを解析・構造化 → manuals/parsed/
    ↓
ドメイン分類・手順分割
```

### Phase 2: Procedure生成

```
manuals/parsed/ から procedure.schema.yaml を自動生成
    ↓
proposals/pending/ にbatch提案として登録
    ↓
人間がbatchレビュー（個別approve/reject/defer または一括承認）
    ↓
承認されたprocedureを procedures/ に配置
```

### Phase 3: テスト実行

```
少数のprocedureを選定
    ↓
supervised モードで実行
    ↓
全ステップで人間承認
    ↓
修正コメント蓄積 → knowledge構築開始
    ↓
実績に基づきtrust_level昇格を検討
```

---

## 12. スケーリング戦略

### 初期（少数エージェント）

- 1-2ドメインの定型業務に限定
- 全procedureを`supervised`モードで開始
- ナレッジベース構築に注力
- 回帰テストケースの蓄積

### 中期（ドメイン拡大）

- 実績のあるprocedureを`checkpoint`モードに昇格
- 新ドメインの追加（同じブートストラッププロセスを適用）
- ナレッジベースのクロスドメイン活用開始
- カスタムツールの追加（knowledge検索エンジン等）

### 長期（大幅省力化）

- 高実績procedureを`autonomous`モードに昇格（risk_level=highを除く）
- procedureの自動提案精度向上
- Observabilityダッシュボードによる全体最適化
- （検討事項）合成データ生成 + ファインチューニングによるドメイン特化
