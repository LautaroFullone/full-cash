import { fetchAPI } from '@/lib/fetchAPI'
import type { Categoria, TipoMovimiento } from '@/models/categoria'
import type { Plataforma } from '@/models/plataforma'

export interface Movimiento {
   id: string
   concepto: string
   monto: number
   tipo: TipoMovimiento
   categoriaId: string
   categoria?: Categoria
   plataformaId?: string | null
   plataforma?: Plataforma | null
   fecha: string
   createdAt: string
}

export interface GetMovimientosParams {
   mes: number
   anio: number
}

export function getMovimientos(params: GetMovimientosParams): Promise<Movimiento[]> {
   return fetchAPI(`/movimientos?mes=${params.mes}&anio=${params.anio}`)
}
