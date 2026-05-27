import type { Movimiento } from '../services/getMovimientos'

export type Grupo = {
   categoriaId: string
   nombre: string
   icono: string
   total: number
   porcentaje: number
   items: Movimiento[]
}
