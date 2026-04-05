import type {
  User, Task, Workflow, Comment, Knowledge,
  Proposal, WeeklyMetric, RepeatIssue, Guardrail, RunRecord,
  Agent, LearningMetric, CostMetric, POCPhase, BatchProposal,
} from './types'

// ── Users ──
export const users: User[] = [
  { id: 'u1', name: '田中 太郎', team: '経理部', role: 'staff' },
  { id: 'u2', name: '佐藤 由紀', team: '経理部', role: 'staff' },
  { id: 'u3', name: '藤原 真司', team: '経理部', role: 'manager' },
]

// ── Workflows ──
export const workflows: Workflow[] = [
  {
    id: 'wf1',
    name: 'domestic_transfer',
    jpName: '国内送金',
    category: 'transfer',
    riskLevel: 'high',
    confidence: 'high',
    trustMode: 'supervised',
    accuracy: 96.8,
    totalCases: 124,
    stepCount: 5,
    recommendation: { kind: 'ready_to_upgrade', label: '昇格可' },
    apiCostMonthlyJpy: 18400,
    estimatedSavingsJpy: 320000,
  },
  {
    id: 'wf2',
    name: 'overseas_transfer',
    jpName: '海外送金',
    category: 'transfer',
    riskLevel: 'high',
    confidence: 'medium',
    trustMode: 'supervised',
    accuracy: 91.7,
    totalCases: 12,
    stepCount: 5,
    recommendation: { kind: 'gathering_data', casesNeeded: 38, label: '実績収集中' },
    apiCostMonthlyJpy: 3200,
    estimatedSavingsJpy: 45000,
  },
  {
    id: 'wf3',
    name: 'personal_account_opening',
    jpName: '個人口座開設',
    category: 'account',
    riskLevel: 'medium',
    confidence: 'high',
    trustMode: 'supervised',
    accuracy: 93.5,
    totalCases: 62,
    stepCount: 4,
    recommendation: { kind: 'gathering_data', casesNeeded: 12, label: 'あと12件で昇格判定' },
    apiCostMonthlyJpy: 9600,
    estimatedSavingsJpy: 180000,
  },
  {
    id: 'wf4',
    name: 'corporate_account_opening',
    jpName: '法人口座開設',
    category: 'account',
    riskLevel: 'medium',
    confidence: 'medium',
    trustMode: 'supervised',
    accuracy: 88.2,
    totalCases: 28,
    stepCount: 4,
    recommendation: { kind: 'demoted', reason: 'UI変更を検知', label: '自動降格中' },
    driftDetected: true,
    autoDemotedAt: '2026-04-03',
    autoDemotedReason: '画面レイアウトの変更を検知。手順の見直しが必要です',
    apiCostMonthlyJpy: 5200,
    estimatedSavingsJpy: 85000,
  },
  {
    id: 'wf5',
    name: 'invoice_approval',
    jpName: '請求書承認',
    category: 'invoice',
    riskLevel: 'medium',
    confidence: 'high',
    trustMode: 'checkpoint',
    accuracy: 97.1,
    totalCases: 58,
    stepCount: 5,
    recommendation: { kind: 'stable', label: '安定稼働中' },
    apiCostMonthlyJpy: 12800,
    estimatedSavingsJpy: 240000,
  },
]

