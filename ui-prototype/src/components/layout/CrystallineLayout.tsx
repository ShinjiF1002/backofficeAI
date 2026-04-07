import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import {
  AppShell,
  useAppShell,
  Sidebar,
  NavHeader,
  BottomNav,
  Button,
  Avatar,
  AvatarFallback,
} from "crystalline-ui";
import type { SidebarEntry, BottomNavEntry } from "crystalline-ui";
import {
  Home,
  FileText,
  BarChart3,
  ShieldCheck,
  Info,
  Cog,
  FolderCog,
  History,
  ShieldAlert,
  Bot,
  Menu,
  Bell,
  ClipboardCheck,
} from "lucide-react";

// --- Sidebar navigation items ---

const allNavItems: (SidebarEntry & { roles?: string[] })[] = [
  { type: "heading", label: "プロジェクト" },
  { type: "link", label: "概要", icon: Info, roles: ["staff", "manager"] },
  { type: "link", label: "仕組み", icon: Cog, roles: ["staff", "manager"] },
  { type: "separator" },
  { type: "heading", label: "日常業務" },
  { type: "link", label: "ホーム", icon: Home, roles: ["staff", "manager"] },
  { type: "separator" },
  { type: "heading", label: "管理" },
  { type: "link", label: "変更提案", icon: FileText, roles: ["manager"] },
  { type: "link", label: "学習状況", icon: BarChart3, roles: ["manager"] },
  {
    type: "link",
    label: "信頼レベル昇格",
    icon: ShieldCheck,
    roles: ["manager"],
  },
  { type: "separator" },
  { type: "heading", label: "監査・運用" },
  { type: "link", label: "実行履歴", icon: History, roles: ["manager"] },
  {
    type: "link",
    label: "チェックルール",
    icon: ShieldAlert,
    roles: ["manager"],
  },
  { type: "link", label: "AI エージェント", icon: Bot, roles: ["manager"] },
  {
    type: "link",
    label: "データガバナンス",
    icon: FolderCog,
    roles: ["manager"],
  },
];

// Route mapping for sidebar link items
const labelToRoute: Record<string, string> = {
  概要: "/",
  仕組み: "/how-it-works",
  ホーム: "/home",
  変更提案: "/proposals",
  学習状況: "/learning",
  信頼レベル昇格: "/upgrade",
  実行履歴: "/runs",
  チェックルール: "/guardrails",
  "AI エージェント": "/agents",
  データガバナンス: "/repository",
};

// --- BottomNav items ---

const bottomNavItems: BottomNavEntry[] = [
  { type: "link", label: "ホーム", icon: Home },
  { type: "link", label: "承認待ち", icon: ClipboardCheck },
  { type: "link", label: "変更提案", icon: FileText },
  { type: "link", label: "学習", icon: BarChart3 },
  { type: "action", label: "メニュー", icon: Menu },
];

// --- Header component (needs useAppShell context) ---

function CrystallineHeader() {
  const { openDrawer } = useAppShell();
  const { currentUser, tasks } = useApp();
  const navigate = useNavigate();
  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const hasNotifications = pendingCount > 0;

  return (
    <NavHeader
      leading={
        <Button
          variant="ghost"
          size="icon"
          onClick={openDrawer}
          className="md:hidden"
          aria-label="メニューを開く"
        >
          <Menu className="h-5 w-5" />
        </Button>
      }
      trailing={
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={
              hasNotifications ? `通知 (承認待ち ${pendingCount} 件)` : "通知"
            }
            onClick={() => navigate("/home#pending")}
          >
            <Bell className="h-[18px] w-[18px]" />
            {hasNotifications && (
              <span
                aria-hidden
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger border border-background"
              />
            )}
          </Button>
          <div className="h-6 w-[1px] bg-border shrink-0" aria-hidden />
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-sm font-semibold truncate hidden sm:inline leading-none">
              {currentUser.name}
            </span>
            <Avatar className="size-9 ring-2 ring-background shrink-0">
              <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      }
    />
  );
}

// --- BottomNav component (needs route context) ---

function CrystallineBottomNav() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const { openDrawer } = useAppShell();

  const items: BottomNavEntry[] = bottomNavItems.map((item) => {
    if (item.type === "action") {
      return { ...item, onClick: openDrawer };
    }
    // Determine active state
    let active = false;
    if (item.label === "ホーム") {
      active = pathname === "/home" && hash !== "#pending";
    } else if (item.label === "承認待ち") {
      active = pathname === "/home" && hash === "#pending";
    } else if (item.label === "変更提案") {
      active = pathname.startsWith("/proposals");
    } else if (item.label === "学習") {
      active = pathname.startsWith("/learning");
    }

    return {
      ...item,
      active,
      onClick: () => {
        const routes: Record<string, string> = {
          ホーム: "/home",
          承認待ち: "/home#pending",
          変更提案: "/proposals",
          学習: "/learning",
        };
        const to = routes[item.label] ?? "/home";
        navigate(to);
        if (to.includes("#")) {
          requestAnimationFrame(() => {
            const target = document.getElementById("pending");
            target?.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }
      },
    };
  });

  return <BottomNav items={items} />;
}

// --- Main layout ---

export default function CrystallineLayout() {
  const { pathname } = useLocation();
  const hideBottomNav = pathname.startsWith("/tasks/");

  // Sidebar needs onClick handlers for navigation
  // We use a wrapper that intercepts Sidebar's onNavigate
  return (
    <AppShell
      sidebar={<SidebarWithNavigation />}
      header={<CrystallineHeader />}
      bottomNav={<CrystallineBottomNav />}
      hideBottomNav={hideBottomNav}
    >
      <Outlet />
    </AppShell>
  );
}

// Sidebar with navigation integration
function SidebarWithNavigation() {
  const navigate = useNavigate();
  const { currentRole } = useApp();
  const { pathname } = useLocation();
  const { closeDrawer } = useAppShell();

  const filteredItems: SidebarEntry[] = allNavItems
    .filter(
      (item) =>
        item.type !== "link" || !item.roles || item.roles.includes(currentRole),
    )
    .map((item) => {
      if (item.type !== "link") return item;
      const route = labelToRoute[item.label] ?? "/";
      const isActive =
        route === "/" ? pathname === "/" : pathname.startsWith(route);
      return {
        ...item,
        active: isActive,
        onClick: () => {
          navigate(route);
        },
      };
    });

  return (
    <Sidebar
      items={filteredItems}
      onNavigate={closeDrawer}
      header={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[var(--primary-gradient-to)] flex items-center justify-center shadow-[var(--shadow-cta)]">
            <ShieldCheck className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-sm">Backoffice AI</span>
        </div>
      }
    />
  );
}
