import { fetchAPI } from '@/lib/fetchAPI'
import type { Movimiento } from './getMovimientos'

export interface PostMovimientoBody {
   concepto: string
   monto: number
   tipo: 'INGRESO' | 'EGRESO'
   categoriaId: string
   plataformaId?: string
   fecha: string
}

export function postMovimiento(body: PostMovimientoBody): Promise<Movimiento> {
   return fetchAPI('/movimientos', { method: 'POST', body: JSON.stringify(body) })
}
