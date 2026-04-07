import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'

export default function Home() {
  const user = requireAuth()
  if (user) redirect('/dashboard')
  redirect('/login')
}
