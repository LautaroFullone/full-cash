import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePlataforma } from '../services/deletePlataforma'
import { getPlataformas } from '../services/getPlataformas'
import { postPlataforma } from '../services/postPlataforma'
import { queriesKeys } from '@/lib/react-query'
import { toast } from '@/components'

export const usePlatforms = () => {
   const queryClient = useQueryClient()

   const { data: plataformas, isLoading } = useQuery({
      queryKey: [queriesKeys.FETCH_PLATAFORMAS],
      queryFn: getPlataformas,
      staleTime: 5 * 60_000,
   })

   const { mutateAsync: createPlataforma, isPending: isCreating } = useMutation({
      mutationFn: postPlataforma,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [queriesKeys.FETCH_PLATAFORMAS] })
      },
      onError: (error) => {
         toast.error(error.message ?? 'No se pudo crear la plataforma')
      },
   })

   const { mutateAsync: removePlataforma, isPending: isDeleting } = useMutation({
      mutationFn: deletePlataforma,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [queriesKeys.FETCH_PLATAFORMAS] })
      },
      onError: (error) => {
         toast.error(error.message ?? 'No se pudo eliminar la plataforma')
      },
   })

   return {
      plataformas: plataformas ?? [],
      isLoading,
      createPlataforma,
      isCreating,
      deletePlataforma: removePlataforma,
      isDeleting,
   }
}
