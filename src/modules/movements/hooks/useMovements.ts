import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { PutMovimientoBody } from '../services/putMovimiento'
import { getResumenMensual } from '../services/getResumenMensual'
import { deleteMovimiento } from '../services/deleteMovimiento'
import { getMovimientos } from '../services/getMovimientos'
import { postMovimiento } from '../services/postMovimiento'
import { putMovimiento } from '../services/putMovimiento'

export interface UpdateMovimientoArgs {
   id: string
   data: PutMovimientoBody
}

export function useMovements(mes: number, anio: number) {
   const qc = useQueryClient()
   const keys = {
      list: ['movimientos', mes, anio] as const,
      resumen: ['resumen', mes, anio] as const,
   }

   const movimientosQuery = useQuery({
      queryKey: keys.list,
      queryFn: () => getMovimientos({ mes, anio }),
   })

   const resumenQuery = useQuery({
      queryKey: keys.resumen,
      queryFn: () => getResumenMensual(mes, anio),
   })

   const invalidate = () => {
      qc.invalidateQueries({ queryKey: keys.list })
      qc.invalidateQueries({ queryKey: keys.resumen })
   }

   const { mutateAsync: createMovimiento } = useMutation({
      mutationFn: postMovimiento,
      onSuccess: invalidate,
   })

   const { mutateAsync: removeMovimiento } = useMutation({
      mutationFn: deleteMovimiento,
      onSuccess: invalidate,
   })

   const { mutateAsync: updateMovimiento } = useMutation({
      mutationFn: ({ id, data }: UpdateMovimientoArgs) => putMovimiento(id, data),
      onSuccess: invalidate,
   })

   return {
      movimientos: movimientosQuery.data ?? [],
      resumen: resumenQuery.data ?? null,
      isLoading: movimientosQuery.isLoading || resumenQuery.isLoading,
      error: movimientosQuery.error?.message ?? resumenQuery.error?.message ?? null,
      createMovimiento,
      updateMovimiento,
      deleteMovimiento: removeMovimiento,
   }
}
