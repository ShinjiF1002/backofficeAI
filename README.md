# backoffice-automation-framework

AIによるバックオフィスオペレーション自動化フレームワーク。

Claude Desktop Use を活用し、バックオフィス担当者のPC上で定型業務を自動化する仕組みを提供します。

## ドキュメント

- [アーキテクチャ設計書](docs/architecture.md)

## ディレクトリ構成

```
backoffice-automation-framework/
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
└── docs/                 # ドキュメント
```
