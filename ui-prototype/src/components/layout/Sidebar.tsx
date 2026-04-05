import { NavLink } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  Home, FileText, BarChart3, ShieldCheck, Info, Cog, FolderCog,
  History, ShieldAlert, Bot,
} from 'lucide-react'

type NavEntry =
  | { type: 'link'; to: string; label: string; icon: typeof Home; roles: string[] }
  | { type: 'separator' }
  | { type: 'heading'; label: string }

const navItems: NavEntry[] = [
  { type: 'heading', label: 'プロジェクト' },
  { type: 'link', to: '/', label: '概要', icon: Info, roles: ['staff', 'manager'] },
  { type: 'link', to: '/how-it-works', label: '仕組み', icon: Cog, roles: ['staff', 'manager'] },
  { type: 'separator' },
  { type: 'heading', label: '日常業務' },
  { type: 'link', to: '/home', label: 'ホーム', icon: Home, roles: ['staff', 'manager'] },
  { type: 'separator' },
  { type: 'heading', label: '管理' },
  { type: 'link', to: '/proposals', label: '変更提案', icon: FileText, roles: ['manager'] },
  { type: 'link', to: '/learning', label: '学習状況', icon: BarChart3, roles: ['manager'] },
  { type: 'link', to: '/upgrade', label: '信頼レベル昇格', icon: ShieldCheck, roles: ['manager'] },
  { type: 'separator' },
  { type: 'heading', label: '監査・運用' },
  { type: 'link', to: '/runs', label: '実行履歴', icon: History, roles: ['manager'] },
  { type: 'link', to: '/guardrails', label: 'チェックルール', icon: ShieldAlert, roles: ['manager'] },
  { type: 'link', to: '/agents', label: 'AI エージェント', icon: Bot, roles: ['manager'] },
  { type: 'link', to: '/repository', label: 'データガバナンス', icon: FolderCog, roles: ['manager'] },
]

interface SidebarProps {
  onNavigate?: () => void
  variant?: 'default' | 'drawer'
}

export default function Sidebar({ onNavigate, variant = 'default' }: SidebarProps) {
  const { currentRole } = useApp()
  const visible = navItems.filter(n =>
    n.type !== 'link' || n.roles.includes(currentRole)
  )
  const isDrawer = variant === 'drawer'

  return (
    <aside className="w-[260px] shrink-0 border-r border-border/60 bg-sidebar min-h-screen h-full p-4 flex flex-col gap-1">
      <div className="flex items-center gap-2.5 px-3 py-4 mb-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[var(--primary-gradient-to)] flex items-center justify-center shadow-[var(--shadow-cta)]">
          <ShieldCheck className="h-4 w-4 text-white" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-sm tracking-tight">Backoffice AI</span>
          <span className="text-[10px] text-muted-foreground">AI 推進部</span>
        </div>
      </div>
      <nav className="flex flex-col gap-0.5">
        {visible.map((item, i) => {
          if (item.type === 'separator') {
            return <Separator key={`sep-${i}`} className="my-2" />
          }
          if (item.type === 'heading') {
            return (
              <p key={`head-${i}`} className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] px-3 mt-4 mb-1">
                {item.label}
              </p>
            )
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "relative flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-primary/5 text-primary font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      aria-hidden
                      className={cn(
                        "absolute top-1 bottom-1 w-[3px] rounded-r bg-gradient-to-b from-primary to-[var(--primary-gradient-to)]",
                        isDrawer ? "right-0 rounded-l rounded-r-none" : "left-0"
                      )}
                    />
                  )}
                  <item.icon className="h-[18px] w-[18px]" />
                  {item.label}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
