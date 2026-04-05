import { useLocation, useNavigate } from 'react-router-dom'
import { Home, ClipboardCheck, FileText, BarChart3, Menu } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomNavProps {
  onMenuClick: () => void
}

type Tab =
  | { type: 'link'; label: string; icon: LucideIcon; to: string; match: (pathname: string, hash: string) => boolean }
  | { type: 'action'; label: string; icon: LucideIcon; onClick: (ctx: { openMenu: () => void }) => void; match: () => false }

const tabs: Tab[] = [
  {
    type: 'link', label: 'ホーム', icon: Home, to: '/home',
    match: (p, h) => p === '/home' && h !== '#pending',
  },
  {
    type: 'link', label: '承認待ち', icon: ClipboardCheck, to: '/home#pending',
    match: (p, h) => p === '/home' && h === '#pending',
  },
  {
    type: 'link', label: '変更提案', icon: FileText, to: '/proposals',
    match: (p) => p.startsWith('/proposals'),
  },
  {
    type: 'link', label: '学習', icon: BarChart3, to: '/learning',
    match: (p) => p.startsWith('/learning'),
  },
  {
    type: 'action', label: 'メニュー', icon: Menu,
    onClick: ({ openMenu }) => openMenu(),
    match: () => false,
  },
]

export default function BottomNav({ onMenuClick }: BottomNavProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { pathname, hash } = location

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 glass-panel border-t border-border/60 pb-[env(safe-area-inset-bottom)]"
      aria-label="メインメニュー"
    >
      <ul className="grid grid-cols-5 h-14">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = tab.type === 'link' ? tab.match(pathname, hash) : false
          const onClick = tab.type === 'link'
            ? () => {
                if (tab.to.includes('#')) {
                  // React Router keeps hash; manually push and trigger scroll
                  navigate(tab.to)
                  requestAnimationFrame(() => {
                    const target = document.getElementById('pending')
                    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  })
                } else {
                  navigate(tab.to)
                }
              }
            : () => tab.onClick({ openMenu: onMenuClick })
          return (
            <li key={tab.label}>
              <button
                type="button"
                onClick={onClick}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  "relative w-full h-full flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute top-0 w-6 h-0.5 bg-primary rounded-full"
                  />
                )}
                <Icon className="h-[20px] w-[20px]" strokeWidth={isActive ? 2.25 : 2} />
                <span className="tracking-normal leading-[1.2]">{tab.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
