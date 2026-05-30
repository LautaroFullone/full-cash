import type { Movimiento } from '@/modules/movements/services/getMovimientos'
import { format } from 'date-fns'

export interface DayBucket {
   key: string // yyyy-MM-dd
   date: Date
   items: Movimiento[]
}

// Agrupa movimientos por día calendario, ordenados ascendente por fecha.
// Los items quedan ordenados del más reciente al más antiguo dentro del día.
export const groupByDay = (movimientos: Movimiento[]) => {
   const map = new Map<string, DayBucket>()

   movimientos.forEach((m) => {
      const date = new Date(m.fecha)
      const key = format(date, 'yyyy-MM-dd')

      const cur = map.get(key)
      if (cur) cur.items.push(m)
      else map.set(key, { key, date, items: [m] })
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
