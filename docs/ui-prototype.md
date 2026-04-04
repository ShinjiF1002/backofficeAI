# バックオフィス自動化 管理画面プロトタイプ

> 本資料は、アーキテクチャ設計書で定義した仕組みを現場の担当者と管理者がどのように操作するかを、画面イメージで示したものです。プロトタイプ（画面構成の検討素材）であり、最終デザインではありません。
>
> 表示崩れを避けるため、ASCII アート内は **ASCII 文字だけ**で構成しています。日本語の意味、代表データ、操作ルールは各ブロックの直下に置いた表と説明文を正本とします。

---

## この管理画面が実現すること

本システムの管理画面は、以下のサイクルを回すためのインターフェースです。

```
+-------------------+     +-------------------+
| AI runs task      | --> | Staff reviews     |
|                   |     | and approves      |
+-------------------+     +-------------------+
          |                         |
          | issue found             | no issue
          v                         v
+-------------------+     +-------------------+
| Staff writes      | --> | Task completed    |
| correction note   |     |                   |
+-------------------+     +-------------------+
          |
          v
+-------------------+
| AI learns and     |
| improves          |
+-------------------+
```

| 図中ラベル | 意味 | 補足 |
| --- | --- | --- |
| `AI runs task` | AI が業務を実行する | 初回は人間承認つきで進む |
| `Staff reviews and approves` | 担当者が結果を確認し承認する | 問題なければ処理完了へ進む |
| `Staff writes correction note` | 担当者が修正コメントを残す | 誤りがあった場合の分岐 |
| `AI learns and improves` | AI が修正内容を知見として学習する | 同じミスを繰り返しにくくなる |

この資料では、**導入初日から 3 ヶ月後まで**、管理画面で何が起きるかを時系列で説明します。

---

## 導入初日: 手順定義の確認

AI に業務マニュアルを読み込ませると、AI が手順定義を自動生成します。管理者はこの内容を確認し、承認します。これが本システムとの最初の接点です。

### マニュアルから生成された手順の確認画面

```
+----------------------------------------------------------+
| Header: setup review                                     |
+----------------------------------------------------------+
| Notice: AI generated workflow drafts                     |
+----------------------------------------------------------+
| List: workflow / conf / decision                         |
| - Tx domestic          high      [ ]                     |
| - Tx overseas          med       [ ]                     |
| - Open acct / person   high      [ ]                     |
| - Open acct / corp     med       [ ]                     |
| - Invoice approval     high      [ ]                     |
+----------------------------------------------------------+
| Actions: [Approve selected] [Approve all]                |
| Note: start mode = full-step approval                    |
+----------------------------------------------------------+
```

| 領域 | 意味 | 代表データ | 主操作 |
| --- | --- | --- | --- |
| `Header` | 初回設定の確認画面であることを示す見出し | setup review | なし |
| `Notice` | AI が手順定義を生成したことを伝える案内 | workflow drafts | 内容確認へ進む |
| `List` | 業務一覧、信頼度、判断欄 | 国内送金 / 海外送金 / 口座開設 / 請求書承認 | 各行を開いて詳細確認 |
| `Actions` | 承認ボタン群 | Approve selected / Approve all | 一部承認または一括承認 |
| `Note` | 初期運用モードの説明 | full-step approval | ルール確認 |

ここでのポイントは、AI の生成結果をそのまま採用せず、人間が運用開始のスイッチを持つことです。承認後も、すべての業務は「全ステップ承認」モードで始まります。

### 手順定義の詳細画面

```
+----------------------------------------------------------+
| Header: workflow detail                                  |
+----------------------------------------------------------+
| Left : source manual                                     |
| Right: generated steps                                   |
+----------------------------+-----------------------------+
| Src chapter 3.2            | Step 1: req check          |
| Req, acct, amount rules    | Step 2: account match      |
|                            | Step 3: amount check [H]   |
+----------------------------+-----------------------------+
| Reason for high confidence                                |
| - clear steps / low branching / simple UI flow           |
+----------------------------------------------------------+
| Actions: [Approve] [Needs fix] [Back]                    |
+----------------------------------------------------------+
```

