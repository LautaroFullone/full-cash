import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCategorias } from '../services/getCategorias'
import { postCategoria } from '../services/postCategoria'
import { putCategoria } from '../services/putCategoria'
import { deleteCategoria } from '../services/deleteCategoria'
import type { PostCategoriaBody } from '../services/postCategoria'
import type { PutCategoriaBody } from '../services/putCategoria'

export function useCategories() {
   const qc = useQueryClient()

   const query = useQuery({
      queryKey: ['categorias'],
      queryFn: getCategorias,
      staleTime: 5 * 60_000,
   })

   const createMutation = useMutation({
      mutationFn: postCategoria,
      onSuccess: () => qc.invalidateQueries({ queryKey: ['categorias'] }),
   })

   const updateMutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: PutCategoriaBody }) =>
         putCategoria(id, data),
      onSuccess: () => qc.invalidateQueries({ queryKey: ['categorias'] }),
   })

   const deleteMutation = useMutation({
      mutationFn: deleteCategoria,
      onSuccess: () => qc.invalidateQueries({ queryKey: ['categorias'] }),
   })

   return {
      categorias: query.data ?? [],
      isLoading: query.isLoading,
      createCategoria: (data: PostCategoriaBody) => createMutation.mutateAsync(data),
      updateCategoria: (id: string, data: PutCategoriaBody) =>
         updateMutation.mutateAsync({ id, data }),
      deleteCategoria: (id: string) => deleteMutation.mutateAsync(id),
   }
}
