import { useState } from 'react'
import { Trash2, Inbox } from 'lucide-react'
import { CategoryIcon } from '@/modules/categories/components/CategoryIcon'
import { formatCurrency } from '@/utils/formatCurrency'
import { cn } from '@/utils/cn'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Movimiento } from '../services/getMovimientos'
import type { TipoMovimiento } from '@/models/categoria'

interface MovementListProps {
   movimientos: Movimiento[]
   onDelete: (id: string) => Promise<void> | void
}

type FilterType = 'TODOS' | TipoMovimiento

export function MovementList({ movimientos, onDelete }: MovementListProps) {
   const [filter, setFilter] = useState<FilterType>('TODOS')
   const [deletingId, setDeletingId] = useState<string | null>(null)

   const filtered =
      filter === 'TODOS' ? movimientos : movimientos.filter((m) => m.tipo === filter)

   const handleDelete = async (id: string) => {
      if (!confirm('¿Eliminar este movimiento?')) return
      setDeletingId(id)
      try {
         await onDelete(id)
      } finally {
         setDeletingId(null)
      }
   }

   const filters: { label: string; value: FilterType }[] = [
      { label: 'Todos', value: 'TODOS' },
      { label: 'Ingresos', value: 'INGRESO' },
      { label: 'Gastos', value: 'EGRESO' },
   ]

   return (
      <div className="card animate-slide-up p-5 [animation-delay:0.4s] [animation-fill-mode:backwards]">
         <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
               <h3 className="text-sm font-semibold">Todos los movimientos</h3>
               <span className="text-[11px] font-bold bg-accent text-background rounded-full px-2 py-0.5 min-w-[20px] text-center">
                  {filtered.length}
               </span>
            </div>
            <div className="flex gap-0.5 bg-background rounded-full p-[3px]">
               {filters.map((f) => (
                  <button
                     key={f.value}
                     onClick={() => setFilter(f.value)}
                     className={cn(
                        'px-3 py-[5px] rounded-full border-none text-xs font-medium font-body cursor-pointer transition-all duration-150',
                        filter === f.value
                           ? 'bg-surface-elevated text-white'
                           : 'bg-transparent text-text-muted'
                     )}
                  >
                     {f.label}
                  </button>
               ))}
            </div>
         </div>

         {filtered.length === 0 ? (
            <div className="text-center py-10">
               <Inbox size={40} className="text-text-muted opacity-50 mx-auto mb-3" />
               <p className="text-sm text-text-muted">No hay movimientos</p>
            </div>
         ) : (
            <div className="flex flex-col gap-0.5">
               {filtered.map((mov) => (
                  <div
                     key={mov.id}
                     className={cn(
                        'flex items-center p-3 gap-3 rounded-md transition-colors duration-150 hover:bg-white/3',
                        deletingId === mov.id && 'opacity-40'
                     )}
                  >
                     <div
                        className={cn(
                           'w-9.5 h-9.5 rounded-sm shrink-0 flex items-center justify-center',
                           mov.tipo === 'INGRESO'
                              ? 'bg-accent/10 text-accent'
                              : 'bg-danger/10 text-danger'
                        )}
                     >
                        <CategoryIcon icono={mov.categoria?.icono ?? '💰'} size={18} />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                           {mov.concepto}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">
                           {mov.categoria?.nombre} ·{' '}
                           {format(new Date(mov.fecha), 'd MMM', { locale: es })}
                           {mov.plataforma && <> · {mov.plataforma.nombre}</>}
                        </p>
                     </div>
                     <span
                        className={cn(
                           'font-heading text-sm font-bold whitespace-nowrap',
                           mov.tipo === 'INGRESO' ? 'text-accent' : 'text-danger'
                        )}
                     >
                        {mov.tipo === 'INGRESO' ? '+' : '-'}
                        {formatCurrency(mov.monto)}
                     </span>
                     <button
                        onClick={() => handleDelete(mov.id)}
                        className="w-7 h-7 rounded-sm border-none bg-transparent text-text-muted flex items-center justify-center shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-150"
                     >
                        <Trash2 size={14} />
                     </button>
                  </div>
               ))}
            </div>
         )}
      </div>
   )
}