| 領域 | 意味 | 代表データ | 主操作 |
| --- | --- | --- | --- |
| `Left` | 元のマニュアルの該当箇所 | chapter 3.2 | 原文確認 |
| `Right` | AI が生成した手順定義 | req check / account match / amount check | 手順妥当性の確認 |
| `[H]` | 人間承認が必要なチェックポイント | amount check | 承認要否の判断 |
| `Reason for high confidence` | 信頼度の根拠 | clear steps / low branching | 理由の確認 |
| `Actions` | 管理者の判断操作 | Approve / Needs fix / Back | 採否決定 |

元のマニュアルと AI の解釈を並べて比較することで、「AI が何を読み取ったか」を直接確認できます。信頼度の根拠も同じ画面で示すため、管理者は「なぜ high / med なのか」を把握した上で判断できます。

---

## 1週目: 全ステップ承認で運用開始

手順定義が承認されると、AI が実際の業務を実行し始めます。初期は **すべてのステップで人間の承認が必要** です。担当者は毎日、ホーム画面から承認作業を行います。

### ホーム画面

担当者が朝一番に開く画面です。「今、自分の対応が必要なもの」が最上部に表示されます。

```
+----------------------------------------------------------+
| Header: home / Taro Tanaka / Finance                     |
+----------------------------------------------------------+
| KPI: pending=3 | done=12 | running=5 | acc=87.5         |
+----------------------------------------------------------+
| Pending queue                                            |
| 09:12  TX-0158   amount check              [Open]        |
| 09:08  ACC-0042  ID docs                   [Open]        |
| 08:55  INV-0091  final approval            [Open]        |
+----------------------------------------------------------+
| Running                                                  |
| TX-0159   step 2/5   account match                       |
| ACC-0043  step 1/4   form read                           |
| TX-0160   queued                                         |
+----------------------------------------------------------+
```

| 領域 | 意味 | 代表データ | 主操作 |
| --- | --- | --- | --- |
| `Header` | サービス名、担当者名、所属チーム | Taro Tanaka / Finance | なし |
| `KPI` | その日の処理状況を要約 | pending / done / running / acc | なし |
| `Pending queue` | 今すぐ対応が必要な案件一覧 | TX-0158, ACC-0042, INV-0091 | `Open` で承認画面へ遷移 |
| `Running` | AI が処理中または待機中の案件一覧 | step 2/5, queued | 状況把握 |

この画面では、「あなたの対応が必要な案件」が最優先で上に来ます。担当者は `Open` を押して個別の承認画面へ進みます。

### 承認画面: 通常の場合

自動チェックがすべて通過し、過去の精度も高い案件は、簡略表示で素早く承認できます。

```
+----------------------------------------------------------+
| Header: TX-0158                                          |
+----------------------------------------------------------+
| Progress: [x] req [x] acct [>] amount [ ] exec [ ] done |
+----------------------------------------------------------+
| Checks passed                                             |
| - amount match                                            |
| - dup check                                               |
| - limit check                                             |
| Link: [Show detail]                                       |
+----------------------------------------------------------+
| Actions: [Approve next] [Send back]                       |
+----------------------------------------------------------+
```

| 領域 | 意味 | 代表データ | 主操作 |
| --- | --- | --- | --- |
| `Progress` | 現在の進行位置を示すステップ表示 | amount が現在位置 | 進行確認 |
| `Checks passed` | 自動チェックの通過結果 | amount match / dup check / limit check | 結果確認 |
| `Link` | 詳細表示への入口 | Show detail | 詳細画面へ展開 |
| `Actions` | 担当者の最終判断 | Approve next / Send back | 承認または差し戻し |

自動チェックがすべて通過している場合、担当者は結果を確認して `Approve next` を押すだけです。詳しく確認したい場合は `Show detail` で詳細表示へ切り替えられます。

### 承認画面: 詳細表示（`Show detail` を押した場合、またはチェック未通過の場合）

自動チェックで問題が検出された場合や、担当者が詳細を確認したい場合は、AI が操作している画面のスクリーンショットと判断根拠が表示されます。

