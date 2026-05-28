import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { PostCategoriaBody } from '../services/postCategoria'
import type { PutCategoriaBody } from '../services/putCategoria'
import { deleteCategoria } from '../services/deleteCategoria'
import { getCategorias } from '../services/getCategorias'
import { postCategoria } from '../services/postCategoria'
import { putCategoria } from '../services/putCategoria'

export interface UpdateCategoriaArgs {
   id: string
   data: PutCategoriaBody
}

export function useCategories() {
   const qc = useQueryClient()

   const query = useQuery({
      queryKey: ['categorias'],
      queryFn: getCategorias,
      staleTime: 5 * 60_000,
   })

   const invalidate = () => qc.invalidateQueries({ queryKey: ['categorias'] })

   const { mutateAsync: createCategoria } = useMutation({
      mutationFn: (data: PostCategoriaBody) => postCategoria(data),
      onSuccess: invalidate,
   })

   const { mutateAsync: updateCategoria } = useMutation({
      mutationFn: ({ id, data }: UpdateCategoriaArgs) => putCategoria(id, data),
      onSuccess: invalidate,
   })

   const { mutateAsync: removeCategoria } = useMutation({
      mutationFn: deleteCategoria,
      onSuccess: invalidate,
   })

   return {
      categorias: query.data ?? [],
      isLoading: query.isLoading,
      createCategoria,
      updateCategoria,
      deleteCategoria: removeCategoria,
   }
}
