import { NavLink } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Separator } from '@/components/ui/separator'
import { Home, ClipboardCheck, FileText, BarChart3, ShieldCheck, Info, Cog, FolderTree } from 'lucide-react'

type NavEntry =
  | { type: 'link'; to: string; label: string; icon: typeof Home; roles: string[] }
  | { type: 'separator' }

const navItems: NavEntry[] = [
  { type: 'link', to: '/overview', label: '概要', icon: Info, roles: ['staff', 'manager'] },
  { type: 'link', to: '/how-it-works', label: 'How it works', icon: Cog, roles: ['staff', 'manager'] },
  { type: 'link', to: '/repository', label: 'リポジトリ構成', icon: FolderTree, roles: ['staff', 'manager'] },
  { type: 'separator' },
  { type: 'link', to: '/', label: 'ホーム', icon: Home, roles: ['staff', 'manager'] },
  { type: 'link', to: '/proposals', label: '変更提案', icon: FileText, roles: ['manager'] },
  { type: 'link', to: '/learning', label: '学習状況', icon: BarChart3, roles: ['manager'] },
  { type: 'link', to: '/upgrade', label: '信頼レベル昇格', icon: ShieldCheck, roles: ['manager'] },
]

interface SidebarProps {
  onNavigate?: () => void
}

export default function Sidebar({ onNavigate }: SidebarProps = {}) {
  const { currentRole } = useApp()
  const visible = navItems.filter(n =>
    n.type === 'separator' || (n.type === 'link' && n.roles.includes(currentRole))
  )

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-sidebar min-h-screen h-full p-4 flex flex-col gap-1">
      <div className="flex items-center gap-2 px-3 py-4 mb-4">
        <ClipboardCheck className="h-6 w-6 text-primary" />
        <span className="font-semibold text-sm tracking-tight">Backoffice AI</span>
      </div>
      <nav className="flex flex-col gap-1">
        {visible.map((item, i) => {
          if (item.type === 'separator') {
            return <Separator key={`sep-${i}`} className="my-2" />
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