```
+----------------------------------------------------------+
| Header: TX-0158 / amount check                           |
+----------------------------------------------------------+
| Left : active screen                                     |
| Right: AI judgment and reused notes                      |
+----------------------------+-----------------------------+
| amount = 1,250,000         | judgment: amount matches    |
| doc    = 1,250,000         | note: round down rule       |
+----------------------------+-----------------------------+
| Checks: amount ok / dup ok / limit ok                    |
| Past: 28 approved / 2 sent back                          |
+----------------------------------------------------------+
| Actions: [Approve next] [Send back]                      |
+----------------------------------------------------------+
```

| 領域 | 意味 | 代表データ | 主操作 |
| --- | --- | --- | --- |
| `Left` | AI が参照している画面や証憑 | active screen | 内容確認 |
| `Right` | AI の判断文と参照した知見 | amount matches / round down rule | 判断根拠の確認 |
| `Checks` | 個別の自動チェック結果 | amount ok / dup ok / limit ok | 結果確認 |
| `Past` | このステップの直近実績 | 28 approved / 2 sent back | 精度感の把握 |
| `Actions` | 承認または差し戻し | Approve next / Send back | 最終判断 |

`Right` に表示される知見は、担当者自身や同僚が過去に残した修正コメントから生成されたものです。AI が過去の指摘を活かしていることを、この画面で確認できます。

---

## AI が間違えた場合: 修正コメント

承認画面で `Send back` を押すと、修正コメントの入力画面が表示されます。

### 修正コメント入力画面

```
+----------------------------------------------------------+
| Header: send-back comment                                |
+----------------------------------------------------------+
| AI said: "amount matches"                                |
+----------------------------------------------------------+
| Input: free-text comment                                 |
| Examples:                                                |
| - pdf has 2 pages; page 2 was skipped                    |
| - use round down, not round up                           |
| - half-width kana is acceptable                          |
+----------------------------------------------------------+
| Similar note: "check all PDF pages"   [Quote]            |
+----------------------------------------------------------+
| Actions: [Submit and continue] [Cancel]                  |
| After: learn now / maybe create change proposal          |
+----------------------------------------------------------+
```

| 領域 | 意味 | 代表データ | 主操作 |
| --- | --- | --- | --- |
| `AI said` | 直前の AI 判断を再掲 | amount matches | 修正対象の確認 |
| `Input` | 自由入力欄 | free-text comment | コメント入力 |
| `Examples` | コメントの書き方例 | pdf page skip / round down / kana rule | 参考にする |
| `Similar note` | 過去の類似コメント候補 | check all PDF pages | `Quote` で流用 |
| `Actions` | コメント送信か中止か | Submit and continue / Cancel | 差し戻し確定 |

担当者は普段の言葉で「何が間違っていたか」を書くだけです。カテゴリの選択や技術的な入力は不要で、分類は AI が自動で行います。似たコメントがあれば `Quote` で流用できます。

---

## 問題が起きた場合の画面表示

すべてが順調な場合だけでなく、問題が発生した場合にどう見えるかを示します。

### 自動チェックが失敗した場合

```
+----------------------------------------------------------+
| Header: TX-0162 / amount check                           |
+----------------------------------------------------------+
| Alert: guardrail found an issue                          |
| - dup check    ok                                        |
| - limit check  ok                                        |
| - amount      ng                                         |
| delta: 100,000                                           |
+----------------------------------------------------------+
| Left : active screen                                     |
| Right: AI stopped and waits for review                   |
+----------------------------+-----------------------------+
| ui amount  = 1,250,000     | "amount mismatch found"     |
| doc amount = 1,350,000     | "waiting for human check"   |
+----------------------------+-----------------------------+
| Actions: [Manual continue] [Send back] [Hold]            |
+----------------------------------------------------------+
```

| 領域 | 意味 | 代表データ | 主操作 |
| --- | --- | --- | --- |
| `Alert` | ガードレールが問題を検出したことを強調 | amount ng / delta 100,000 | 問題認識 |
| `Left` | AI が見ている画面や値 | ui amount = 1,250,000 | 証跡確認 |
| `Right` | AI が停止した理由 | amount mismatch found | 判断確認 |
| `Actions` | 担当者が取る対応 | Manual continue / Send back / Hold | 次の行動を選ぶ |

