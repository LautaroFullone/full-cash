import { CategoryIcon } from '@/modules/categories/components/CategoryIcon'
import { getCategoryColor } from '@/models/categoria'
import type { Movimiento } from '../services/getMovimientos'
import type { TipoMovimiento } from '@/models/categoria'
import { AlertDialog } from '@/components/AlertDialog'
import { formatCurrency } from '@/utils/formatCurrency'
import { toast } from '@/components/Toaster'
import { Trash2, Inbox, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useState, useMemo } from 'react'
import { cn } from '@/utils/cn'

interface MovementListProps {
   movimientos: Movimiento[]
   onDelete: (id: string) => Promise<unknown> | void
   tipo?: TipoMovimiento
   bare?: boolean
}

type Grupo = {
   categoriaId: string
   nombre: string
   icono: string
   total: number
   porcentaje: number
   items: Movimiento[]
}

interface MovementRowProps {
   mov: Movimiento
   color: string
   deletingId: string | null
   onDeleteClick: (id: string) => void
}

const MovementRow: React.FC<MovementRowProps> = ({
   mov,
   color,
   deletingId,
   onDeleteClick,
}) => (
   <div
      className={cn(
         'relative flex items-center py-2 gap-2 rounded-r-sm transition-colors duration-150 hover:bg-white/3',
         deletingId === mov.id && 'opacity-40 pointer-events-none'
      )}
   >
      {/* Conector horizontal ─ que parte del hilo vertical */}
      <div
         className="absolute -left-3 top-1/2 w-2.5 h-px rounded-full"
         style={{ backgroundColor: `${color}90` }}
      />

      <div className="flex-1 min-w-0">
         <p className="text-[13px] font-medium text-white truncate">{mov.concepto}</p>
         {mov.plataforma && (
            <div className="flex items-center mt-0.5">
               <span className="text-[10px] font-medium text-text-muted border border-border-strong rounded-full px-1.5 py-px leading-none">
                  {mov.plataforma.nombre}
               </span>
            </div>
         )}
      </div>

      <div className="flex flex-col items-end gap-0 shrink-0">
         <span
            className={cn(
               'font-heading text-[13px] font-bold tabular-nums',
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

      <button
         onClick={() => onDeleteClick(mov.id)}
         className="w-8 h-8 rounded-sm border-none bg-transparent text-text-muted flex items-center justify-center shrink-0 opacity-30 hover:opacity-100 hover:text-danger transition-[opacity,color] duration-150 active:scale-[0.96]"
      >
         <Trash2 size={13} />
      </button>
   </div>
)

interface CategoryGroupRowProps {
   grupo: Grupo
   tipo: TipoMovimiento | undefined
   isExpanded: boolean
   onToggle: () => void
   deletingId: string | null
   onDeleteClick: (id: string) => void
}

const CategoryGroupRow: React.FC<CategoryGroupRowProps> = ({
   grupo,
   tipo,
   isExpanded,
   onToggle,
   deletingId,
   onDeleteClick,
}) => {
   const color = getCategoryColor(grupo.categoriaId)
   return (
      <div>
         <button
            type="button"
            onClick={onToggle}
            className="w-full flex items-center py-2 gap-3 rounded-md hover:bg-white/3 transition-colors duration-150 cursor-pointer"
         >
            <div className="w-9.5 h-9.5 rounded-sm shrink-0 flex items-center justify-center bg-white/5">
               <CategoryIcon icono={grupo.icono} size={18} />
            </div>

            <div className="flex-1 min-w-0 text-left">
               <div className="flex items-center gap-1.5">
                  <span
                     className="w-2 h-2 rounded-full shrink-0"
                     style={{ backgroundColor: color }}
                  />
                  <p className="text-sm font-medium text-white">{grupo.nombre}</p>
               </div>
               <p className="text-xs text-text-muted tabular-nums">
                  {grupo.porcentaje >= 1
                     ? `${Math.round(grupo.porcentaje)}%`
                     : `${grupo.porcentaje.toFixed(1)}%`}
               </p>
            </div>

            <span
               className={cn(
                  'font-heading text-sm font-bold tabular-nums shrink-0',
                  tipo === 'INGRESO' ? 'text-accent' : 'text-danger'
               )}
            >
               {tipo === 'INGRESO' ? '+' : '-'}
               {formatCurrency(grupo.total)}
            </span>

            <ChevronRight
               size={16}
               className={cn(
                  'text-text-muted shrink-0 transition-transform duration-200',
                  isExpanded && 'rotate-90'
               )}
            />
         </button>

         <div
            className={cn(
               'grid transition-[grid-template-rows] duration-300 ease-out',
               isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            )}
         >
            <div className="overflow-hidden">
               <div className="px-3 pb-3">
                  <div
                     className="pl-3 flex flex-col border-l-[1.5px]"
                     style={{ borderColor: `${color}40` }}
                  >
                     {grupo.items.map((mov) => (
                        <MovementRow
                           key={mov.id}
                           mov={mov}
                           color={color}
                           deletingId={deletingId}
                           onDeleteClick={onDeleteClick}
                        />
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export const MovementList: React.FC<MovementListProps> = ({
   movimientos,
   onDelete,
   tipo,
   bare = false,
}) => {
   const [confirmId, setConfirmId] = useState<string | null>(null)
   const [deletingId, setDeletingId] = useState<string | null>(null)
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
         { nombre: string; icono: string; total: number; items: Movimiento[] }
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
            total: data.total,
            porcentaje: grandTotal > 0 ? (data.total / grandTotal) * 100 : 0,
            items: data.items.sort(
               (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
            ),
         }))
         .sort((a, b) => b.total - a.total)
   }, [movimientos])

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

   const heading =
      tipo === 'INGRESO' ? 'Ingresos' : tipo === 'EGRESO' ? 'Gastos' : 'Movimientos'

   const wrapperClass = bare
      ? ''
      : 'card animate-slide-up p-5 [animation-delay:0.4s] [animation-fill-mode:backwards]'

   return (
      <>
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
                        tipo={tipo}
                        isExpanded={expandedIds.has(grupo.categoriaId)}
                        onToggle={() => toggle(grupo.categoriaId)}
                        deletingId={deletingId}
                        onDeleteClick={setConfirmId}
                     />
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
