import { Trash2, Inbox, ChevronRight, MoreHorizontal, Pencil, X } from 'lucide-react'
import { CategoryIcon } from '@/modules/categories/components/CategoryIcon'
import type { Movimiento } from '../services/getMovimientos'
import type { TipoMovimiento } from '@/models/categoria'
import { getCategoryColor } from '@/models/categoria'
import { formatCurrency } from '@/utils/formatCurrency'
import { AlertDialog } from '@/components/AlertDialog'
import { toast } from '@/components/Toaster'
import { useState, useMemo, useRef } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/utils/cn'

interface MovementListProps {
   movimientos: Movimiento[]
   onDelete: (id: string) => Promise<unknown> | void
   onEdit: (mov: Movimiento) => void
   tipo?: TipoMovimiento
   bare?: boolean
   actionVariant?: 'sheet' | 'inline'
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
   isLast: boolean
   deletingId: string | null
   actionVariant: 'sheet' | 'inline'
   isRevealed: boolean
   onReveal: (id: string | null) => void
   onDeleteClick: (id: string) => void
   onEditClick: (mov: Movimiento) => void
   onShowSheet: (mov: Movimiento) => void
}

const MovementRow: React.FC<MovementRowProps> = ({
   mov,
   color,
   isLast,
   deletingId,
   actionVariant,
   isRevealed,
   onReveal,
   onDeleteClick,
   onEditClick,
   onShowSheet,
}) => (
   <div className="relative">
      <div
         className={cn(
            'absolute left-[-13px] top-0 w-[1.5px]',
            isLast ? 'bottom-1/2' : 'bottom-0'
         )}
         style={{ backgroundColor: `${color}40` }}
      />

      <div
         className={cn(
            'relative flex items-center pl-1.5 py-2 gap-2 rounded-r-sm transition-colors duration-150 hover:bg-white/3',
            deletingId === mov.id && 'opacity-40 pointer-events-none'
         )}
      >
         <div
            className="absolute -left-3 top-1/2 w-2.5 h-px rounded-full"
            style={{ backgroundColor: `${color}90` }}
         />

         <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-white line-clamp-2">
               {mov.concepto}
            </p>
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
                  'font-heading text-[13px] font-semibold tabular-nums',
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

         {actionVariant === 'inline' && isRevealed ? (
            <div className="flex items-center gap-0.5 shrink-0 animate-fade-in">
               <button
                  onClick={() => {
                     onReveal(null)
                     onEditClick(mov)
                  }}
                  className="w-7.5 h-7.5 rounded-xs border-none bg-transparent text-text-muted flex items-center justify-center cursor-pointer hover:bg-white/8 hover:text-white transition-colors duration-150"
               >
                  <Pencil size={12} />
               </button>
               <button
                  onClick={() => {
                     onReveal(null)
                     onDeleteClick(mov.id)
                  }}
                  className="w-7.5 h-7.5 rounded-xs border-none bg-transparent text-text-muted flex items-center justify-center cursor-pointer hover:bg-danger/10 hover:text-danger transition-colors duration-150"
               >
                  <Trash2 size={12} />
               </button>
               <button
                  onClick={() => onReveal(null)}
                  className="w-7.5 h-7.5 rounded-xs border-none bg-transparent text-text-muted flex items-center justify-center cursor-pointer hover:bg-white/5 hover:text-text-secondary transition-colors duration-150"
               >
                  <X size={12} />
               </button>
            </div>
         ) : (
            <button
               onClick={
                  actionVariant === 'sheet'
                     ? () => onShowSheet(mov)
                     : () => onReveal(mov.id)
               }
               className="w-8 h-8 rounded-sm border-none bg-transparent text-text-muted flex items-center justify-center shrink-0 opacity-30 hover:opacity-100 transition-opacity duration-150"
            >
               <MoreHorizontal size={14} />
            </button>
         )}
      </div>
   </div>
)

interface CategoryGroupRowProps {
   grupo: Grupo
   tipo: TipoMovimiento | undefined
   isExpanded: boolean
   onToggle: () => void
   deletingId: string | null
   actionVariant: 'sheet' | 'inline'
   revealedId: string | null
   onReveal: (id: string | null) => void
   onDeleteClick: (id: string) => void
   onEditClick: (mov: Movimiento) => void
   onShowSheet: (mov: Movimiento) => void
}

