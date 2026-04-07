import type { Task, ProcedureCategory } from "@/data/types";
import { Card, CardContent, CardHeader } from "crystalline-ui";
import CategoryIcon from "@/components/shared/CategoryIcon";
import {
  Send,
  UserPlus,
  Receipt,
  CreditCard,
  Wallet,
  Building,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface RunningTasksProps {
  tasks: Task[];
}

const bgIconMap: Record<ProcedureCategory, LucideIcon> = {
  transfer: Send,
  account: UserPlus,
  invoice: Receipt,
  payment: CreditCard,
  expense: Wallet,
  vendor: Building,
};

export default function RunningTasks({ tasks }: RunningTasksProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <span aria-hidden className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-60 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
          </span>
          <h2 className="text-base font-semibold leading-[1.4]">実行中</h2>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          AI が現在処理中の業務
        </p>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            実行中の案件はありません
          </p>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => {
              const currentStep = task.steps.find(
                (s) => s.status === "current",
              );
              const total = task.steps.length;
              const completedCount = task.steps.filter(
                (s) => s.status === "completed",
              ).length;
              const progressPct =
                total > 0 ? (completedCount / total) * 100 : 0;
              const isPending = task.currentStepNum === 0;
              const primaryData = task.keyData[0];
              const BgIcon = bgIconMap[task.category];

              return (
                <div
                  key={task.id}
                  className="relative flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-card shadow-[var(--shadow-crystal-sm)] overflow-hidden"
                >
                  <BgIcon
                    aria-hidden
                    className="absolute -right-4 -bottom-4 size-24 text-slate-100 opacity-60 pointer-events-none -rotate-12 select-none"
                  />
                  <CategoryIcon category={task.category} size="md" />
                  <div className="relative flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-semibold truncate">
                        {task.workflowName}
                      </span>
                      <span className="text-[11px] font-semibold tabular-nums shrink-0 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full px-2 py-0.5">
                        {isPending
                          ? "開始待ち"
                          : `${completedCount}/${total} ステップ`}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mb-1">
                      <div
                        className="h-full rounded-full progress-shimmer-bar transition-all"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate leading-[1.4]">
                      {primaryData ? `${primaryData.value} · ` : ""}
                      {currentStep?.name ?? "待機中"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