// ── Tasks ──
export const initialTasks: Task[] = [
  // Pending tasks
  {
    id: 'TX-0158',
    workflowId: 'wf1',
    workflowName: '国内送金',
    category: 'transfer',
    status: 'pending',
    currentStepNum: 3,
    timestamp: '09:12',
    elapsedLabel: '10分前',
    confidence: 96,
    aiJudgment: '請求書の金額と申請書の金額が一致しています。円未満の端数は社内ルールに従って切り捨て処理しました。',
    reusedKnowledge: ['円未満の端数は切り捨て', '金額確認前にPDFの全ページを確認'],
    pastApproved: 28,
    pastSentBack: 2,
    keyData: [
      { label: '送金金額', value: '¥342,000' },
      { label: '送金先', value: '株式会社日立製作所' },
      { label: '依頼部署', value: '営業部' },
      { label: '依頼日', value: '2026-04-05' },
    ],
    runId: 'run_tx0158',
    steps: [
      {
        stepNum: 1, name: '依頼確認', approvalRequired: true, status: 'completed', checks: [],
        goal: '送金依頼書の内容を確認する',
        expectedState: '依頼内容（金額・送金先・依頼部署）が画面上に正しく表示されている',
      },
      {
        stepNum: 2, name: '口座照合', approvalRequired: true, status: 'completed', checks: [],
        goal: '送金先口座の存在と名義を照合する',
        expectedState: '送金先口座情報が依頼書と一致している',
      },
      {
        stepNum: 3, name: '金額確認', approvalRequired: true, status: 'current',
        goal: '請求金額と添付証憑の金額が一致することを確認する',
        expectedState: '金額が一致している、端数処理が社内ルールに従っている',
        checks: [
          { name: '金額一致', status: 'ok', guardrailId: 'g2', severity: 'error' },
          { name: '重複確認', status: 'ok', guardrailId: 'g3', severity: 'error' },
          { name: '上限確認', status: 'ok', guardrailId: 'g4', severity: 'warning' },
        ],
      },
      {
        stepNum: 4, name: '実行', approvalRequired: true, status: 'upcoming', checks: [],
        goal: '送金処理を実行する',
        expectedState: '送金完了画面が表示される',
      },
      {
        stepNum: 5, name: '完了確認', approvalRequired: true, status: 'upcoming', checks: [],
        goal: '送金完了ステータスを確認する',
        expectedState: 'ステータスが「送金済」になっている',
      },
    ],
  },
  {
    id: 'ACC-0042',
    workflowId: 'wf3',
    workflowName: '個人口座開設',
    category: 'account',
    status: 'pending',
    currentStepNum: 2,
    timestamp: '09:08',
    elapsedLabel: '14分前',
    confidence: 92,
    aiJudgment: '本人確認書類（運転免許証）を確認しました。写真と申込書の情報が一致しています。',
    reusedKnowledge: ['有効期限は余裕をもって3ヶ月以上確認'],
    pastApproved: 15,
    pastSentBack: 1,
    keyData: [
      { label: '申込者', value: '鈴木 花子' },
      { label: '書類種別', value: '運転免許証' },
      { label: '申込日', value: '2026-04-05' },
    ],
    runId: 'run_acc0042',
    steps: [
      {
        stepNum: 1, name: 'フォーム読込', approvalRequired: true, status: 'completed', checks: [],
        goal: '申込フォームの情報を読み取る',
        expectedState: '申込者情報がシステムに入力されている',
      },
      {
        stepNum: 2, name: '本人確認書類', approvalRequired: true, status: 'current',
        goal: '本人確認書類の有効性を確認する',
        expectedState: '書類の写真が鮮明で、有効期限内である',
        checks: [
          { name: '書類形式', status: 'ok' },
          { name: '有効期限', status: 'ok' },
        ],
      },
      {
        stepNum: 3, name: 'KYC確認', approvalRequired: true, status: 'upcoming', checks: [],
        goal: 'KYC（本人確認）プロセスを完了する',
        expectedState: 'KYC確認完了のフラグが立っている',
      },
      {
        stepNum: 4, name: '口座開設', approvalRequired: true, status: 'upcoming', checks: [],
        goal: '口座開設処理を完了する',
        expectedState: '新しい口座番号が発行されている',
      },
    ],
  },
  {
    id: 'INV-0091',
    workflowId: 'wf5',
    workflowName: '請求書承認',
    category: 'invoice',
    status: 'pending',
    currentStepNum: 5,
    timestamp: '08:55',
    elapsedLabel: '27分前',
    confidence: 98,
    aiJudgment: '請求書の合計金額が発注書と一致しています。全明細を確認済みです。',
    pastApproved: 22,
    pastSentBack: 0,
    keyData: [
      { label: '請求金額', value: '¥180,000' },
      { label: '取引先', value: '株式会社アクメ' },
      { label: '発注書番号', value: 'PO-2026-0198' },
    ],
    runId: 'run_inv0091',
    steps: [
      { stepNum: 1, name: '発注書照合', approvalRequired: false, status: 'completed', checks: [], goal: '発注書と請求書を照合する', expectedState: '発注書と請求書が紐づいている' },
      { stepNum: 2, name: '明細確認', approvalRequired: false, status: 'completed', checks: [], goal: '明細行を確認する', expectedState: '全明細が発注書と一致している' },
      { stepNum: 3, name: '税額計算', approvalRequired: true, status: 'completed', checks: [], goal: '税額を計算する', expectedState: '税額が正しく計算されている' },
      { stepNum: 4, name: '予算確認', approvalRequired: false, status: 'completed', checks: [], goal: '予算枠を確認する', expectedState: '予算内に収まっている' },
      {
        stepNum: 5, name: '最終承認', approvalRequired: true, status: 'current',
        goal: '承認ボタンを押下する',
        expectedState: '承認ステータスが「承認済」になっている',
        checks: [
          { name: '金額一致', status: 'ok', guardrailId: 'g2', severity: 'error' },
          { name: '予算上限', status: 'ok', guardrailId: 'g4', severity: 'warning' },
          { name: '取引先確認', status: 'ok', guardrailId: 'g1', severity: 'error' },
        ],
      },
    ],
  },
  // Check-failed task（金額不一致）
  {
    id: 'TX-0162',
    workflowId: 'wf1',
    workflowName: '国内送金',
    category: 'transfer',
    status: 'pending',
    currentStepNum: 3,
    timestamp: '09:25',
    elapsedLabel: '2分前',
    confidence: 45,
    aiJudgment: '金額の不一致を検出しました。担当者の確認をお願いします。',
    pastApproved: 28,
    pastSentBack: 2,
    keyData: [
      { label: '送金金額（依頼書）', value: '¥2,450,000' },
      { label: '金額（証憑）', value: '¥2,350,000' },
      { label: '送金先', value: '豊田通商株式会社' },
      { label: '差分', value: '¥100,000' },
    ],
    runId: 'run_tx0162',
    steps: [
      { stepNum: 1, name: '依頼確認', approvalRequired: true, status: 'completed', checks: [], goal: '送金依頼書の内容を確認する', expectedState: '依頼内容が画面上に正しく表示されている' },
      { stepNum: 2, name: '口座照合', approvalRequired: true, status: 'completed', checks: [], goal: '送金先口座を照合する', expectedState: '口座情報が一致している' },
      {
        stepNum: 3, name: '金額確認', approvalRequired: true, status: 'current',
        goal: '請求金額と証憑金額の一致を確認する',
        expectedState: '金額が完全に一致している',
        checks: [
          { name: '重複確認', status: 'ok', guardrailId: 'g3', severity: 'error' },
          { name: '上限確認', status: 'ok', guardrailId: 'g4', severity: 'warning' },
          { name: '金額一致', status: 'ng', delta: 100000, guardrailId: 'g2', severity: 'error' },
        ],
      },
      { stepNum: 4, name: '実行', approvalRequired: true, status: 'upcoming', checks: [], goal: '送金処理を実行する', expectedState: '送金完了画面が表示される' },
      { stepNum: 5, name: '完了確認', approvalRequired: true, status: 'upcoming', checks: [], goal: '送金完了を確認する', expectedState: 'ステータスが「送金済」になっている' },
    ],
  },
  // Running tasks
  {
    id: 'TX-0159',
    workflowId: 'wf1',
    workflowName: '国内送金',
    category: 'transfer',
    status: 'running',
    currentStepNum: 2,
    timestamp: '09:18',
    elapsedLabel: '実行中',
    confidence: 94,
    keyData: [
      { label: '送金金額', value: '¥85,000' },
      { label: '送金先', value: '株式会社メルカリ' },
    ],
    steps: [
      { stepNum: 1, name: '依頼確認', approvalRequired: true, status: 'completed', checks: [] },
      { stepNum: 2, name: '口座照合', approvalRequired: true, status: 'current', checks: [] },
      { stepNum: 3, name: '金額確認', approvalRequired: true, status: 'upcoming', checks: [] },
      { stepNum: 4, name: '実行', approvalRequired: true, status: 'upcoming', checks: [] },
      { stepNum: 5, name: '完了確認', approvalRequired: true, status: 'upcoming', checks: [] },
    ],
  },
  {
    id: 'ACC-0043',
    workflowId: 'wf3',
    workflowName: '個人口座開設',
    category: 'account',
    status: 'running',
    currentStepNum: 1,
    timestamp: '09:20',
    elapsedLabel: '実行中',
    confidence: 88,
    keyData: [
      { label: '申込者', value: '山田 次郎' },
    ],
    steps: [
      { stepNum: 1, name: 'フォーム読込', approvalRequired: true, status: 'current', checks: [] },
      { stepNum: 2, name: '本人確認書類', approvalRequired: true, status: 'upcoming', checks: [] },
      { stepNum: 3, name: 'KYC確認', approvalRequired: true, status: 'upcoming', checks: [] },
      { stepNum: 4, name: '口座開設', approvalRequired: true, status: 'upcoming', checks: [] },
    ],
  },
  {
    id: 'TX-0160',
    workflowId: 'wf2',
    workflowName: '海外送金',
    category: 'transfer',
    status: 'running',
    currentStepNum: 0,
    timestamp: '09:22',
    elapsedLabel: '開始待ち',
    confidence: 0,
    keyData: [
      { label: '送金金額', value: '$12,500 USD' },
      { label: '送金先', value: 'Acme Corp (USA)' },
    ],
    steps: [
      { stepNum: 1, name: '依頼確認', approvalRequired: true, status: 'upcoming', checks: [] },
      { stepNum: 2, name: '口座照合', approvalRequired: true, status: 'upcoming', checks: [] },
      { stepNum: 3, name: 'コンプライアンス', approvalRequired: true, status: 'upcoming', checks: [] },
      { stepNum: 4, name: '為替レート', approvalRequired: true, status: 'upcoming', checks: [] },
      { stepNum: 5, name: '完了確認', approvalRequired: true, status: 'upcoming', checks: [] },
    ],
  },
  // Done tasks
  {
    id: 'TX-0155',
    workflowId: 'wf1',
    workflowName: '国内送金',
    category: 'transfer',
    status: 'done',
    currentStepNum: 5,
    timestamp: '08:30',
    elapsedLabel: '完了済',
    confidence: 97,
    keyData: [],
    steps: [],
  },
  {
    id: 'INV-0089',
    workflowId: 'wf5',
    workflowName: '請求書承認',
    category: 'invoice',
    status: 'done',
    currentStepNum: 5,
    timestamp: '08:15',
    elapsedLabel: '完了済',
    confidence: 98,
    keyData: [],
    steps: [],
  },
]

