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

export interface UpdateMovimientoArgs {
   id: string
   data: PutMovimientoBody
}

export const putMovimiento = ({ id, data }: UpdateMovimientoArgs) =>
   fetchAPI<Movimiento>(`/movimientos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
   })
