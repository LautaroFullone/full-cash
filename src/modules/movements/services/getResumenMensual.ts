import { fetchAPI } from '@/lib/fetchAPI'

export interface DistribucionCategoria {
   categoriaId: string
   categoriaNombre: string
   total: number
   porcentaje: number
}

export interface ResumenMensual {
   totalIngresos: number
   totalEgresos: number
   saldo: number
   distribucionCategorias: DistribucionCategoria[]
}

export function getResumenMensual(mes: number, anio: number) {
   return fetchAPI<ResumenMensual>(`/movimientos/resumen?mes=${mes}&anio=${anio}`)
}
