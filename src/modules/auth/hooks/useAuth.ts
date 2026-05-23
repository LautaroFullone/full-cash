import { useAuthStore } from '@/stores/authStore'
import { postLogin } from '../services/postLogin'
import { getMe } from '../services/getMe'

export function useAuth() {
   const { setUser, setIsLoading } = useAuthStore()

   async function init() {
      const token = localStorage.getItem('token')
      if (!token) {
         setIsLoading(false)
         return
      }
      try {
         const user = await getMe()
         setUser(user)
      } catch {
         localStorage.removeItem('token')
         setUser(null)
      } finally {
         setIsLoading(false)
      }
   }

   async function login(email: string, password: string) {
      const { token, user } = await postLogin({ email, password })
      localStorage.setItem('token', token)
      setUser(user)
   }

   function logout() {
      localStorage.removeItem('token')
      setUser(null)
   }

   return { init, login, logout }
}
