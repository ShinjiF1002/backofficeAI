import { Menu, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface TopBarProps {
  onMenuClick?: () => void
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { currentUser, tasks } = useApp()
  const navigate = useNavigate()
  const pendingCount = tasks.filter(t => t.status === 'pending').length
  const hasNotifications = pendingCount > 0

  return (
    <header className="h-16 glass-panel px-4 md:px-6 flex items-center justify-between shrink-0 gap-2 sticky top-0 z-40">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="md:hidden"
        aria-label="メニューを開く"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-3 ml-auto min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-[10px]"
          aria-label={hasNotifications ? `通知 (承認待ち ${pendingCount} 件)` : '通知'}
          onClick={() => navigate('/home#pending')}
        >
          <Bell className="h-[18px] w-[18px]" />
          {hasNotifications && (
            <span
              aria-hidden
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border border-background"
            />
          )}
        </Button>
        <div className="h-6 w-[1px] bg-border shrink-0" aria-hidden />
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-sm font-semibold tracking-tight truncate hidden sm:inline leading-none">
            {currentUser.name}
          </span>
          <Avatar className="size-9 ring-2 ring-background shrink-0">
            <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
