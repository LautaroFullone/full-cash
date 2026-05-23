import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMovimientos } from '../services/getMovimientos'
import { getResumenMensual } from '../services/getResumenMensual'
import { postMovimiento } from '../services/postMovimiento'
import { putMovimiento } from '../services/putMovimiento'
import { deleteMovimiento } from '../services/deleteMovimiento'
import type { PostMovimientoBody } from '../services/postMovimiento'
import type { PutMovimientoBody } from '../services/putMovimiento'

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

  const createMutation = useMutation({ mutationFn: postMovimiento, onSuccess: invalidate })
  const deleteMutation = useMutation({ mutationFn: deleteMovimiento, onSuccess: invalidate })
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutMovimientoBody }) => putMovimiento(id, data),
    onSuccess: invalidate,
  })

  return {
    movimientos: movimientosQuery.data ?? [],
    resumen: resumenQuery.data ?? null,
    loading: movimientosQuery.isLoading || resumenQuery.isLoading,
    error: movimientosQuery.error?.message ?? resumenQuery.error?.message ?? null,
    createMovimiento: (data: PostMovimientoBody) => createMutation.mutateAsync(data),
    deleteMovimiento: (id: string) => deleteMutation.mutateAsync(id),
    updateMovimiento: (id: string, data: PutMovimientoBody) => updateMutation.mutateAsync({ id, data }),
  }
}
