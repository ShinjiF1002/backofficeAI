export type Role = 'staff' | 'manager'

export interface User {
  id: string
  name: string
  team: string
  role: Role
}

export type TaskStatus = 'pending' | 'running' | 'done'
export type CheckStatus = 'ok' | 'ng'
export type TrustMode = 'full-step' | 'checkpoint' | 'post-check'

export interface Check {
  name: string
  status: CheckStatus
  delta?: number
}

export interface Step {
  stepNum: number
  name: string
  approvalRequired: boolean
  status: 'completed' | 'current' | 'upcoming'
  checks: Check[]
}

export interface Task {
  id: string
  workflowId: string
  workflowName: string
  status: TaskStatus
  currentStepNum: number
  steps: Step[]
  timestamp: string
  aiJudgment?: string
  reusedKnowledge?: string[]
  pastApproved?: number
  pastSentBack?: number
}

export interface Workflow {
  id: string
  name: string
  confidence: 'high' | 'medium'
  trustMode: TrustMode
  accuracy: number
  totalCases: number
  stepCount: number
  recommendation?: string
}

export interface Comment {
  id: string
  author: string
  date: string
  text: string
  taskId: string
  stepName: string
}

export interface Knowledge {
  id: string
  text: string
  sourceCount: number
  usageCount: number
}

export interface Proposal {
  id: string
  what: string
  why: string
  scopeWorkflows: string[]
  scopeCaseCount: number
  riskLevel: 'low' | 'medium' | 'high'
  voices: { author: string; date: string; text: string }[]
  status: 'open' | 'approved' | 'rejected' | 'held'
  adminComment?: string
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