// ── Comments（修正コメント）──
export const comments: Comment[] = [
  {
    id: 'c1', author: '佐藤 由紀', date: '04/02',
    text: 'PDF証憑が2ページあるのに、1ページ目の金額しか確認していなかった。全ページをスクロールして確認する必要がある。',
    before: '1ページ目のみ確認', after: '全ページスクロールして確認',
    taskId: 'INV-0085', stepName: '金額確認',
    errorCategory: 'edge_case', ruleScope: 'rule_change',
  },
  {
    id: 'c2', author: '田中 太郎', date: '04/03',
    text: '金額の端数処理が四捨五入になっていた。社内ルールでは切り捨て。',
    before: '¥55,000（四捨五入）', after: '¥55,000（切り捨て済）',
    taskId: 'TX-0145', stepName: '金額確認',
    errorCategory: 'judgment_gap', ruleScope: 'rule_change',
  },
  {
    id: 'c3', author: '佐藤 由紀', date: '04/04',
    text: '法人口座開設で代表者本人確認書類が添付されていたのに、AIが見落としていた。',
    before: '代表者IDなし', after: '代表者IDあり・確認済',
    taskId: 'ACC-0038', stepName: '本人確認書類',
    errorCategory: 'misunderstanding', ruleScope: 'rule_change',
  },
  {
    id: 'c4', author: '田中 太郎', date: '04/04',
    text: '口座名義のカナが半角だったが問題なし。半角カナも許容するルールに。',
    before: 'エラー判定', after: '許容（半角カナOK）',
    taskId: 'ACC-0039', stepName: 'フォーム読込',
    errorCategory: 'edge_case', ruleScope: 'rule_change',
  },
  {
    id: 'c5', author: '佐藤 由紀', date: '04/05',
    text: '申請書の添付ファイルが破損していた。再提出を依頼。',
    taskId: 'INV-0088', stepName: '明細確認',
    errorCategory: 'data_error', ruleScope: 'one_off',
  },
  {
    id: 'c6', author: '田中 太郎', date: '04/05',
    text: '承認画面の「承認」ボタンの位置が変わっていた。画面右上→画面右下へ移動。',
    before: 'ボタン位置: 右上', after: 'ボタン位置: 右下',
    taskId: 'INV-0090', stepName: '最終承認',
    errorCategory: 'ui_change', ruleScope: 'rule_change',
  },
]

