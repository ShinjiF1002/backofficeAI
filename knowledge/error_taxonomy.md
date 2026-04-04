# エラー分類体系

ユーザの修正コメントを以下のカテゴリに分類し、修正の反映先レイヤーを決定する。

| カテゴリ | 説明 | 反映先 |
|----------|------|--------|
| `misunderstanding` | マニュアルの解釈ミス | procedure（Tier 2） |
| `ui_change` | アプリ側のUI変更に追従できていない | procedure.hints（Tier 2） |
| `edge_case` | マニュアルに記載のない例外 | knowledge + guardrail提案（Tier 1→2） |
| `judgment_gap` | 人間の暗黙知との乖離 | knowledge + procedure提案（Tier 1→2） |
| `data_error` | 入力データの問題（エージェント起因でない） | runs/のログに記録のみ |
