import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import AiJudgmentDisplay from '@/components/comment/AiJudgmentDisplay'
import CommentForm from '@/components/comment/CommentForm'
import SimilarNote from '@/components/comment/SimilarNote'
import { Button } from '@/components/ui/button'
import { similarNotes } from '@/data/mockData'

export default function CommentPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { tasks, sendBackTask } = useApp()
  const [commentText, setCommentText] = useState('')

  const task = tasks.find(t => t.id === id)
  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">案件が見つかりません: {id}</p>
        <Button variant="outline" onClick={() => navigate('/')}>ホームに戻る</Button>
      </div>
    )
  }

  const handleQuote = (text: string) => {
    setCommentText(prev => prev ? `${prev}\n${text}` : text)
  }

  const handleSubmit = () => {
    sendBackTask(task.id)
    navigate('/')
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/tasks/${task.id}`)}>← 戻る</Button>
        <h1 className="text-2xl font-semibold tracking-tight">修正コメント</h1>
      </div>

      <AiJudgmentDisplay judgment={task.aiJudgment ?? '判断記録なし'} />

      <CommentForm
        value={commentText}
        onChange={setCommentText}
      />

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">過去の類似コメント</h3>
        {similarNotes.map((note, i) => (
          <SimilarNote key={i} text={note.text} onQuote={handleQuote} />
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={handleSubmit} disabled={!commentText.trim()}>
          送信して続行
        </Button>
        <Button variant="outline" onClick={() => navigate(`/tasks/${task.id}`)}>
          キャンセル
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        送信後: AIがこのフィードバックを学習します。類似の問題が検出された場合、変更提案が自動生成されることがあります。
      </p>
    </div>
  )
}
