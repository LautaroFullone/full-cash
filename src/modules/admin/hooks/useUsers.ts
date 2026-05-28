import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteUser } from '../services/deleteUser'
import { getUsers } from '../services/getUsers'
import { postUser } from '../services/postUser'

export function useUsers() {
   const qc = useQueryClient()

   const query = useQuery({
      queryKey: ['users'],
      queryFn: getUsers,
   })

   const { mutateAsync: createUser, isPending: isCreating } = useMutation({
      mutationFn: postUser,
      onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
   })

   const {
      mutateAsync: removeUser,
      isPending: isDeleting,
      variables: deletingUserId,
   } = useMutation({
      mutationFn: deleteUser,
      onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
   })

   return {
      users: query.data ?? [],
      isLoading: query.isLoading,
      isError: query.isError,
      createUser,
      isCreating,
      deleteUser: removeUser,
      deletingUserId: isDeleting ? deletingUserId : null,
   }
}
