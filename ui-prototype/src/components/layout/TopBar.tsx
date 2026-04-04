import { useApp } from '@/context/AppContext'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export default function TopBar() {
  const { currentRole, toggleRole, currentUser } = useApp()

  return (
    <header className="h-14 border-b border-border bg-background px-6 flex items-center justify-between shrink-0">
      <div />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>担当者</span>
          <Switch
            checked={currentRole === 'manager'}
            onCheckedChange={toggleRole}
          />
          <span>管理者</span>
        </div>
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs">{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{currentUser.name}</span>
            <Badge variant="secondary" className="text-xs">{currentUser.team}</Badge>
          </div>
        </div>
      </div>
    </header>
  )
}
