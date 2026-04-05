import { Menu } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface TopBarProps {
  onMenuClick?: () => void
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { currentUser } = useApp()

  return (
    <header className="h-14 glass-panel px-4 md:px-6 flex items-center justify-between shrink-0 gap-2 sticky top-0 z-40">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="md:hidden"
        aria-label="メニューを開く"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-3 md:gap-4 ml-auto min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium truncate">{currentUser.name}</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">{currentUser.team}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
