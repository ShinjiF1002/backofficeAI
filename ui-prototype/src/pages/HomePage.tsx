import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Heading, Text, Num, FadeIn } from "crystalline-ui";
import KpiCards from "@/components/home/KpiCards";
import PendingQueue from "@/components/home/PendingQueue";
import RunningTasks from "@/components/home/RunningTasks";
import WarningBanner from "@/components/home/WarningBanner";
import LearningStrip from "@/components/shared/LearningStrip";
import RecentCorrectionsTimeline from "@/components/home/RecentCorrectionsTimeline";
import {
  repeatIssue,
  learningMetrics,
  weeklyMetrics,
  recentCorrections,
} from "@/data/mockData";

export default function HomePage() {
  const { tasks, currentUser } = useApp();
  const { hash } = useLocation();

  useEffect(() => {
    if (hash === "#pending") {
      const el = document.getElementById("pending");
      if (el) {
        requestAnimationFrame(() =>
          el.scrollIntoView({ behavior: "smooth", block: "start" }),
        );
      }
    }
  }, [hash]);

  const pending = tasks.filter((t) => t.status === "pending");
  const running = tasks.filter((t) => t.status === "running");
  const done = tasks.filter((t) => t.status === "done");

  const latestAccuracy = weeklyMetrics[weeklyMetrics.length - 1]?.accuracy ?? 0;
  const lastName = currentUser.name.split(" ")[0] ?? currentUser.name;

  return (
    <div className="space-y-6">
      <FadeIn>
        <header>
          <Heading as="h1">おはようございます、{lastName}さん</Heading>
          <Text muted size="sm" className="mt-1">
            <Num>2026年4月5日（金）</Num>
            <span className="mx-2 text-muted-foreground/40" aria-hidden>
              ·
            </span>
            承認待ちタスクと実行中の AI 業務を確認します
          </Text>
        </header>
      </FadeIn>

      <FadeIn index={1}>
        <LearningStrip metrics={learningMetrics} />
      </FadeIn>

      <KpiCards
        pending={pending.length}
        done={done.length}
        running={running.length}
        accuracy={latestAccuracy}
      />

      <FadeIn index={5}>
        <WarningBanner issue={repeatIssue} />
      </FadeIn>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6 min-w-0">
          <FadeIn index={6}>
            <PendingQueue tasks={pending} />
          </FadeIn>
          <FadeIn index={7}>
            <RunningTasks tasks={running} />
          </FadeIn>
        </div>
        <aside className="xl:col-span-1 xl:sticky xl:top-20 xl:self-start min-w-0">
          <FadeIn index={8}>
            <RecentCorrectionsTimeline corrections={recentCorrections} />
          </FadeIn>
        </aside>
      </div>
    </div>
  );
}
