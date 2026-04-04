import type {
  User, Task, Workflow, Comment, Knowledge,
  Proposal, WeeklyMetric, RepeatIssue,
} from './types'

// ── Users ──
export const users: User[] = [
  { id: 'u1', name: 'Taro Tanaka', team: 'Finance', role: 'staff' },
  { id: 'u2', name: 'Yuki Sato', team: 'Finance', role: 'staff' },
  { id: 'u3', name: 'Kenji Yamada', team: 'Finance', role: 'manager' },
]

// ── Workflows ──
export const workflows: Workflow[] = [
  { id: 'wf1', name: 'Tx domestic', confidence: 'high', trustMode: 'full-step', accuracy: 96.8, totalCases: 124, stepCount: 5, recommendation: 'Ready to upgrade' },
  { id: 'wf2', name: 'Tx overseas', confidence: 'medium', trustMode: 'full-step', accuracy: 91.7, totalCases: 12, stepCount: 5, recommendation: 'Gathering data' },
  { id: 'wf3', name: 'Acct person', confidence: 'high', trustMode: 'full-step', accuracy: 93.5, totalCases: 62, stepCount: 4, recommendation: '12 more cases needed' },
  { id: 'wf4', name: 'Acct corp', confidence: 'medium', trustMode: 'full-step', accuracy: 88.2, totalCases: 28, stepCount: 4, recommendation: 'Improving' },
  { id: 'wf5', name: 'Invoice approval', confidence: 'high', trustMode: 'checkpoint', accuracy: 97.1, totalCases: 58, stepCount: 5, recommendation: 'Stable' },
]

