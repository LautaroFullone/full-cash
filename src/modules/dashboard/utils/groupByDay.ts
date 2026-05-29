import type { Movimiento } from '@/modules/movements/services/getMovimientos'
import { format } from 'date-fns'

export interface DayBucket {
   key: string // yyyy-MM-dd
   date: Date
   net: number
   ingresos: number
   egresos: number
   items: Movimiento[]
}

// Agrupa movimientos por día calendario, ordenados ascendente por fecha.
// El neto del día = ingresos - egresos. Los items quedan ordenados del más
// reciente al más antiguo dentro del día.
export const groupByDay = (movimientos: Movimiento[]) => {
   const map = new Map<string, DayBucket>()

   movimientos.forEach((m) => {
      const date = new Date(m.fecha)
      const key = format(date, 'yyyy-MM-dd')
      const signed = m.tipo === 'INGRESO' ? m.monto : -m.monto

      const cur = map.get(key)
      if (cur) {
         cur.net += signed
         cur.ingresos += m.tipo === 'INGRESO' ? m.monto : 0
         cur.egresos += m.tipo === 'EGRESO' ? m.monto : 0
         cur.items.push(m)
      } else {
         map.set(key, {
            key,
            date,
            net: signed,
            ingresos: m.tipo === 'INGRESO' ? m.monto : 0,
            egresos: m.tipo === 'EGRESO' ? m.monto : 0,
            items: [m],
         })
      }
   })

   return Array.from(map.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((bucket) => ({
         ...bucket,
         items: bucket.items.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
         ),
      }))
}
