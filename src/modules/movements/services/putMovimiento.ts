import type { Movimiento } from './getMovimientos'
import { fetchAPI } from '@/lib/fetchAPI'

export type PutMovimientoBody = Partial<{
   concepto: string
   monto: number
   tipo: 'INGRESO' | 'EGRESO'
   categoriaId: string
   plataformaId: string | null
   fecha: string
}>

export function putMovimiento(id: string, body: PutMovimientoBody) {
   return fetchAPI<Movimiento>(`/movimientos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
   })
}
