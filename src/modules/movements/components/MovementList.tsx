import { AlertDialog } from '@/components/AlertDialog'
import { toast } from '@/components/Toaster'
import { CategoryIcon } from '@/modules/categories/components/CategoryIcon'
import { formatCurrency } from '@/utils/formatCurrency'
import type { Movimiento } from '../services/getMovimientos'
import type { TipoMovimiento } from '@/models/categoria'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Trash2, Inbox } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/utils/cn'

interface MovementListProps {
   movimientos: Movimiento[]
   onDelete: (id: string) => Promise<void> | void
}

type FilterType = 'TODOS' | TipoMovimiento

export const MovementList: React.FC<MovementListProps> = ({ movimientos, onDelete }) => {
   const [filter, setFilter] = useState<FilterType>('TODOS')
   const [confirmId, setConfirmId] = useState<string | null>(null)
   const [deletingId, setDeletingId] = useState<string | null>(null)

   const filtered =
      filter === 'TODOS' ? movimientos : movimientos.filter((m) => m.tipo === filter)

   const handleDeleteConfirm = async () => {
      if (!confirmId) return
      const id = confirmId
      setConfirmId(null)
      setDeletingId(id)
      try {
         await onDelete(id)
         toast.success('Movimiento eliminado')
      } catch {
         toast.error('Error al eliminar el movimiento')
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
      <>
         <div className="card animate-slide-up p-5 [animation-delay:0.4s] [animation-fill-mode:backwards]">
            <div className="flex flex-col gap-3 mb-4">
               <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">Movimientos</h3>
                  <span className="text-[11px] font-bold bg-accent text-background rounded-full px-2 py-0.5 min-w-[20px] text-center tabular-nums">
                     {filtered.length}
                  </span>
               </div>
               <div className="flex gap-0.5 bg-background rounded-full p-[3px]">
                  {filters.map((f) => (
                     <button
                        key={f.value}
                        onClick={() => setFilter(f.value)}
                        className={cn(
                           'flex-1 py-1.5 rounded-full border-none text-xs font-medium font-body cursor-pointer transition-colors duration-150 active:scale-[0.96]',
                           filter === f.value
                              ? 'bg-surface-elevated text-white'
                              : 'bg-transparent text-text-muted hover:text-text-secondary'
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
                           deletingId === mov.id && 'opacity-40 pointer-events-none'
                        )}
                     >
                        {/* Category icon */}
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

                        {/* Concepto + categoría + plataforma */}
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-medium text-white truncate">
                              {mov.concepto}
                           </p>
                           <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                              <span className="text-xs text-text-muted">
                                 {mov.categoria?.nombre}
                              </span>
                              {mov.plataforma && (
                                 <span className="text-[10px] font-medium text-text-muted border border-border-strong rounded-full px-1.5 py-px leading-none shrink-0">
                                    {mov.plataforma.nombre}
                                 </span>
                              )}
                           </div>
                        </div>

                        {/* Monto + fecha */}
                        <div className="flex flex-col items-end gap-0.5 shrink-0">
                           <span
                              className={cn(
                                 'font-heading text-sm font-bold tabular-nums',
                                 mov.tipo === 'INGRESO' ? 'text-accent' : 'text-danger'
                              )}
                           >
                              {mov.tipo === 'INGRESO' ? '+' : '-'}
                              {formatCurrency(mov.monto)}
                           </span>
                           <span className="text-[10px] text-text-muted tabular-nums">
                              {format(new Date(mov.fecha), 'd MMM', { locale: es })}
                           </span>
                        </div>

                        {/* Delete — 40×40px hit area */}
                        <button
                           onClick={() => setConfirmId(mov.id)}
                           className="w-10 h-10 rounded-sm border-none bg-transparent text-text-muted flex items-center justify-center shrink-0 opacity-40 hover:opacity-100 hover:text-danger transition-[opacity,color] duration-150 active:scale-[0.96]"
                        >
                           <Trash2 size={14} />
                        </button>
                     </div>
                  ))}
               </div>
            )}
         </div>

         <AlertDialog
            open={confirmId !== null}
            onCancel={() => setConfirmId(null)}
            onConfirm={handleDeleteConfirm}
            title="¿Eliminar movimiento?"
            description="Esta acción no se puede deshacer."
            confirmLabel="Eliminar"
            confirmVariant="danger"
         />
      </>
   )
}
