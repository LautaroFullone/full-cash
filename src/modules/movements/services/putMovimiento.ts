import { fetchAPI } from '@/lib/fetchAPI'
import type { Movimiento } from './getMovimientos'

export type PutMovimientoBody = Partial<{
  concepto: string
  monto: number
  tipo: 'INGRESO' | 'EGRESO'
  categoriaId: string
  plataformaId: string | null
  fecha: string
}>

export function putMovimiento(id: string, body: PutMovimientoBody): Promise<Movimiento> {
  return fetchAPI(`/movimientos/${id}`, { method: 'PUT', body: JSON.stringify(body) })
}
