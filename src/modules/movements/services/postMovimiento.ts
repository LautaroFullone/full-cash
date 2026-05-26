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

export function postMovimiento(body: PostMovimientoBody) {
   return fetchAPI<Movimiento>('/movimientos', {
      method: 'POST',
      body: JSON.stringify(body),
   })
}
