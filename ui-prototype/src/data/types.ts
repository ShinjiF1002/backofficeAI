export type Role = 'staff' | 'manager'

export interface User {
  id: string
  name: string
  team: string
  role: Role
}

export type TaskStatus = 'pending' | 'running' | 'done'
export type CheckStatus = 'ok' | 'ng'

// architecture.md §4 trust_level 準拠
export type TrustMode = 'supervised' | 'checkpoint' | 'autonomous'

export const trustModeLabels: Record<TrustMode, string> = {
  supervised: '全ステップ承認',
  checkpoint: 'チェックポイント承認',
  autonomous: '事後確認',
}

export const trustModeDescriptions: Record<TrustMode, string> = {
  supervised: 'すべてのステップで担当者が確認',
  checkpoint: '重要ステップのみ担当者が確認',
  autonomous: '実行後にログをレビュー',
}

// 業務カテゴリ
export type ProcedureCategory = 'transfer' | 'account' | 'invoice' | 'payment' | 'expense' | 'vendor'

export const categoryLabels: Record<ProcedureCategory, string> = {
  transfer: '送金',
  account: '口座開設',
  invoice: '請求書',
  payment: '支払',
  expense: '経費',
  vendor: 'ベンダー',
}

export type RiskLevel = 'low' | 'medium' | 'high'

export const riskLevelLabels: Record<RiskLevel, string> = {
  low: '低',
  medium: '中',
  high: '高',
}

// architecture.md §9 エラー分類体系
export type ErrorCategory = 'misunderstanding' | 'ui_change' | 'edge_case' | 'judgment_gap' | 'data_error'

export const errorCategoryLabels: Record<ErrorCategory, string> = {
  misunderstanding: '手順の誤解',
  ui_change: 'UI変更',
  edge_case: 'エッジケース',
  judgment_gap: '判断基準の乖離',
  data_error: 'データ問題',
}

export const errorCategoryDescriptions: Record<ErrorCategory, string> = {
  misunderstanding: 'マニュアルの解釈ミス',
  ui_change: 'アプリ側のUI変更に追従できていない',
  edge_case: 'マニュアルに記載のない例外',
  judgment_gap: '人間の暗黙知との乖離',
  data_error: '入力データの問題（AIの責任ではない）',
}

// architecture.md §9 反映先
export const errorCategoryRouting: Record<ErrorCategory, 'tier1' | 'tier2' | 'log_only'> = {
  misunderstanding: 'tier2',
  ui_change: 'tier2',
  edge_case: 'tier1',
  judgment_gap: 'tier1',
  data_error: 'log_only',
}

export type GuardrailSeverity = 'error' | 'warning'

export const guardrailSeverityLabels: Record<GuardrailSeverity, string> = {
  error: 'ブロック',
  warning: '警告',
}

export interface Check {
  name: string
  status: CheckStatus
  delta?: number
  /** architecture.md §7: このチェックが発火させたガードレールID */
  guardrailId?: string
  severity?: GuardrailSeverity
}

export interface Step {
  stepNum: number
  name: string
  approvalRequired: boolean
  status: 'completed' | 'current' | 'upcoming'
  checks: Check[]
  /** architecture.md §4: goal（不変、業務ロジック） */
  goal?: string
  /** architecture.md §4: expected_state（不変、達成すべき状態） */
  expectedState?: string
}

export interface Task {
  id: string
  workflowId: string
  workflowName: string
  /** 業務カテゴリ（色分け・アイコンに使用） */
  category: ProcedureCategory
  status: TaskStatus
  currentStepNum: number
  steps: Step[]
  /** 開始時刻 hh:mm */
  timestamp: string
  /** 経過時間の自然文（「10分前」等） */
  elapsedLabel: string
  /** AI信頼度 0-100 */
  confidence: number
  aiJudgment?: string
  reusedKnowledge?: string[]
  pastApproved?: number
  pastSentBack?: number
  /** 業務固有の主要データ（金額/取引先/書類番号等） */
  keyData: { label: string; value: string }[]
  /** runs/ への参照 */
  runId?: string
}

export interface Workflow {
  id: string
  /** 技術ID（内部用） */
  name: string
  /** 表示名 */
  jpName: string
  category: ProcedureCategory
  riskLevel: RiskLevel
  confidence: 'high' | 'medium'
  trustMode: TrustMode
  /** 精度（architecture.md §10 「修正コメントなし承認数 / 全run数」） */
  accuracy: number
  totalCases: number
  stepCount: number
  recommendation: WorkflowRecommendation
  /** architecture.md §10: マニュアル乖離検知で自動降格フラグ */
  driftDetected?: boolean
  autoDemotedAt?: string
  autoDemotedReason?: string
  /** 月次API費用（円） */
  apiCostMonthlyJpy: number
  /** 想定人件費削減（円/月） */
  estimatedSavingsJpy: number
}

