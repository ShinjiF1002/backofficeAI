import { useNavigate } from 'react-router-dom'
import type { Workflow } from '@/data/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

interface WorkflowTableProps {
  workflows: Workflow[]
}

const modeLabels: Record<string, string> = {
  'full-step': '全ステップ承認',
  'checkpoint': 'チェックポイント承認',
  'post-check': '事後確認',
}

const recommendationLabels: Record<string, string> = {
  'Ready to upgrade': '昇格可能',
  'Gathering data': 'データ収集中',
  '12 more cases needed': 'あと12件必要',
  'Improving': '改善中',
  'Stable': '安定稼働',
}

export default function WorkflowTable({ workflows }: WorkflowTableProps) {
  const navigate = useNavigate()

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">業務別</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>業務</TableHead>
              <TableHead className="text-right">正答率</TableHead>
              <TableHead className="text-right">件数</TableHead>
              <TableHead>モード</TableHead>
              <TableHead>状態</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflows.map(wf => {
              const isReady = wf.recommendation === 'Ready to upgrade'
              const label = recommendationLabels[wf.recommendation ?? ''] ?? wf.recommendation
              return (
                <TableRow key={wf.id}>
                  <TableCell className="font-medium">{wf.name}</TableCell>
                  <TableCell className="text-right">{wf.accuracy}%</TableCell>
                  <TableCell className="text-right">{wf.totalCases}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{modeLabels[wf.trustMode] ?? wf.trustMode}</Badge>
                  </TableCell>
                  <TableCell>
                    {isReady ? (
                      <Button size="sm" variant="default" onClick={() => navigate('/upgrade')}>
                        {label}
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">{label}</span>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
