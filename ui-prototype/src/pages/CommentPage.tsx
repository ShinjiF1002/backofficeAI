import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import {
  Card, CardContent, CardHeader, CardTitle,
  Button, Input, Textarea, Badge, Heading, Text, FadeIn,
  RadioCardGroup,
  Breadcrumb, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbPage,
} from 'crystalline-ui'
import CategoryIcon from '@/components/shared/CategoryIcon'
import {
  type ErrorCategory,
  errorCategoryLabels,
  errorCategoryDescriptions,
  errorCategoryRouting,
} from '@/data/types'
import { Bot, Lightbulb, GitPullRequest, FileText, ChevronRight } from 'lucide-react'

const categoryOptions = (
  ['misunderstanding', 'ui_change', 'edge_case', 'judgment_gap', 'data_error'] as ErrorCategory[]
).map(cat => ({
  value: cat,
  label: errorCategoryLabels[cat],
  description: errorCategoryDescriptions[cat],
}))

const scopeOptions = [
  { value: 'one_off', label: 'この 1 件のみの問題', description: 'ルール化は不要、記録のみ残す' },
  { value: 'rule_change', label: 'ルール化すべき問題', description: '今後の同種ミスを防ぐ' },
]

export default function CommentPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { tasks, sendBackTask } = useApp()
  const [commentText, setCommentText] = useState('')
  const [errorCategory, setErrorCategory] = useState<ErrorCategory | null>(null)
  const [before, setBefore] = useState('')
  const [after, setAfter] = useState('')
  const [ruleScope, setRuleScope] = useState<'one_off' | 'rule_change'>('rule_change')

  const task = tasks.find(t => t.id === id)
  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">案件が見つかりません: {id}</p>
        <Button variant="secondary" onClick={() => navigate('/home')}>ホームに戻る</Button>
      </div>
    )
  }

  const currentStep = task.steps.find(s => s.status === 'current')

  const handleSubmit = () => {
    sendBackTask(task.id)
    navigate('/home')
  }

  const routing = errorCategory ? errorCategoryRouting[errorCategory] : null
  const canSubmit = commentText.trim().length > 0 && errorCategory !== null

  return (
    <div className="space-y-6 max-w-3xl pb-8">
      <FadeIn>
        <Breadcrumb>
          <BreadcrumbItem onClick={() => navigate('/home')}>ホーム</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem onClick={() => navigate(`/tasks/${task.id}`)}>
            {task.workflowName} {task.id}
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>修正コメント</BreadcrumbPage>
        </Breadcrumb>
      </FadeIn>

      <FadeIn index={1}>
        <Heading as="h2">修正コメント</Heading>
        <Text muted size="sm">
          AI の判断に誤りがあった箇所と、正しい操作を記録してください。このコメントはナレッジとして蓄積されます。
        </Text>
      </FadeIn>

      <FadeIn index={2}>
        <Card className="bg-muted/30">
          <CardContent className="pt-3 pb-3">
            <div className="flex items-center gap-3">
              <CategoryIcon category={task.category} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{task.workflowName} · {currentStep?.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {task.keyData[0]?.value}
                  {task.keyData[1] && ` / ${task.keyData[1].value}`}
                </p>
              </div>
            </div>
            {task.aiJudgment && (
              <div className="mt-3 pt-3 border-t flex items-start gap-2">
                <Bot className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground italic">{task.aiJudgment}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn index={3}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">何が問題でしたか？</CardTitle>
            <p className="text-xs text-muted-foreground">カテゴリを選択してください（必須）</p>
          </CardHeader>
          <CardContent>
            <RadioCardGroup
              options={categoryOptions}
              value={errorCategory ?? undefined}
              onValueChange={(v) => setErrorCategory(v as ErrorCategory)}
              columns={2}
              aria-label="エラー分類"
            />
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn index={4}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">詳細コメント</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="何が間違っていたか、正しい操作は何かを記入してください..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">修正前の値（任意）</label>
                <Input
                  placeholder="例: ¥50,000（四捨五入）"
                  value={before}
                  onChange={e => setBefore(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">修正後の値（任意）</label>
                <Input
                  placeholder="例: ¥55,000（切り捨て）"
                  value={after}
                  onChange={e => setAfter(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn index={5}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">このコメントの扱い</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioCardGroup
              options={scopeOptions}
              value={ruleScope}
              onValueChange={(v) => setRuleScope(v as 'one_off' | 'rule_change')}
              columns={2}
              aria-label="コメントの扱い"
            />
          </CardContent>
        </Card>
      </FadeIn>

      {errorCategory && (
        <FadeIn index={6}>
          <Card variant="tinted">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                このコメントが学習につながる流れ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <Badge variant="outline" className="text-[10px]">分類: {errorCategoryLabels[errorCategory]}</Badge>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                {routing === 'tier1' && (
                  <>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-teal-200 bg-teal-50 text-teal-700 text-[11px] font-semibold shrink-0">
                      <Lightbulb className="h-3 w-3" /> ナレッジへ追加（即時反映）
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-2 w-full leading-[1.4]">
                      AI の文脈情報として即座に全エージェントに共有されます。手順自体は変更されません。
                    </p>
                  </>
                )}
                {routing === 'tier2' && (
                  <>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-violet-200 bg-violet-50 text-violet-700 text-[11px] font-semibold shrink-0">
                      <GitPullRequest className="h-3 w-3" /> 提案を自動生成（管理者レビュー待ち）
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-2 w-full leading-[1.4]">
                      同種のコメントが 2 件以上集まると、手順変更の提案として管理者レビューに回ります。
                    </p>
                  </>
                )}
                {routing === 'log_only' && (
                  <>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 text-[11px] font-semibold shrink-0">
                      <FileText className="h-3 w-3" /> 実行ログに記録のみ
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-2 w-full leading-[1.4]">
                      入力データの問題は AI の責任ではないため、記録のみ残します。
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      <div className="flex flex-wrap gap-2 sm:gap-3 pt-2">
        <Button variant="primary" size="cta" onClick={handleSubmit} disabled={!canSubmit}>
          送信して続行
        </Button>
        <Button variant="secondary" size="tap" onClick={() => navigate(`/tasks/${task.id}`)}>
          キャンセル
        </Button>
        {!canSubmit && (
          <p className="text-xs text-muted-foreground self-center">
            カテゴリとコメント内容を入力してください
          </p>
        )}
      </div>
    </div>
  )
}
