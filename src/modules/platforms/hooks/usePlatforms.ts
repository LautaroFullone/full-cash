import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPlataformas } from '../services/getPlataformas'
import { postPlataforma } from '../services/postPlataforma'
import { deletePlataforma } from '../services/deletePlataforma'

export function usePlatforms() {
   const qc = useQueryClient()

   const query = useQuery({
      queryKey: ['plataformas'],
      queryFn: getPlataformas,
      staleTime: 5 * 60_000,
   })

   const { mutateAsync: createPlataforma } = useMutation({
      mutationFn: postPlataforma,
      onSuccess: () => qc.invalidateQueries({ queryKey: ['plataformas'] }),
   })

   const { mutateAsync: removePlataforma } = useMutation({
      mutationFn: deletePlataforma,
      onSuccess: () => qc.invalidateQueries({ queryKey: ['plataformas'] }),
   })

   return {
      plataformas: query.data ?? [],
      isLoading: query.isLoading,
      createPlataforma,
      deletePlataforma: removePlataforma,
   }
}
