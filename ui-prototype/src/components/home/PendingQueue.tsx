import { useNavigate } from 'react-router-dom'
import type { Task } from '@/data/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { ChevronRight } from 'lucide-react'

interface PendingQueueProps {
  tasks: Task[]
}

export default function PendingQueue({ tasks }: PendingQueueProps) {
  const navigate = useNavigate()

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">承認待ちキュー</CardTitle>
        <p className="text-xs text-muted-foreground">AIの実行結果を確認し、承認または差し戻しを行ってください。</p>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">承認待ちの案件はありません</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">時刻</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>業務</TableHead>
                <TableHead>現在のステップ</TableHead>
                <TableHead className="w-12 text-center">状態</TableHead>
                <TableHead className="w-6" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map(task => {
                const currentStep = task.steps.find(s => s.status === 'current')
                const hasFailedCheck = currentStep?.checks.some(c => c.status === 'ng') ?? false
                return (
                  <TableRow
                    key={task.id}
                    onClick={() => navigate(`/tasks/${task.id}`)}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="text-muted-foreground">{task.timestamp}</TableCell>
                    <TableCell className="font-medium">{task.id}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{task.workflowName}</TableCell>
                    <TableCell>{currentStep?.name ?? '—'}</TableCell>
                    <TableCell className="text-center">
                      {hasFailedCheck ? (
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500" title="チェック失敗" />
                      ) : (
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" title="チェック通過" />
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <ChevronRight className="h-4 w-4" />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
