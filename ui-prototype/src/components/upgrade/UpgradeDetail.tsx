import { Card, CardContent, CardHeader, CardTitle } from "crystalline-ui";
import { ShieldCheck, TrendingUp, AlertTriangle } from "lucide-react";

interface UpgradeDetailProps {
  workflowName: string;
  reason: {
    cleanRuns: number;
    accuracy: number;
    sendBacksLearned: number;
  };
  safety: string;
  keepHuman: string[];
  autoRun: string[];
}

export default function UpgradeDetail({
  reason,
  safety,
  keepHuman,
  autoRun,
}: UpgradeDetailProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            昇格の根拠
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">連続正常処理</span>
            <span className="font-medium">{reason.cleanRuns} 件</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">正答率</span>
            <span className="font-medium">{reason.accuracy}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">差し戻し学習済</span>
            <span className="font-medium">{reason.sendBacksLearned} 件</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            ステップ割り当て
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">人間承認を維持:</p>
            <p className="font-medium">{keepHuman.join(", ")}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">AI自動実行:</p>
            <p className="font-medium">{autoRun.join(", ")}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardContent className="py-3 flex items-center gap-2 text-sm">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          <span className="text-muted-foreground font-medium">安全装置:</span>
          <span>{safety}</span>
        </CardContent>
      </Card>
    </div>
  );
}