// ── Knowledge ──
export const knowledgeItems: Knowledge[] = [
  {
    id: 'k1', text: '円未満の端数は切り捨て（社内ルール）',
    sourceCount: 3, usageCount: 12,
    confidence: 'verified',
    affects: ['国内送金#金額確認', '請求書承認#税額計算'],
    sourceCorrectionIds: ['c2'],
  },
  {
    id: 'k2', text: '金額確認前にPDFの全ページをスクロール確認',
    sourceCount: 3, usageCount: 8,
    confidence: 'verified',
    affects: ['請求書承認#金額確認', '国内送金#金額確認'],
    sourceCorrectionIds: ['c1'],
  },
  {
    id: 'k3', text: '口座名義のカナは半角も許容',
    sourceCount: 1, usageCount: 5,
    confidence: 'verified',
    affects: ['個人口座開設#フォーム読込', '法人口座開設#フォーム読込'],
    sourceCorrectionIds: ['c4'],
  },
  {
    id: 'k4', text: '法人口座開設では代表者本人確認書類が必須',
    sourceCount: 3, usageCount: 3,
    confidence: 'staging',
    affects: ['法人口座開設#本人確認書類'],
    sourceCorrectionIds: ['c3'],
  },
  {
    id: 'k5', text: '承認ボタンの位置変更に追従（2026-04時点）',
    sourceCount: 2, usageCount: 2,
    confidence: 'staging',
    affects: ['請求書承認#最終承認'],
    sourceCorrectionIds: ['c6'],
  },
  {
    id: 'k6', text: '本人確認書類の有効期限は余裕をもって3ヶ月以上を確認',
    sourceCount: 1, usageCount: 9,
    confidence: 'verified',
    affects: ['個人口座開設#本人確認書類'],
    sourceCorrectionIds: [],
  },
  {
    id: 'k7', text: '高額送金（¥2,000,000超）は二重承認を推奨',
    sourceCount: 2, usageCount: 4,
    confidence: 'contested',
    affects: ['国内送金#金額確認'],
    sourceCorrectionIds: [],
  },
]