自動チェックが失敗すると、詳細表示が自動で展開され、何が問題かが具体的に表示されます。AI はこの時点で自動的に処理を停止しています。

### 同じミスが繰り返された場合のホーム画面

```
+----------------------------------------------------------+
| Header: home / warning state                             |
+----------------------------------------------------------+
| KPI: pending=1 | done=8 | running=2 | acc=82.3 down     |
+----------------------------------------------------------+
| Warning: repeat issue in "Open acct / corp"              |
| 3 of last 5 cases sent back for rep ID check             |
| 04/02 Sato : rep ID is required                          |
| 04/03 Tanaka: attached rep ID was ignored                |
| 04/04 Sato : same issue again                            |
| Proposal: new step update is being drafted               |
+----------------------------------------------------------+
```

| 領域 | 意味 | 代表データ | 主操作 |
| --- | --- | --- | --- |
| `KPI` | 問題発生時の要約指標 | pending=1 / acc=82.3 down | 状況把握 |
| `Warning` | 同種のミスが繰り返されていることを警告 | Open acct / corp | 注意喚起 |
| `3 of last 5 cases` | 繰り返し発生を定量化 | rep ID check | 問題深度の把握 |
| コメント行 | 現場の声を時系列で表示 | Sato / Tanaka | 背景理解 |
| `Proposal` | 手順変更提案が進行中であることを示す | step update is being drafted | 状況共有 |

同じ種類のミスが繰り返された場合は、ホーム画面で警告が表示されます。問題が放置されていないこと、変更提案が進行中であることが見える設計です。

---

## 1ヶ月目: 修正コメントが手順改善につながる

運用開始から 1 ヶ月が経つと、担当者の修正コメントが蓄積されます。AI はこれらのコメントを分析し、「手順そのものを変えたほうがよい」と判断した場合に変更提案を生成します。

**この提案は管理者が承認するまで反映されません。** どんなに軽微な変更でも、人間の承認なしに AI が勝手にルールを変えることはありません。

### 変更提案レビュー画面

```
+----------------------------------------------------------+
| Header: change proposal review / open=2                  |
+----------------------------------------------------------+
| Proposal #1: Tx / amount check                           |
| What: add "check all pages if file is PDF"               |
| Why : 3 misses in last 30 days                           |
| Scope: Tx + Invoice / 47 recent cases / risk low         |
| Voices: Sato 03/28, Tanaka 03/31, Sato 04/02             |
+----------------------------------------------------------+
| Admin comment: free text                                 |
+----------------------------------------------------------+
| Actions: [Approve] [Reject] [Hold]                       |
+----------------------------------------------------------+
```

| 領域 | 意味 | 代表データ | 主操作 |
| --- | --- | --- | --- |
| `Proposal #1` | どの業務のどのステップを変えるか | Tx / amount check | 提案把握 |
| `What` | 変更する操作手順 | check all pages if file is PDF | 内容確認 |
| `Why` | 変更が必要な理由 | 3 misses in last 30 days | 根拠確認 |
| `Scope` | 適用対象と影響範囲 | Tx + Invoice / 47 cases / risk low | 影響判断 |
| `Voices` | 現場コメントの引用元 | Sato / Tanaka | 一次根拠の確認 |
| `Admin comment` | 管理者の補足記録 | free text | コメント入力 |
| `Actions` | 提案の採否 | Approve / Reject / Hold | 意思決定 |

変更提案は「何を」「なぜ」「影響は」の 3 点で構成されています。技術的な差分表示ではなく、管理者が自然に読める形にしてあります。現場の修正コメントがそのまま根拠になるため、承認判断の理由を説明しやすくなります。

---

## 3ヶ月目: 信頼を獲得し、承認の手間が減る

精度が十分に向上した業務は、信頼レベルを昇格できます。昇格すると、重要なステップのみ承認が必要になり、担当者の負荷が下がります。

