import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { postLogin } from '../services/postLogin'
import { getMe } from '../services/getMe'

export function useAuth() {
   const { setUser, setIsLoading } = useAuthStore()
   const queryClient = useQueryClient()

   const { mutateAsync: login } = useMutation({
      mutationFn: postLogin,
      onSuccess: ({ token, user }) => {
         localStorage.setItem('token', token)
         setUser(user)
      },
   })

   function init() {
      const token = localStorage.getItem('token')
      if (!token) {
         setIsLoading(false)
         return
      }
      queryClient
         .fetchQuery({ queryKey: ['me'], queryFn: getMe })
         .then(setUser)
         .catch(() => {
            localStorage.removeItem('token')
            setUser(null)
         })
         .finally(() => setIsLoading(false))
   }

   function logout() {
      localStorage.removeItem('token')
      setUser(null)
      queryClient.clear()
   }

   return { init, login, logout }
}