// ── Proposals ──
export const proposals: Proposal[] = [
  {
    id: '1',
    what: '「PDFの場合は全ページをスクロールして確認」というヒントを追加',
    why: '過去30日間で、PDF証憑の2ページ目以降が見落とされるケースが3件発生',
    scopeWorkflows: ['国内送金', '請求書承認'],
    scopeCaseCount: 47,
    riskLevel: 'low',
    riskRationale: 'ヒント追加のみで既存動作への影響なし。Tier 2変更だが安全側の情報追加',
    voices: [
      { author: '佐藤 由紀', date: '04/02', text: 'PDF2ページ目が見落とされた', commentId: 'c1' },
      { author: '田中 太郎', date: '04/03', text: '同様のPDF問題が再発', commentId: 'c1' },
      { author: '佐藤 由紀', date: '04/04', text: 'PDFページ見落としが3件目', commentId: 'c1' },
    ],
    status: 'open',
    changeType: 'hint_update',
    targetProcedureJp: '国内送金 / 請求書承認 > 金額確認ステップ',
    diff: {
      pathJp: 'ヒント文言（金額確認ステップ）',
      before: ['添付ファイルタブで証憑を確認'],
      after: ['添付ファイルタブで証憑を確認', 'PDFの場合はスクロールして全ページ確認が必要'],
    },
    impactAnalysis: {
      affectedRunsLast30d: 12,
      preventableMissesCount: 3,
      relatedProcedures: ['請求書作成'],
      riskAssessment: '低リスク。ヒント追加のみで既存の動作への影響なし。過去30日に発生した3件の差し戻しを今後は防止可能。',
    },
    sourceCorrectionIds: ['c1'],
    reviewMode: 'individual',
  },
  {
    id: '2',
    what: '法人口座開設に「代表者本人確認書類の確認」ステップを追加',
    why: '直近5件中3件の法人口座開設が、代表者本人確認書類の見落としで差し戻し',
    scopeWorkflows: ['法人口座開設'],
    scopeCaseCount: 28,
    riskLevel: 'medium',
    riskRationale: '新規ステップの追加。法人口座開設の処理時間が+30秒程度増加の見込み',
    voices: [
      { author: '佐藤 由紀', date: '04/02', text: '代表者IDが必要', commentId: 'c3' },
      { author: '田中 太郎', date: '04/03', text: '代表者IDが見落とされた', commentId: 'c3' },
      { author: '佐藤 由紀', date: '04/04', text: '同じ問題が再発', commentId: 'c3' },
    ],
    status: 'open',
    changeType: 'step_add',
    targetProcedureJp: '法人口座開設',
    diff: {
      pathJp: '本人確認書類ステップの直後',
      before: ['1. フォーム読込', '2. 本人確認書類', '3. KYC確認', '4. 口座開設'],
      after: ['1. フォーム読込', '2. 本人確認書類', '3. 代表者本人確認書類 (新規)', '4. KYC確認', '5. 口座開設'],
    },
    impactAnalysis: {
      affectedRunsLast30d: 28,
      preventableMissesCount: 3,
      relatedProcedures: [],
      riskAssessment: '中リスク。ステップ追加による既存ランの再学習が必要。過去30日で3件の差し戻しを防止可能。',
    },
    sourceCorrectionIds: ['c3'],
    reviewMode: 'individual',
  },
]

// ── バッチ提案（ブートストラップ時の一括レビュー、architecture.md §6） ──
export const batchProposals: BatchProposal[] = [
  {
    id: 'batch_001',
    createdAt: '2026-04-01',
    description: '初期マニュアル取り込みから自動生成された5手順の一括レビュー',
    items: [
      { procedureJp: '国内送金', status: 'approved', confidence: 92, summary: '5ステップ、全ステップ承認モード' },
      { procedureJp: '海外送金', status: 'approved', confidence: 88, summary: '5ステップ、コンプライアンス確認含む' },
      { procedureJp: '個人口座開設', status: 'approved', confidence: 94, summary: '4ステップ、KYC確認含む' },
      { procedureJp: '法人口座開設', status: 'deferred', confidence: 76, summary: '代表者確認ステップの詳細化が必要' },
      { procedureJp: '請求書承認', status: 'approved', confidence: 95, summary: '5ステップ、予算連携あり' },
    ],
  },
]

// ── Weekly metrics ──
export const weeklyMetrics: WeeklyMetric[] = [
  { week: 1, accuracy: 82 },
  { week: 2, accuracy: 85 },
  { week: 3, accuracy: 88 },
  { week: 4, accuracy: 90 },
  { week: 5, accuracy: 91 },
  { week: 6, accuracy: 92 },
  { week: 7, accuracy: 92.5 },
  { week: 8, accuracy: 93 },
  { week: 9, accuracy: 93.8 },
  { week: 10, accuracy: 94.2 },
  { week: 11, accuracy: 95 },
  { week: 12, accuracy: 96 },
]

