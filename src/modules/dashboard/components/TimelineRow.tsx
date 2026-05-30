import type { Movimiento } from '@/modules/movements/services/getMovimientos'
import { CategoryIcon } from '@/modules/categories/components/CategoryIcon'
import { getCategoryColor } from '@/models/categoria'
import { formatCurrency } from '@/utils'
import { cn } from '@/utils/cn'

interface TimelineRowProps {
   mov: Movimiento
   onEditClick: (mov: Movimiento) => void
}

export const TimelineRow: React.FC<TimelineRowProps> = ({ mov, onEditClick }) => {
   const color = getCategoryColor(mov.categoria?.colorIndex)
   const hasConcepto = !!mov.concepto?.trim()
   const title = hasConcepto ? mov.concepto : (mov.categoria?.nombre ?? '—')

   return (
      <button
         type="button"
         onClick={() => onEditClick(mov)}
         className="flex w-full items-center py-2 gap-3 rounded-md text-left transition-colors duration-150 hover:bg-white/3 active:bg-white/8"
      >
         <div className="w-9.5 h-9.5 rounded-sm shrink-0 flex items-center justify-center bg-white/5">
            <CategoryIcon icono={mov.categoria?.icono ?? '💰'} size={18} />
         </div>

         <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
               <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
               />
               <p className="text-sm font-medium text-white truncate">{title}</p>
            </div>

            <div className="flex items-center gap-1.5 mt-0.5">
               {hasConcepto && (
                  <span className="text-xs text-text-muted truncate">
                     {mov.categoria?.nombre ?? '—'}
                  </span>
               )}
               {mov.plataforma && (
                  <span className="text-xs font-medium text-text-muted border border-border-strong rounded-full px-1.5 py-px leading-none shrink-0">
                     {mov.plataforma.nombre}
                  </span>
               )}
            </div>
         </div>

         <span
            className={cn(
               'font-heading text-sm font-semibold tabular-nums shrink-0',
               mov.tipo === 'INGRESO' ? 'text-accent' : 'text-danger'
            )}
         >
            {mov.tipo === 'INGRESO' ? '+' : '-'}
            {formatCurrency(mov.monto)}
         </span>
      </button>
   )
}
