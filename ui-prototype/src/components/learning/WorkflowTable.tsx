import { useNavigate } from "react-router-dom";
import type { Workflow } from "@/data/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "crystalline-ui";
import { AlertTriangle } from "lucide-react";
import { TrustModeBadge } from "@/components/shared/TrustModeBadge";

interface WorkflowTableProps {
  workflows: Workflow[];
}

export default function WorkflowTable({ workflows }: WorkflowTableProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">業務別の精度と信頼レベル</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>業務</TableHead>
              <TableHead className="text-right">精度</TableHead>
              <TableHead className="text-right">件数</TableHead>
              <TableHead>モード</TableHead>
              <TableHead>状態</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflows.map((wf) => {
              const isReady = wf.recommendation.kind === "ready_to_upgrade";
              const isDemoted = wf.recommendation.kind === "demoted";
              return (
                <TableRow key={wf.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {wf.jpName}
                      {wf.driftDetected && (
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {wf.accuracy}%
                  </TableCell>
                  <TableCell className="text-right">{wf.totalCases}</TableCell>
                  <TableCell>
                    <TrustModeBadge mode={wf.trustMode} />
                  </TableCell>
                  <TableCell>
                    {isReady ? (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => navigate(`/upgrade?wf=${wf.id}`)}
                      >
                        {wf.recommendation.label}
                      </Button>
                    ) : isDemoted ? (
                      <Badge variant="destructive" className="text-xs">
                        {wf.recommendation.label}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {wf.recommendation.label}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
