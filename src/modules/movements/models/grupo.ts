import type { TipoMovimiento } from '@/models/categoria'
import type { Movimiento } from '../services/getMovimientos'

export type Grupo = {
   categoriaId: string
   nombre: string
   icono: string
   colorIndex: number
   tipo: TipoMovimiento
   total: number
   porcentaje: number
   items: Movimiento[]
}
