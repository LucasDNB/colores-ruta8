import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import DashboardClient from './DashboardClient'

export default function DashboardPage() {
  const user = requireAuth()
  if (!user) redirect('/login')
  return <DashboardClient />
}