// ── 学習メトリクス（週次、フライホイール用）──
export const learningMetrics: LearningMetric[] = [
  { week: 1, weekLabel: '1月第1週', correctionsIn: 8, knowledgeCompiled: 2, proposalsGenerated: 1, proposalsApproved: 0, humanApprovalsRequired: 186 },
  { week: 2, weekLabel: '1月第2週', correctionsIn: 12, knowledgeCompiled: 3, proposalsGenerated: 1, proposalsApproved: 1, humanApprovalsRequired: 178 },
  { week: 3, weekLabel: '1月第3週', correctionsIn: 9, knowledgeCompiled: 4, proposalsGenerated: 2, proposalsApproved: 1, humanApprovalsRequired: 171 },
  { week: 4, weekLabel: '1月第4週', correctionsIn: 7, knowledgeCompiled: 5, proposalsGenerated: 1, proposalsApproved: 1, humanApprovalsRequired: 162 },
  { week: 5, weekLabel: '2月第1週', correctionsIn: 6, knowledgeCompiled: 6, proposalsGenerated: 2, proposalsApproved: 2, humanApprovalsRequired: 154 },
  { week: 6, weekLabel: '2月第2週', correctionsIn: 5, knowledgeCompiled: 7, proposalsGenerated: 1, proposalsApproved: 1, humanApprovalsRequired: 148 },
  { week: 7, weekLabel: '2月第3週', correctionsIn: 8, knowledgeCompiled: 9, proposalsGenerated: 2, proposalsApproved: 1, humanApprovalsRequired: 142 },
  { week: 8, weekLabel: '2月第4週', correctionsIn: 4, knowledgeCompiled: 10, proposalsGenerated: 1, proposalsApproved: 1, humanApprovalsRequired: 138 },
  { week: 9, weekLabel: '3月第1週', correctionsIn: 6, knowledgeCompiled: 12, proposalsGenerated: 2, proposalsApproved: 2, humanApprovalsRequired: 130 },
  { week: 10, weekLabel: '3月第2週', correctionsIn: 5, knowledgeCompiled: 14, proposalsGenerated: 1, proposalsApproved: 1, humanApprovalsRequired: 124 },
  { week: 11, weekLabel: '3月第3週', correctionsIn: 3, knowledgeCompiled: 17, proposalsGenerated: 1, proposalsApproved: 1, humanApprovalsRequired: 118 },
  { week: 12, weekLabel: '3月第4週', correctionsIn: 4, knowledgeCompiled: 19, proposalsGenerated: 2, proposalsApproved: 1, humanApprovalsRequired: 112 },
]

// ── コストメトリクス（月次）──
export const costMetrics: CostMetric[] = [
  { yearMonth: '2026-01', totalApiCostJpy: 28400, runsCount: 142, avgCostPerRunJpy: 200, estimatedSavingsJpy: 485000, netBenefitJpy: 456600 },
  { yearMonth: '2026-02', totalApiCostJpy: 41200, runsCount: 206, avgCostPerRunJpy: 200, estimatedSavingsJpy: 720000, netBenefitJpy: 678800 },
  { yearMonth: '2026-03', totalApiCostJpy: 49200, runsCount: 284, avgCostPerRunJpy: 173, estimatedSavingsJpy: 870000, netBenefitJpy: 820800 },
]

// ── POCフェーズ（architecture.md §11）──
export const pocPhases: POCPhase[] = [
  {
    phase: 1,
    jpTitle: 'マニュアル取り込み',
    subtitle: '業務マニュアルをAIに読み込ませ、自動化手順を作成',
    status: 'completed',
    startedAt: '2026-01-06',
    completedAt: '2026-01-24',
    keyPoints: [
      '5業務のマニュアルを取り込み',
      'AIが手順定義を自動生成',
      '管理者が一括レビュー・承認',
      '規制要件の整理を実施',
    ],
  },
  {
    phase: 2,
    jpTitle: '全承認モードで実行（現在）',
    subtitle: '全ステップ人間承認付きでAIが業務を実行、精度向上を進める',
    status: 'in_progress',
    startedAt: '2026-01-27',
    keyPoints: [
      '5業務で合計284件を処理',
      '精度は82%→96%まで向上',
      '19件のナレッジを蓄積',
      '8件の提案のうち6件を承認済',
    ],
  },
  {
    phase: 3,
    jpTitle: '省力化効果の測定',
    subtitle: '承認ポイントを削減し、実際の省力化効果を定量測定',
    status: 'upcoming',
    keyPoints: [
      '信頼レベル昇格による承認削減',
      '自動化率・処理時間を計測',
      '本格展開時のROI試算',
      '拡大対象業務の選定',
    ],
  },
]