### 承認ステップの変化

```
+----------------------------------------------------------+
| Mode A: full-step approval                               |
| S1[A] -> S2[A] -> S3[A] -> S4[A] -> S5[A]               |
| Human decisions: 5                                       |
+----------------------------------------------------------+
| Mode B: checkpoint approval                              |
| S1[AI] -> S2[AI] -> S3[A] -> S4[AI] -> S5[A]            |
| Human decisions: 2 (60% less)                           |
+----------------------------------------------------------+
| Mode C: post-check only                                  |
| S1[AI] -> S2[AI] -> S3[AI] -> S4[AI] -> S5[AI]          |
| Human review: after completion log only                  |
+----------------------------------------------------------+
```

| 記号 | 意味 | 補足 |
| --- | --- | --- |
| `A` | 人間承認が必要 | 各ステップごとに判断する |
| `AI` | AI が自動実行 | 高精度時に任せる |
| `Mode A` | 導入初期の標準モード | 全ステップ承認 |
| `Mode B` | 昇格後の運用モード | チェックポイント承認 |
| `Mode C` | 十分な実績後の理想形 | 高リスク業務は対象外 |

高額送金のような高リスク業務は、どれだけ実績を積んでも完全自動化しません。

### 学習状況の確認画面

管理者が精度の推移を確認し、信頼レベル昇格を判断するための画面です。

```
+----------------------------------------------------------+
| Header: learning status / last 3 months                  |
+----------------------------------------------------------+
| Summary                                                  |
| total=284 | acc=94.2 | knowledge=23                      |
+----------------------------------------------------------+
| Accuracy trend                                           |
| W1 82 | W2 85 | W3 88 | W4 90 | ... | W12 96            |
+----------------------------------------------------------+
| By workflow                                              |
| Tx dom      96.8  124  full-step   ready to upgrade      |
| Acct person 93.5   62  full-step   12 more cases needed  |
| Invoice     97.1   58  checkpoint  stable                |
| Acct corp   88.2   28  full-step   improving             |
| Tx overseas 91.7   12  full-step   gathering data        |
+----------------------------------------------------------+
| Comment impact                                           |
| 11 comments / 9 learned / 2 proposals / 1 approved       |
| Example: kana normalization -> no repeat miss            |
+----------------------------------------------------------+
```

| 領域 | 意味 | 代表データ | 主操作 |
| --- | --- | --- | --- |
| `Summary` | 全体サマリー | total=284 / acc=94.2 / knowledge=23 | 運用成熟度の確認 |
| `Accuracy trend` | 週ごとの精度推移 | W1 82 ... W12 96 | 上昇トレンドの確認 |
| `By workflow` | 業務別の精度、件数、状態 | Tx dom / Acct person / Invoice | 昇格候補の抽出 |
| `Comment impact` | 修正コメントの反映状況 | 11 comments / 9 learned / 2 proposals | 学習の可視化 |

精度推移は POC 開始後の実測値であり、事前に保証されたものではありません。この推移を実データで検証すること自体が、POC の目的の一つです。

### 信頼レベル昇格の確認画面

`ready to upgrade` を押すと、以下の確認画面が表示されます。

```
+----------------------------------------------------------+
| Header: upgrade confirmation                             |
+----------------------------------------------------------+
| Target: Tx domestic                                      |
| Now : full-step approval (5 approvals)                   |
| Next: checkpoint approval (2 approvals)                  |
| Keep human approval at: step 3, step 5                   |
| Auto-run at: step 1, step 2, step 4                      |
| Reason: 50 clean runs / acc 96.8 / 4 send-backs learned  |
| Safety: auto-downgrade if accuracy falls                 |
+----------------------------------------------------------+
| Actions: [Approve upgrade] [Cancel]                      |
+----------------------------------------------------------+
```