// ── Tasks ──
export const initialTasks: Task[] = [
  // Pending tasks
  {
    id: 'TX-0158',
    workflowId: 'wf1',
    workflowName: 'Tx domestic',
    status: 'pending',
    currentStepNum: 3,
    timestamp: '09:12',
    aiJudgment: 'Amount matches request document. Applied round-down rule for sub-yen fractions.',
    reusedKnowledge: ['Round down rule for sub-yen fractions', 'Check all PDF pages before confirming amount'],
    pastApproved: 28,
    pastSentBack: 2,
    steps: [
      { stepNum: 1, name: 'Req check', approvalRequired: true, status: 'completed', checks: [] },
      { stepNum: 2, name: 'Account match', approvalRequired: true, status: 'completed', checks: [] },
      {
        stepNum: 3, name: 'Amount check', approvalRequired: true, status: 'current',
        checks: [
          { name: 'Amount match', status: 'ok' },
          { name: 'Dup check', status: 'ok' },
          { name: 'Limit check', status: 'ok' },
        ],
      },
      { stepNum: 4, name: 'Execute', approvalRequired: true, status: 'upcoming', checks: [] },
      { stepNum: 5, name: 'Done', approvalRequired: true, status: 'upcoming', checks: [] },
    ],
  },
  {
    id: 'ACC-0042',
    workflowId: 'wf3',
    workflowName: 'Acct person',
    status: 'pending',
    currentStepNum: 2,
    timestamp: '09:08',
    aiJudgment: 'ID document verified. Photo matches applicant record.',
    pastApproved: 15,
    pastSentBack: 1,
    steps: [
      { stepNum: 1, name: 'Form read', approvalRequired: true, status: 'completed', checks: [] },
      {
        stepNum: 2, name: 'ID docs', approvalRequired: true, status: 'current',
        checks: [
          { name: 'ID format', status: 'ok' },
          { name: 'Expiry check', status: 'ok' },
        ],
      },
      { stepNum: 3, name: 'KYC check', approvalRequired: true, status: 'upcoming', checks: [] },
      { stepNum: 4, name: 'Open', approvalRequired: true, status: 'upcoming', checks: [] },
    ],
  },
  {
    id: 'INV-0091',
    workflowId: 'wf5',
    workflowName: 'Invoice approval',
    status: 'pending',
    currentStepNum: 5,
    timestamp: '08:55',
    aiJudgment: 'Invoice totals match PO. All line items verified.',
    pastApproved: 22,
    pastSentBack: 0,
    steps: [
      { stepNum: 1, name: 'PO match', approvalRequired: false, status: 'completed', checks: [] },
      { stepNum: 2, name: 'Line items', approvalRequired: false, status: 'completed', checks: [] },
      { stepNum: 3, name: 'Tax calc', approvalRequired: true, status: 'completed', checks: [] },
      { stepNum: 4, name: 'Budget check', approvalRequired: false, status: 'completed', checks: [] },
      {
        stepNum: 5, name: 'Final approval', approvalRequired: true, status: 'current',
        checks: [
          { name: 'Amount match', status: 'ok' },
          { name: 'Budget limit', status: 'ok' },
          { name: 'Vendor check', status: 'ok' },
        ],
      },
    ],
  },
  // Check-failed task
  {
    id: 'TX-0162',
    workflowId: 'wf1',
    workflowName: 'Tx domestic',
    status: 'pending',
    currentStepNum: 3,
    timestamp: '09:25',
    aiJudgment: 'Amount mismatch found. Waiting for human review.',
    pastApproved: 28,
    pastSentBack: 2,
    steps: [
      { stepNum: 1, name: 'Req check', approvalRequired: true, status: 'completed', checks: [] },
      { stepNum: 2, name: 'Account match', approvalRequired: true, status: 'completed', checks: [] },
      {
        stepNum: 3, name: 'Amount check', approvalRequired: true, status: 'current',
        checks: [
          { name: 'Dup check', status: 'ok' },
          { name: 'Limit check', status: 'ok' },
          { name: 'Amount match', status: 'ng', delta: 100000 },
        ],
      },
      { stepNum: 4, name: 'Execute', approvalRequired: true, status: 'upcoming', checks: [] },
      { stepNum: 5, name: 'Done', approvalRequired: true, status: 'upcoming', checks: [] },
    ],
  },
  // Running tasks
  {
    id: 'TX-0159',
    workflowId: 'wf1',
    workflowName: 'Tx domestic',
    status: 'running',
    currentStepNum: 2,
    timestamp: '09:18',
    steps: [
      { stepNum: 1, name: 'Req check', approvalRequired: true, status: 'completed', checks: [] },
      { stepNum: 2, name: 'Account match', approvalRequired: true, status: 'current', checks: [] },
      { stepNum: 3, name: 'Amount check', approvalRequired: true, status: 'upcoming', checks: [] },
      { stepNum: 4, name: 'Execute', approvalRequired: true, status: 'upcoming', checks: [] },
      { stepNum: 5, name: 'Done', approvalRequired: true, status: 'upcoming', checks: [] },
    ],
  },
  {
    id: 'ACC-0043',
    workflowId: 'wf3',
    workflowName: 'Acct person',
    status: 'running',
    currentStepNum: 1,
    timestamp: '09:20',
    steps: [
      { stepNum: 1, name: 'Form read', approvalRequired: true, status: 'current', checks: [] },
      { stepNum: 2, name: 'ID docs', approvalRequired: true, status: 'upcoming', checks: [] },
      { stepNum: 3, name: 'KYC check', approvalRequired: true, status: 'upcoming', checks: [] },
      { stepNum: 4, name: 'Open', approvalRequired: true, status: 'upcoming', checks: [] },
    ],
  },
  {
    id: 'TX-0160',
    workflowId: 'wf2',
    workflowName: 'Tx overseas',
    status: 'running',
    currentStepNum: 0,
    timestamp: '09:22',
    steps: [
      { stepNum: 1, name: 'Req check', approvalRequired: true, status: 'upcoming', checks: [] },
      { stepNum: 2, name: 'Account match', approvalRequired: true, status: 'upcoming', checks: [] },
      { stepNum: 3, name: 'Compliance', approvalRequired: true, status: 'upcoming', checks: [] },
      { stepNum: 4, name: 'FX rate', approvalRequired: true, status: 'upcoming', checks: [] },
      { stepNum: 5, name: 'Done', approvalRequired: true, status: 'upcoming', checks: [] },
    ],
  },
  // Done tasks
  {
    id: 'TX-0155',
    workflowId: 'wf1',
    workflowName: 'Tx domestic',
    status: 'done',
    currentStepNum: 5,
    timestamp: '08:30',
    steps: [],
  },
  {
    id: 'INV-0089',
    workflowId: 'wf5',
    workflowName: 'Invoice approval',
    status: 'done',
    currentStepNum: 5,
    timestamp: '08:15',
    steps: [],
  },
]

