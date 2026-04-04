import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Role, Task, Proposal } from '@/data/types'
import { users, initialTasks, proposals as initialProposals } from '@/data/mockData'

interface AppState {
  currentRole: Role
  toggleRole: () => void
  currentUser: typeof users[0]
  tasks: Task[]
  approveTask: (taskId: string) => void
  sendBackTask: (taskId: string) => void
  proposals: Proposal[]
  updateProposalStatus: (id: string, status: Proposal['status']) => void
  upgradeApproved: boolean
  approveUpgrade: () => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<Role>('manager')
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals)
  const [upgradeApproved, setUpgradeApproved] = useState(false)

  const currentUser = currentRole === 'staff' ? users[0] : users[2]

  const toggleRole = useCallback(() => {
    setCurrentRole(r => r === 'staff' ? 'manager' : 'staff')
  }, [])

  const approveTask = useCallback((taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t
      const currentStep = t.steps.find(s => s.status === 'current')
      if (!currentStep) return { ...t, status: 'done' }

      const nextStepNum = currentStep.stepNum + 1
      const hasNext = t.steps.some(s => s.stepNum === nextStepNum)

      if (!hasNext) {
        return { ...t, status: 'done', steps: t.steps.map(s => ({ ...s, status: 'completed' as const })) }
      }

      return {
        ...t,
        currentStepNum: nextStepNum,
        status: 'running',
        steps: t.steps.map(s => {
          if (s.stepNum === currentStep.stepNum) return { ...s, status: 'completed' as const }
          if (s.stepNum === nextStepNum) return { ...s, status: 'current' as const }
          return s
        }),
      }
    }))
  }, [])

  const sendBackTask = useCallback((taskId: string) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: 'pending' } : t
    ))
  }, [])

  const updateProposalStatus = useCallback((id: string, status: Proposal['status']) => {
    setProposals(prev => prev.map(p =>
      p.id === id ? { ...p, status } : p
    ))
  }, [])

  const approveUpgrade = useCallback(() => {
    setUpgradeApproved(true)
  }, [])

  return (
    <AppContext.Provider value={{
      currentRole, toggleRole, currentUser,
      tasks, approveTask, sendBackTask,
      proposals, updateProposalStatus,
      upgradeApproved, approveUpgrade,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
