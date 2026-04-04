import { Menu } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface TopBarProps {
  onMenuClick?: () => void
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { currentRole, toggleRole, currentUser } = useApp()

  return (
    <header className="h-14 border-b border-border bg-background px-4 md:px-6 flex items-center justify-between shrink-0 gap-2">
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
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="hidden sm:inline">担当者</span>
          <Switch
            checked={currentRole === 'manager'}
            onCheckedChange={toggleRole}
          />
          <span className="hidden sm:inline">管理者</span>
        </div>
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center gap-2 min-w-0">
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarFallback className="text-xs">{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium truncate">{currentUser.name}</span>
            <Badge variant="secondary" className="text-xs hidden sm:inline-flex">{currentUser.team}</Badge>
          </div>
        </div>
      </div>
    </header>
  )
}
