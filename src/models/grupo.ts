import type { Movimiento } from '@/modules/movements/services/getMovimientos'
import type { TipoMovimiento } from '@/models/categoria'

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
