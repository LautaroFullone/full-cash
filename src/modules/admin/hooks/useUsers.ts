import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteUser } from '../services/deleteUser'
import { queriesKeys } from '@/lib/react-query'
import { getUsers } from '../services/getUsers'
import { postUser } from '../services/postUser'
import { toast } from '@/components'

export const useUsers = () => {
   const queryClient = useQueryClient()

   const {
      data: users,
      isLoading,
      isError,
   } = useQuery({
      queryKey: [queriesKeys.FETCH_USERS],
      queryFn: getUsers,
   })

   const { mutateAsync: createUser, isPending: isCreating } = useMutation({
      mutationFn: postUser,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [queriesKeys.FETCH_USERS] })
      },
      onError: (error) => {
         toast.error(error.message ?? 'No se pudo crear el usuario')
      },
   })

   const {
      mutateAsync: removeUser,
      isPending: isDeleting,
      variables: deletingUserId,
   } = useMutation({
      mutationFn: deleteUser,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [queriesKeys.FETCH_USERS] })
      },
      onError: (error) => {
         toast.error(error.message ?? 'No se pudo eliminar el usuario')
      },
   })

   return {
      users: users ?? [],
      isLoading,
      isError,
      createUser,
      isCreating,
      deleteUser: removeUser,
      isDeleting,
      deletingUserId: isDeleting ? deletingUserId : null,
   }
}
