import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getConfiguracion } from '../services/getConfiguracion'
import { putConfiguracion } from '../services/putConfiguracion'
import { queriesKeys } from '@/lib/react-query'
import { toast } from '@/components'

export const useSavingsConfig = () => {
   const queryClient = useQueryClient()

   const { data: config, isLoading } = useQuery({
      queryKey: [queriesKeys.FETCH_CONFIGURACION],
      queryFn: getConfiguracion,
   })

   const { mutateAsync: updatePorcentaje, isPending: isUpdating } = useMutation({
      mutationFn: putConfiguracion,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [queriesKeys.FETCH_CONFIGURACION] })
      },
      onError: (error) => {
         toast.error(error.message ?? 'No se pudo actualizar la configuración')
      },
   })

   return {
      config: config ?? null,
      isLoading,
      updatePorcentaje,
      isUpdating,
   }
}
