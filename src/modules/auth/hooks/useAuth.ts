import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { queriesKeys } from '@/lib/react-query'
import { postLogin } from '../services/postLogin'
import { toast } from '@/components'
import { getMe } from '../services/getMe'

export const useAuth = () => {
   const authStoreActions = useAuthStore((s) => s.actions)
   const queryClient = useQueryClient()

   const { mutateAsync: login, isPending: isLoginPending } = useMutation({
      mutationFn: postLogin,
      onSuccess: ({ token, user }) => {
         localStorage.setItem('token', token)
         authStoreActions.setUser(user)
      },
      onError: (error) => {
         toast.error(error.message ?? 'No se pudo iniciar sesión')
      },
   })

   const init = () => {
      const token = localStorage.getItem('token')
      if (!token) {
         authStoreActions.setIsLoading(false)
         return
      }
      queryClient
         .fetchQuery({ queryKey: [queriesKeys.VERIFY_AUTH], queryFn: getMe })
         .then(authStoreActions.setUser)
         .catch(() => {
            localStorage.removeItem('token')
            authStoreActions.setUser(null)
         })
         .finally(() => authStoreActions.setIsLoading(false))
   }

   const logout = () => {
      localStorage.removeItem('token')
      authStoreActions.resetStore()
      queryClient.clear()
   }

   return { init, login, isLoginPending, logout }
}
