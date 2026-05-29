import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getResumenMensual } from '../services/getResumenMensual'
import { deleteMovimiento } from '../services/deleteMovimiento'
import { getMovimientos } from '../services/getMovimientos'
import { postMovimiento } from '../services/postMovimiento'
import { putMovimiento } from '../services/putMovimiento'
import { queriesKeys } from '@/lib/react-query'
import { toast } from '@/components'

export const useMovements = (mes: number, anio: number) => {
   const queryClient = useQueryClient()

   const {
      data: movimientos,
      isLoading: isLoadingMovimientos,
      isError: isErrorMovimientos,
   } = useQuery({
      queryKey: [queriesKeys.FETCH_MOVIMIENTOS, mes, anio],
      queryFn: () => getMovimientos({ mes, anio }),
   })

   const {
      data: resumen,
      isLoading: isLoadingResumen,
      isError: isErrorResumen,
   } = useQuery({
      queryKey: [queriesKeys.FETCH_RESUMEN, mes, anio],
      queryFn: () => getResumenMensual(mes, anio),
   })

   const { mutateAsync: createMovimiento, isPending: isCreating } = useMutation({
      mutationFn: postMovimiento,
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: [queriesKeys.FETCH_MOVIMIENTOS, mes, anio],
         })
         queryClient.invalidateQueries({
            queryKey: [queriesKeys.FETCH_RESUMEN, mes, anio],
         })
      },
      onError: (error) => {
         toast.error(error.message ?? 'No se pudo crear el movimiento')
      },
   })

   const { mutateAsync: updateMovimiento, isPending: isUpdating } = useMutation({
      mutationFn: putMovimiento,
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: [queriesKeys.FETCH_MOVIMIENTOS, mes, anio],
         })
         queryClient.invalidateQueries({
            queryKey: [queriesKeys.FETCH_RESUMEN, mes, anio],
         })
      },
      onError: (error) => {
         toast.error(error.message ?? 'No se pudo actualizar el movimiento')
      },
   })

   const { mutateAsync: removeMovimiento, isPending: isDeleting } = useMutation({
      mutationFn: deleteMovimiento,
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: [queriesKeys.FETCH_MOVIMIENTOS, mes, anio],
         })
         queryClient.invalidateQueries({
            queryKey: [queriesKeys.FETCH_RESUMEN, mes, anio],
         })
      },
      onError: (error) => {
         toast.error(error.message ?? 'No se pudo eliminar el movimiento')
      },
   })

   return {
      movimientos: movimientos ?? [],
      resumen: resumen ?? null,
      isLoading: isLoadingMovimientos || isLoadingResumen,
      isError: isErrorMovimientos || isErrorResumen,
      createMovimiento,
      isCreating,
      updateMovimiento,
      isUpdating,
      deleteMovimiento: removeMovimiento,
      isDeleting,
   }
}