// ── Comments (past corrections) ──
export const comments: Comment[] = [
  { id: 'c1', author: 'Yuki Sato', date: '04/02', text: 'Representative ID is required for corporate accounts', taskId: 'ACC-0038', stepName: 'ID docs' },
  { id: 'c2', author: 'Taro Tanaka', date: '04/03', text: 'Attached representative ID was ignored', taskId: 'ACC-0039', stepName: 'ID docs' },
  { id: 'c3', author: 'Yuki Sato', date: '04/04', text: 'Same issue again — rep ID not checked', taskId: 'ACC-0041', stepName: 'ID docs' },
  { id: 'c4', author: 'Taro Tanaka', date: '03/28', text: 'PDF has 2 pages; page 2 was skipped', taskId: 'TX-0140', stepName: 'Amount check' },
]

// ── Knowledge ──
export const knowledgeItems: Knowledge[] = [
  { id: 'k1', text: 'Round down rule for sub-yen fractions', sourceCount: 3, usageCount: 12 },
  { id: 'k2', text: 'Check all PDF pages before confirming amount', sourceCount: 2, usageCount: 8 },
  { id: 'k3', text: 'Half-width kana is acceptable in name fields', sourceCount: 1, usageCount: 5 },
]

// ── Proposals ──
export const proposals: Proposal[] = [
  {
    id: '1',
    what: 'Add "check all pages if file is PDF" step',
    why: '3 misses in last 30 days where second PDF page was skipped',
    scopeWorkflows: ['Tx domestic', 'Invoice approval'],
    scopeCaseCount: 47,
    riskLevel: 'low',
    voices: [
      { author: 'Yuki Sato', date: '03/28', text: 'PDF has 2 pages; page 2 was skipped' },
      { author: 'Taro Tanaka', date: '03/31', text: 'Same PDF issue — only first page read' },
      { author: 'Yuki Sato', date: '04/02', text: 'Third time PDF page skipped' },
    ],
    status: 'open',
  },
  {
    id: '2',
    what: 'Add representative ID verification for corporate accounts',
    why: '3 of last 5 corporate account cases sent back for missing rep ID',
    scopeWorkflows: ['Acct corp'],
    scopeCaseCount: 28,
    riskLevel: 'medium',
    voices: [
      { author: 'Yuki Sato', date: '04/02', text: 'Representative ID is required' },
      { author: 'Taro Tanaka', date: '04/03', text: 'Attached rep ID was ignored' },
      { author: 'Yuki Sato', date: '04/04', text: 'Same issue again' },
    ],
    status: 'open',
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

// ── Repeat issue warning ──
export const repeatIssue: RepeatIssue = {
  workflow: 'Acct corp',
  description: 'Representative ID check',
  count: 3,
  total: 5,
  entries: [
    { date: '04/02', author: 'Yuki Sato', text: 'Rep ID is required' },
    { date: '04/03', author: 'Taro Tanaka', text: 'Attached rep ID was ignored' },
    { date: '04/04', author: 'Yuki Sato', text: 'Same issue again' },
  ],
  proposalStatus: '手順変更の提案を作成中',
}

// ── Similar notes for comment screen ──
export const similarNotes = [
  { text: '確認前にPDFの全ページを確認すること', matchScore: 0.92 },
  { text: '端数は切り上げではなく切り捨てを使用', matchScore: 0.78 },
]

// ── Phase 2: Learning Status ──
export const learningSummary = {
  total: 284,
  accuracy: 94.2,
  knowledge: 23,
}

export const commentImpact = {
  totalComments: 11,
  learned: 9,
  proposalsGenerated: 2,
  proposalsApproved: 1,
  example: 'カナ正規化 → 同種ミスが再発しなくなった',
}

// ── Phase 2: Upgrade Target ──
export const upgradeTarget = {
  workflowId: 'wf1',
  workflowName: 'Tx domestic',
  currentMode: 'full-step' as const,
  nextMode: 'checkpoint' as const,
  currentApprovals: 5,
  nextApprovals: 2,
  steps: [
    { name: 'Req check', current: 'human' as const, next: 'ai' as const },
    { name: 'Account match', current: 'human' as const, next: 'ai' as const },
    { name: 'Amount check', current: 'human' as const, next: 'human' as const },
    { name: 'Execute', current: 'human' as const, next: 'ai' as const },
    { name: 'Done', current: 'human' as const, next: 'human' as const },
  ],
  reason: {
    cleanRuns: 50,
    accuracy: 96.8,
    sendBacksLearned: 4,
  },
  safety: '正答率が90%を下回った場合、自動的に全ステップ承認モードに戻ります',
}
