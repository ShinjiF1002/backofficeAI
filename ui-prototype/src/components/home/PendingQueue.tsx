import { useNavigate } from 'react-router-dom'
import type { Task } from '@/data/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

interface PendingQueueProps {
  tasks: Task[]
}

export default function PendingQueue({ tasks }: PendingQueueProps) {
  const navigate = useNavigate()

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">承認待ちキュー</CardTitle>
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
                <TableHead>現在のステップ</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map(task => {
                const currentStep = task.steps.find(s => s.status === 'current')
                return (
                  <TableRow key={task.id}>
                    <TableCell className="text-muted-foreground">{task.timestamp}</TableCell>
                    <TableCell className="font-medium">{task.id}</TableCell>
                    <TableCell>{currentStep?.name ?? '—'}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => navigate(`/tasks/${task.id}`)}>
                        開く
                      </Button>
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