// ── Guardrails（architecture.md §7）──
export const guardrails: Guardrail[] = [
  {
    id: 'g1',
    jpName: '取引先マスタ照合',
    description: '送金先・支払先は事前登録済みの取引先マスタに存在する必要がある',
    appliesToJp: ['国内送金 > 口座照合', '海外送金 > 口座照合', '請求書承認 > 最終承認'],
    severity: 'error',
    sourceKnowledgeIds: [],
    firedCount: 248,
    createdAt: '2026-01-06',
  },
  {
    id: 'g2',
    jpName: '金額一致チェック',
    description: '請求書と証憑の金額が一致していない場合はブロック',
    appliesToJp: ['国内送金 > 金額確認', '請求書承認 > 最終承認'],
    severity: 'error',
    sourceKnowledgeIds: ['k1'],
    proposalId: 'proposal_20260115_002',
    firedCount: 186,
    createdAt: '2026-01-15',
  },
  {
    id: 'g3',
    jpName: '重複請求防止',
    description: '同一請求書番号が過去30日内に処理されていないことを確認',
    appliesToJp: ['請求書承認 > 発注書照合'],
    severity: 'error',
    sourceKnowledgeIds: [],
    firedCount: 4,
    createdAt: '2026-01-06',
  },
  {
    id: 'g4',
    jpName: '高額案件の警告',
    description: '¥2,000,000を超える送金・支払は警告を表示（ブロックはしない）',
    appliesToJp: ['国内送金 > 金額確認', '海外送金 > 金額確認', '請求書承認 > 最終承認'],
    severity: 'warning',
    sourceKnowledgeIds: ['k7'],
    firedCount: 32,
    createdAt: '2026-02-10',
  },
  {
    id: 'g5',
    jpName: '本人確認書類の有効期限',
    description: '本人確認書類の有効期限が3ヶ月以上残っていることを確認',
    appliesToJp: ['個人口座開設 > 本人確認書類', '法人口座開設 > 本人確認書類'],
    severity: 'warning',
    sourceKnowledgeIds: ['k6'],
    firedCount: 18,
    createdAt: '2026-02-24',
  },
]

// ── 実行記録（architecture.md §3, §10）──
export const runHistory: RunRecord[] = [
  { id: 'run_tx0158', yearMonth: '2026-04', procedureJp: '国内送金', procedureCategory: 'transfer', startedAt: '2026-04-05 09:12', status: 'in_progress', stepCount: 5, humanApprovals: 2, hasScreenshots: true, hasFeedback: false, apiCostJpy: 142, elapsedSec: 580 },
  { id: 'run_acc0042', yearMonth: '2026-04', procedureJp: '個人口座開設', procedureCategory: 'account', startedAt: '2026-04-05 09:08', status: 'in_progress', stepCount: 4, humanApprovals: 1, hasScreenshots: true, hasFeedback: false, apiCostJpy: 98, elapsedSec: 820 },
  { id: 'run_inv0091', yearMonth: '2026-04', procedureJp: '請求書承認', procedureCategory: 'invoice', startedAt: '2026-04-05 08:55', status: 'in_progress', stepCount: 5, humanApprovals: 4, hasScreenshots: true, hasFeedback: false, apiCostJpy: 168, elapsedSec: 1620 },
  { id: 'run_tx0162', yearMonth: '2026-04', procedureJp: '国内送金', procedureCategory: 'transfer', startedAt: '2026-04-05 09:25', status: 'in_progress', stepCount: 5, humanApprovals: 2, hasScreenshots: true, hasFeedback: false, apiCostJpy: 156, elapsedSec: 120 },
  { id: 'run_tx0155', yearMonth: '2026-04', procedureJp: '国内送金', procedureCategory: 'transfer', startedAt: '2026-04-05 08:30', completedAt: '2026-04-05 08:42', status: 'completed', stepCount: 5, humanApprovals: 5, hasScreenshots: true, hasFeedback: false, approvedBy: '田中 太郎', apiCostJpy: 184, elapsedSec: 720 },
  { id: 'run_inv0089', yearMonth: '2026-04', procedureJp: '請求書承認', procedureCategory: 'invoice', startedAt: '2026-04-05 08:15', completedAt: '2026-04-05 08:24', status: 'completed', stepCount: 5, humanApprovals: 2, hasScreenshots: true, hasFeedback: false, approvedBy: '佐藤 由紀', apiCostJpy: 162, elapsedSec: 540 },
  { id: 'run_tx0150', yearMonth: '2026-04', procedureJp: '国内送金', procedureCategory: 'transfer', startedAt: '2026-04-04 17:28', completedAt: '2026-04-04 17:35', status: 'completed', stepCount: 5, humanApprovals: 5, hasScreenshots: true, hasFeedback: false, approvedBy: '佐藤 由紀', apiCostJpy: 176, elapsedSec: 420 },
  { id: 'run_inv0088', yearMonth: '2026-04', procedureJp: '請求書承認', procedureCategory: 'invoice', startedAt: '2026-04-04 16:50', completedAt: '2026-04-04 17:03', status: 'sent_back', stepCount: 5, humanApprovals: 3, hasScreenshots: true, hasFeedback: true, approvedBy: '佐藤 由紀', apiCostJpy: 198, elapsedSec: 780 },
  { id: 'run_acc0041', yearMonth: '2026-04', procedureJp: '個人口座開設', procedureCategory: 'account', startedAt: '2026-04-04 15:12', completedAt: '2026-04-04 15:28', status: 'completed', stepCount: 4, humanApprovals: 4, hasScreenshots: true, hasFeedback: false, approvedBy: '田中 太郎', apiCostJpy: 124, elapsedSec: 960 },
  { id: 'run_tx0148', yearMonth: '2026-04', procedureJp: '国内送金', procedureCategory: 'transfer', startedAt: '2026-04-04 14:20', completedAt: '2026-04-04 14:27', status: 'completed', stepCount: 5, humanApprovals: 5, hasScreenshots: true, hasFeedback: false, approvedBy: '田中 太郎', apiCostJpy: 168, elapsedSec: 420 },
  { id: 'run_inv0087', yearMonth: '2026-04', procedureJp: '請求書承認', procedureCategory: 'invoice', startedAt: '2026-04-04 11:42', completedAt: '2026-04-04 11:52', status: 'completed', stepCount: 5, humanApprovals: 2, hasScreenshots: true, hasFeedback: false, approvedBy: '佐藤 由紀', apiCostJpy: 156, elapsedSec: 600 },
  { id: 'run_tx0145', yearMonth: '2026-04', procedureJp: '国内送金', procedureCategory: 'transfer', startedAt: '2026-04-03 16:08', completedAt: '2026-04-03 16:19', status: 'sent_back', stepCount: 5, humanApprovals: 3, hasScreenshots: true, hasFeedback: true, approvedBy: '田中 太郎', apiCostJpy: 182, elapsedSec: 660 },
]

