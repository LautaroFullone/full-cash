import type { Movimiento } from '../services/getMovimientos'

export type Grupo = {
   categoriaId: string
   nombre: string
   icono: string
   colorIndex: number
   total: number
   porcentaje: number
   items: Movimiento[]
}
