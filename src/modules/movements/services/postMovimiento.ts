import type { Movimiento } from './getMovimientos'
import { fetchAPI } from '@/lib/fetchAPI'

export interface PostMovimientoBody {
   concepto: string
   monto: number
   tipo: 'INGRESO' | 'EGRESO'
   categoriaId: string
   plataformaId?: string
   fecha: string
}

export const postMovimiento = (body: PostMovimientoBody) =>
   fetchAPI<Movimiento>('/movimientos', {
      method: 'POST',
      body: JSON.stringify(body),
   })
