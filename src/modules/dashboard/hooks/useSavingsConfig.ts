import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getConfiguracion } from '../services/getConfiguracion'
import { putConfiguracion } from '../services/putConfiguracion'

export function useSavingsConfig() {
   const qc = useQueryClient()

   const query = useQuery({
      queryKey: ['configuracion'],
      queryFn: getConfiguracion,
   })

   const { mutateAsync: updatePorcentaje } = useMutation({
      mutationFn: putConfiguracion,
      onSuccess: () => qc.invalidateQueries({ queryKey: ['configuracion'] }),
   })

   return {
      config: query.data ?? null,
      isLoading: query.isLoading,
      updatePorcentaje,
   }
}
