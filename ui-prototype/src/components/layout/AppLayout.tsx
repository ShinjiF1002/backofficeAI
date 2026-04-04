import { useState, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar: inline from md up */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile drawer sidebar: fixed overlay below md */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!drawerOpen}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={closeDrawer}
        />
        <div
          className={`absolute inset-y-0 left-0 transition-transform ${
            drawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar onNavigate={closeDrawer} />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenuClick={openDrawer} />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