| 領域 | 意味 | 代表データ | 主操作 |
| --- | --- | --- | --- |
| `Target` | 昇格対象の業務 | Tx domestic | 対象確認 |
| `Now` | 現在の運用モード | full-step approval | 現状把握 |
| `Next` | 変更後の運用モード | checkpoint approval | 変更内容確認 |
| `Keep human approval` | 人間承認を残すステップ | step 3 / step 5 | リスク制御の確認 |
| `Auto-run` | AI が自動実行するステップ | step 1 / step 2 / step 4 | 負荷削減の確認 |
| `Reason` | 昇格の客観的根拠 | 50 clean runs / acc 96.8 | 判断理由の確認 |
| `Safety` | 精度低下時の戻し条件 | auto-downgrade | 安全装置の確認 |
| `Actions` | 承認かキャンセルか | Approve upgrade / Cancel | 最終判断 |

昇格は客観的な根拠にもとづいて判断できます。また、精度が低下した場合は自動的に全ステップ承認に戻るため、昇格判断に過度なリスクを伴いません。

---

## 監査対応

すべての画面での操作は自動的に記録されます。

```
+-----------------------+----------------------------------+
| AI log                | Human log                        |
+-----------------------+----------------------------------+
| before/after shots    | who approved / when              |
| AI reasoning          | full send-back comments          |
| reused knowledge      | proposal decisions               |
| guardrail results     | trust-level upgrade decisions    |
+-----------------------+----------------------------------+
| Joined result: full trace of action and approval         |
+----------------------------------------------------------+
```

| 記録区分 | 内容 | 監査時にわかること |
| --- | --- | --- |
| `AI log` | 各ステップのスクリーンショット、判断理由、参照知見、自動チェック結果 | AI が何を見て何を判断したか |
| `Human log` | 誰がいつ承認 / 差し戻ししたか、修正コメント全文、提案採否、昇格記録 | 人間が何を判断したか |
| `Joined result` | 両者を統合した監査ログ | その処理の責任所在 |

この記録により、「AI が何をして、人間が何を判断したか」を完全に追跡できます。監査時には「この処理は誰の責任で承認されたか」を特定できます。

---

## 画面の全体構成

```
                  +-----------+
                  |   Home    |
                  +-----+-----+
                        |
        +---------------+----------------+
        |               |                |
        v               v                v
   +---------+   +-------------+   +-------------+
   | Execute |   | Proposal    |   | Learning    |
   | review  |   | review      |   | status      |
   +----+----+   +-------------+   +------+------+
        |                                  |
        v                                  v
   +---------+                       +-----------+
   | Comment |                       | Upgrade   |
   +---------+                       +-----------+
```

| 画面 | 役割 | 主な利用者 |
| --- | --- | --- |
| `Home` | その日の対応優先度を決める起点 | 担当者 / 管理者 |
| `Execute review` | 実行監視と承認 | 担当者 |
| `Comment` | 差し戻し理由の入力 | 担当者 |
| `Proposal review` | 手順変更提案の採否判断 | 管理者 |
| `Learning status` | 精度推移と知見反映状況の確認 | 管理者 |
| `Upgrade` | 信頼レベル昇格の確認 | 管理者 |

担当者の日常導線は `Home -> Execute review -> (Approve or Comment) -> Home` です。管理者の週次導線は `Home -> Proposal review` と `Home -> Learning status -> Upgrade` です。

---

## まとめ: この管理画面が支える 4 つの原則

| アーキテクチャ設計書の原則 | 管理画面での体現 |
| -------------------------- | ---------------- |
| すべての変更は人間が承認する | 承認画面の承認ボタン、変更提案レビュー、昇格確認により、AI が勝手にルールを変えない |
| すべての操作は記録される | 全画面で操作を自動記録し、スクリーンショットを含む完全な操作証跡を残す |
| 信頼は実績で獲得する | 学習状況画面の精度推移と業務別状況により、客観的データにもとづく段階的な自律化を行う |
| 使うほど賢くなる | 修正コメントから知見を蓄積し、必要に応じて手順変更提案と精度向上へつなげる |

本システムの管理画面は、現場担当者の業務知識を AI に安全に移転するためのインターフェースです。担当者が修正コメントとして残す暗黙知は、組織の知的資産としてシステムに蓄積されます。退職や異動で失われることなく、すべての AI エージェントに即座に共有されます。