export type WorkflowRecommendation =
  | { kind: 'ready_to_upgrade'; label: string }
  | { kind: 'gathering_data'; casesNeeded: number; label: string }
  | { kind: 'stable'; label: string }
  | { kind: 'improving'; label: string }
  | { kind: 'demoted'; reason: string; label: string }

export interface Comment {
  id: string
  author: string
  date: string
  text: string
  taskId: string
  stepName: string
  /** 修正前の値（任意） */
  before?: string
  /** 修正後の値（任意） */
  after?: string
  errorCategory: ErrorCategory
  /** このコメントが一度限りか、ルール化すべきか */
  ruleScope: 'one_off' | 'rule_change'
}

export interface Knowledge {
  id: string
  text: string
  sourceCount: number
  usageCount: number
  /** architecture.md §5 confidence */
  confidence: 'staging' | 'verified' | 'contested'
  affects: string[]
  /** 関連するcorrection ID */
  sourceCorrectionIds: string[]
}

export type ProposalChangeType =
  | 'hint_update'
  | 'step_add'
  | 'validation_change'
  | 'guardrail_add'
  | 'guardrail_modify'

export const changeTypeLabels: Record<ProposalChangeType, string> = {
  hint_update: 'ヒント更新',
  step_add: 'ステップ追加',
  validation_change: '検証ルール変更',
  guardrail_add: 'ガードレール追加',
  guardrail_modify: 'ガードレール変更',
}

export interface Proposal {
  id: string
  what: string
  why: string
  scopeWorkflows: string[]
  scopeCaseCount: number
  riskLevel: RiskLevel
  riskRationale: string
  voices: { author: string; date: string; text: string; commentId?: string }[]
  status: 'open' | 'approved' | 'rejected' | 'held'
  adminComment?: string
  changeType: ProposalChangeType
  /** architecture.md §6 target */
  targetProcedureJp: string
  /** architecture.md §6 diff */
  diff: {
    pathJp: string
    before: string[]
    after: string[]
  }
  /** architecture.md §6 impact_analysis */
  impactAnalysis: {
    affectedRunsLast30d: number
    preventableMissesCount: number
    relatedProcedures: string[]
    riskAssessment: string
  }
  sourceCorrectionIds: string[]
  reviewMode: 'individual' | 'batch'
}

export interface BatchProposal {
  id: string
  createdAt: string
  description: string
  items: Array<{
    procedureJp: string
    status: 'pending' | 'approved' | 'rejected' | 'deferred'
    confidence: number
    summary: string
  }>
}

export interface WeeklyMetric {
  week: number
  accuracy: number
}

export interface RepeatIssue {
  workflow: string
  description: string
  count: number
  total: number
  entries: { date: string; author: string; text: string }[]
  proposalStatus: string
}

// architecture.md §7: ガードレール
export interface Guardrail {
  id: string
  jpName: string
  description: string
  appliesToJp: string[]
  severity: GuardrailSeverity
  sourceKnowledgeIds: string[]
  proposalId?: string
  /** 発火回数（直近30日） */
  firedCount: number
  createdAt: string
}

// architecture.md §3, §10: 実行記録
export interface RunRecord {
  id: string
  yearMonth: string
  procedureJp: string
  procedureCategory: ProcedureCategory
  startedAt: string
  completedAt?: string
  status: 'completed' | 'sent_back' | 'failed' | 'in_progress'
  stepCount: number
  humanApprovals: number
  hasScreenshots: boolean
  hasFeedback: boolean
  approvedBy?: string
  apiCostJpy: number
  elapsedSec: number
}

// architecture.md §8: エージェント
export interface Agent {
  id: string
  jpName: string
  description: string
  assignedProceduresJp: string[]
  tools: string[]
  maxConcurrentRuns: number
  timeoutPerStepSec: number
  maxRetriesPerStep: number
  currentStatus: 'idle' | 'running' | 'escalated' | 'disabled'
  currentRunId?: string
  /** 直近30日の処理件数 */
  runsLast30d: number
  /** 直近30日の精度 */
  accuracyLast30d: number
}

// 学習メトリクス（週次）
export interface LearningMetric {
  week: number
  weekLabel: string
  correctionsIn: number
  knowledgeCompiled: number
  proposalsGenerated: number
  proposalsApproved: number
  humanApprovalsRequired: number
}

// コストメトリクス（月次）
export interface CostMetric {
  yearMonth: string
  totalApiCostJpy: number
  runsCount: number
  avgCostPerRunJpy: number
  estimatedSavingsJpy: number
  netBenefitJpy: number
}

// POCフェーズ
export interface POCPhase {
  phase: 1 | 2 | 3
  jpTitle: string
  subtitle: string
  status: 'completed' | 'in_progress' | 'upcoming'
  startedAt?: string
  completedAt?: string
  keyPoints: string[]
}
