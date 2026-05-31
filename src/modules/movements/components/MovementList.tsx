import { CategoryGroupRow } from './CategoryGroupRow'
import type { Movimiento } from '../services/getMovimientos'
import type { TipoMovimiento } from '@/models/categoria'
import type { Grupo } from '@/models/grupo'
import { useState, useMemo } from 'react'
import { Inbox } from 'lucide-react'

interface MovementListProps {
   movimientos: Movimiento[]
   onEdit: (mov: Movimiento) => void
   tipo?: TipoMovimiento
   bare?: boolean
}

export const MovementList: React.FC<MovementListProps> = ({
   movimientos,
   onEdit,
   tipo,
   bare = false,
}) => {
   const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

   const toggle = (id: string) => {
      setExpandedIds((prev) => {
         const next = new Set(prev)
         next.has(id) ? next.delete(id) : next.add(id)
         return next
      })
   }

   const grupos = useMemo<Grupo[]>(() => {
      const map = new Map<
         string,
         {
            nombre: string
            icono: string
            colorIndex: number
            tipo: TipoMovimiento
            total: number
            items: Movimiento[]
         }
      >()
      const grandTotal = movimientos.reduce((s, m) => s + m.monto, 0)

      movimientos.forEach((m) => {
         const cur = map.get(m.categoriaId)
         if (cur) {
            cur.total += m.monto
            cur.items.push(m)
         } else {
            map.set(m.categoriaId, {
               nombre: m.categoria?.nombre ?? '—',
               icono: m.categoria?.icono ?? '💰',
               colorIndex: m.categoria?.colorIndex ?? 0,
               tipo: m.tipo,
               total: m.monto,
               items: [m],
            })
         }
      })

      return Array.from(map.entries())
         .map(([categoriaId, data]) => ({
            categoriaId,
            nombre: data.nombre,
            icono: data.icono,
            colorIndex: data.colorIndex,
            tipo: data.tipo,
            total: data.total,
            porcentaje: grandTotal > 0 ? (data.total / grandTotal) * 100 : 0,
            items: data.items.sort(
               (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
            ),
         }))
         .sort((a, b) => b.total - a.total)
   }, [movimientos])

   const heading =
      tipo === 'INGRESO' ? 'Ingresos' : tipo === 'EGRESO' ? 'Gastos' : 'Movimientos'

   const wrapperClass = bare
      ? ''
      : 'card animate-slide-up p-5 [animation-delay:0.4s] [animation-fill-mode:backwards]'

   return (
      <div className={wrapperClass}>
         <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-semibold">{heading}</h3>
            <span className="text-[11px] font-bold bg-accent text-background rounded-full px-2 py-0.5 min-w-[20px] text-center tabular-nums">
               {movimientos.length}
            </span>
         </div>

         {movimientos.length === 0 ? (
            <div className="text-center py-10">
               <Inbox size={40} className="text-text-muted opacity-50 mx-auto mb-3" />
               <p className="text-sm text-text-muted">No hay movimientos</p>
            </div>
         ) : (
            <div className="flex flex-col gap-0.5">
               {grupos.map((grupo) => (
                  <CategoryGroupRow
                     key={grupo.categoriaId}
                     grupo={grupo}
                     isExpanded={expandedIds.has(grupo.categoriaId)}
                     onToggle={() => toggle(grupo.categoriaId)}
                     onEditClick={onEdit}
                  />
               ))}
            </div>
         )}
      </div>
   )
}