const CategoryGroupRow: React.FC<CategoryGroupRowProps> = ({
   grupo,
   tipo,
   isExpanded,
   onToggle,
   deletingId,
   actionVariant,
   revealedId,
   onReveal,
   onDeleteClick,
   onEditClick,
   onShowSheet,
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
                  <div className="pl-3 flex flex-col">
                     {grupo.items.map((mov, index) => (
                        <MovementRow
                           key={mov.id}
                           mov={mov}
                           color={color}
                           isLast={index === grupo.items.length - 1}
                           deletingId={deletingId}
                           actionVariant={actionVariant}
                           isRevealed={revealedId === mov.id}
                           onReveal={onReveal}
                           onDeleteClick={onDeleteClick}
                           onEditClick={onEditClick}
                           onShowSheet={onShowSheet}
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
   onEdit,
   tipo,
   bare = false,
   actionVariant = 'sheet',
}) => {
   const [confirmId, setConfirmId] = useState<string | null>(null)
   const [deletingId, setDeletingId] = useState<string | null>(null)
   const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
   const [revealedId, setRevealedId] = useState<string | null>(null)

   // Action sheet state (used by 'sheet' variant)
   const [sheetMov, setSheetMov] = useState<Movimiento | null>(null)
   const [sheetMounted, setSheetMounted] = useState(false)
   const [sheetClosing, setSheetClosing] = useState(false)
   const sheetTimerRef = useRef<ReturnType<typeof setTimeout>>()

   const openSheet = (mov: Movimiento) => {
      clearTimeout(sheetTimerRef.current)
      setSheetMov(mov)
      setSheetMounted(true)
      setSheetClosing(false)
   }

   const closeSheet = () => {
      setSheetClosing(true)
      sheetTimerRef.current = setTimeout(() => {
         setSheetMounted(false)
         setSheetClosing(false)
      }, 250)
   }

   const handleSheetEdit = () => {
      const mov = sheetMov
      closeSheet()
      if (mov) onEdit(mov)
   }

   const handleSheetDelete = () => {
      const id = sheetMov?.id
      closeSheet()
      if (id) setConfirmId(id)
   }

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
                        actionVariant={actionVariant}
                        revealedId={revealedId}
                        onReveal={setRevealedId}
                        onDeleteClick={setConfirmId}
                        onEditClick={onEdit}
                        onShowSheet={openSheet}
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

         {/* Action sheet — 'sheet' variant */}
         {sheetMounted && (
            <div
               className={cn(
                  'modal-overlay fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center',
                  sheetClosing ? 'animate-overlay-out' : 'animate-overlay-in'
               )}
               onClick={closeSheet}
            >
               <div
                  className={cn(
                     'modal-sheet bg-surface',
                     sheetClosing ? 'animate-slide-down' : 'animate-slide-up'
                  )}
                  style={{ paddingBottom: '12px' }}
                  onClick={(e) => e.stopPropagation()}
               >
                  <div className="w-10 h-1 rounded-full bg-border-strong mx-auto mt-3 mb-4" />

                  {sheetMov && (
                     <div className="px-5 pb-3 border-b border-border-strong mb-1">
                        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.6px] mb-0.5">
                           {sheetMov.categoria?.nombre ?? '—'}
                        </p>
                        <p className="text-sm font-medium text-white line-clamp-1">
                           {sheetMov.concepto}
                        </p>
                        <p
                           className={cn(
                              'font-heading text-base font-bold tabular-nums mt-0.5',
                              sheetMov.tipo === 'INGRESO' ? 'text-accent' : 'text-danger'
                           )}
                        >
                           {sheetMov.tipo === 'INGRESO' ? '+' : '-'}
                           {formatCurrency(sheetMov.monto)}
                        </p>
                     </div>
                  )}

                  <div className="px-3 flex flex-col gap-0.5">
                     <button
                        onClick={handleSheetEdit}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-md bg-transparent border-none text-left cursor-pointer hover:bg-white/5 transition-colors duration-150"
                     >
                        <Pencil size={16} className="text-text-muted shrink-0" />
                        <span className="text-sm font-medium text-white">
                           Editar movimiento
                        </span>
                     </button>
                     <button
                        onClick={handleSheetDelete}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-md bg-transparent border-none text-left cursor-pointer hover:bg-danger/10 transition-colors duration-150"
                     >
                        <Trash2 size={16} className="text-danger shrink-0" />
                        <span className="text-sm font-medium text-danger">Eliminar</span>
                     </button>
                  </div>

                  <div className="px-3 mt-1 pt-2 border-t border-border-strong">
                     <button
                        onClick={closeSheet}
                        className="w-full py-3 rounded-md bg-transparent border-none text-sm font-medium text-text-muted cursor-pointer hover:text-white transition-colors duration-150"
                     >
                        Cancelar
                     </button>
                  </div>
               </div>
            </div>
         )}
      </>
   )
}
