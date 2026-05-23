import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { LoginPage } from '@/modules/auth/LoginPage'
import { DashboardPage } from '@/modules/dashboard/DashboardPage'

export default function App() {
  const { user, isLoading } = useAuthStore()
  const { init } = useAuth()

  useEffect(() => { init() }, [])

  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <Loader2 size={32} className="text-accent animate-spin" />
      </div>
    )
  }

  return user ? <DashboardPage /> : <LoginPage />
}
