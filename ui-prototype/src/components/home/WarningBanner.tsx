import { useNavigate } from "react-router-dom";
import type { RepeatIssue } from "@/data/types";
import { Alert, AlertDescription, AlertTitle, Button } from "crystalline-ui";
import { AlertTriangle } from "lucide-react";

interface WarningBannerProps {
  issue: RepeatIssue;
}

export default function WarningBanner({ issue }: WarningBannerProps) {
  const navigate = useNavigate();

  return (
    <Alert variant="warning">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="font-semibold">
        「{issue.workflow}」で同じミスが繰り返されています
      </AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          直近 {issue.total} 件中 {issue.count} 件が「{issue.description}
          」で差し戻し
        </p>
        <div className="space-y-1 text-sm">
          {issue.entries.map((entry, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-foreground font-medium font-mono text-xs">
                {entry.date}
              </span>
              <span className="text-foreground text-xs">{entry.author}:</span>
              <span className="text-muted-foreground">{entry.text}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm font-medium text-foreground">
            変更提案: {issue.proposalStatus}
          </p>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate("/proposals")}
          >
            変更提案を確認する →
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
