import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCategoria } from '../services/deleteCategoria'
import { getCategorias } from '../services/getCategorias'
import { postCategoria } from '../services/postCategoria'
import { putCategoria } from '../services/putCategoria'
import { queriesKeys } from '@/lib/react-query'
import { toast } from '@/components'

export const useCategories = () => {
   const queryClient = useQueryClient()

   const { data: categorias, isLoading } = useQuery({
      queryKey: [queriesKeys.FETCH_CATEGORIAS],
      queryFn: getCategorias,
      staleTime: 5 * 60_000,
   })

   const { mutateAsync: createCategoria, isPending: isCreating } = useMutation({
      mutationFn: postCategoria,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [queriesKeys.FETCH_CATEGORIAS] })
      },
      onError: (error) => {
         toast.error(error.message ?? 'No se pudo crear la categoría')
      },
   })

   const { mutateAsync: updateCategoria, isPending: isUpdating } = useMutation({
      mutationFn: putCategoria,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [queriesKeys.FETCH_CATEGORIAS] })
      },
      onError: (error) => {
         toast.error(error.message ?? 'No se pudo actualizar la categoría')
      },
   })

   const { mutateAsync: removeCategoria, isPending: isDeleting } = useMutation({
      mutationFn: deleteCategoria,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [queriesKeys.FETCH_CATEGORIAS] })
      },
      onError: (error) => {
         toast.error(error.message ?? 'No se pudo eliminar la categoría')
      },
   })

   return {
      categorias: categorias ?? [],
      isLoading,
      createCategoria,
      isCreating,
      updateCategoria,
      isUpdating,
      deleteCategoria: removeCategoria,
      isDeleting,
   }
}
