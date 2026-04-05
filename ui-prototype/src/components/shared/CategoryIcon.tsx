import type { ProcedureCategory } from '@/data/types'
import { Send, UserPlus, Receipt, CreditCard, Wallet, Building } from 'lucide-react'

interface CategoryIconProps {
  category: ProcedureCategory
  size?: 'sm' | 'md' | 'lg'
}

const iconMap = {
  transfer: Send,
  account: UserPlus,
  invoice: Receipt,
  payment: CreditCard,
  expense: Wallet,
  vendor: Building,
}

const toneMap: Record<ProcedureCategory, { bg: string; text: string }> = {
  transfer: { bg: 'bg-violet-50', text: 'text-violet-600' },
  account:  { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  invoice:  { bg: 'bg-blue-50', text: 'text-blue-600' },
  payment:  { bg: 'bg-primary/10', text: 'text-primary' },
  expense:  { bg: 'bg-amber-50', text: 'text-amber-600' },
  vendor:   { bg: 'bg-teal-50', text: 'text-teal-600' },
}

const sizeMap = {
  sm: { box: 'w-8 h-8 rounded-md', icon: 'h-4 w-4' },
  md: { box: 'w-10 h-10 rounded-lg', icon: 'h-5 w-5' },
  lg: { box: 'w-12 h-12 rounded-xl', icon: 'h-6 w-6' },
}

export default function CategoryIcon({ category, size = 'md' }: CategoryIconProps) {
  const Icon = iconMap[category]
  const tone = toneMap[category]
  const s = sizeMap[size]
  return (
    <div className={`flex items-center justify-center shrink-0 shadow-[var(--shadow-premium-sm)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] ${s.box} ${tone.bg}`}>
      <Icon className={`${s.icon} ${tone.text}`} />
    </div>
  )
}