// ── AIエージェント（architecture.md §8）──
export const agents: Agent[] = [
  {
    id: 'agent_transfer',
    jpName: '送金処理エージェント',
    description: '国内・海外送金業務を担当するAIエージェント',
    assignedProceduresJp: ['国内送金', '海外送金'],
    tools: ['画面操作', 'スクリーンショット', 'ナレッジ検索'],
    maxConcurrentRuns: 1,
    timeoutPerStepSec: 60,
    maxRetriesPerStep: 2,
    currentStatus: 'running',
    currentRunId: 'run_tx0158',
    runsLast30d: 86,
    accuracyLast30d: 95.4,
  },
  {
    id: 'agent_account',
    jpName: '口座開設エージェント',
    description: '個人・法人口座開設業務を担当',
    assignedProceduresJp: ['個人口座開設', '法人口座開設'],
    tools: ['画面操作', 'スクリーンショット', 'ナレッジ検索', '書類OCR'],
    maxConcurrentRuns: 1,
    timeoutPerStepSec: 90,
    maxRetriesPerStep: 2,
    currentStatus: 'running',
    currentRunId: 'run_acc0042',
    runsLast30d: 48,
    accuracyLast30d: 91.2,
  },
  {
    id: 'agent_invoice',
    jpName: '請求書承認エージェント',
    description: '請求書確認・承認業務を担当',
    assignedProceduresJp: ['請求書承認'],
    tools: ['画面操作', 'スクリーンショット', 'ナレッジ検索'],
    maxConcurrentRuns: 2,
    timeoutPerStepSec: 45,
    maxRetriesPerStep: 3,
    currentStatus: 'running',
    currentRunId: 'run_inv0091',
    runsLast30d: 58,
    accuracyLast30d: 97.1,
  },
]

// ── Repeat issue warning ──
export const repeatIssue: RepeatIssue = {
  workflow: '法人口座開設',
  description: '代表者本人確認書類の見落とし',
  count: 3,
  total: 5,
  entries: [
    { date: '04/02', author: '佐藤 由紀', text: '代表者IDが必要' },
    { date: '04/03', author: '田中 太郎', text: '代表者IDが見落とされた' },
    { date: '04/04', author: '佐藤 由紀', text: '同じ問題が再発' },
  ],
  proposalStatus: '手順変更の提案を作成済（レビュー待ち）',
}

// ── Similar notes for comment screen ──
export const similarNotes = [
  { text: '確認前にPDFの全ページをスクロールすること', matchScore: 0.92 },
  { text: '端数は四捨五入ではなく切り捨てを使用', matchScore: 0.78 },
  { text: '証憑が複数ページに渡る場合は特に注意', matchScore: 0.71 },
]

// ── Learning Status ──
export const learningSummary = {
  total: 284,
  accuracy: 96.0,
  knowledge: 19,
  humanApprovalsReduced: 74, // 186 → 112
}

export const commentImpact = {
  totalComments: 11,
  learned: 9,
  proposalsGenerated: 2,
  proposalsApproved: 1,
  example: 'カナ正規化 → 同種のミスが再発しなくなった',
}

// ── Upgrade Target ──
export const upgradeTarget = {
  workflowId: 'wf1',
  workflowName: '国内送金',
  currentMode: 'supervised' as const,
  nextMode: 'checkpoint' as const,
  currentApprovals: 5,
  nextApprovals: 2,
  steps: [
    { name: '依頼確認', current: 'human' as const, next: 'ai' as const },
    { name: '口座照合', current: 'human' as const, next: 'ai' as const },
    { name: '金額確認', current: 'human' as const, next: 'human' as const },
    { name: '実行', current: 'human' as const, next: 'ai' as const },
    { name: '完了確認', current: 'human' as const, next: 'human' as const },
  ],
  reason: {
    cleanRuns: 50,
    accuracy: 96.8,
    sendBacksLearned: 4,
  },
  safety: '精度が90%を下回った場合、自動的に全ステップ承認モードに戻ります（自動降格）',
  currentAccuracy: 96.8,
  demotionThreshold: 90,
}
