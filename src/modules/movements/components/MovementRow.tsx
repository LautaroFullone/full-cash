import { formatCurrency } from '@/utils/formatCurrency'
import type { Movimiento } from '../services/getMovimientos'
import { format } from 'date-fns'
import { SquarePen } from 'lucide-react'
import { es } from 'date-fns/locale'
import { cn } from '@/utils/cn'

interface MovementRowProps {
   mov: Movimiento
   color: string
   isLast: boolean
   onEditClick: (mov: Movimiento) => void
}

export const MovementRow: React.FC<MovementRowProps> = ({
   mov,
   color,
   isLast,
   onEditClick,
}) => (
   <div className="relative">
      <div
         className={cn(
            'absolute left-[-13px] top-0 w-[1.5px]',
            isLast ? 'bottom-1/2' : 'bottom-0'
         )}
         style={{ backgroundColor: `${color}40` }}
      />

      <div className="relative flex items-center pl-1.5 py-2 gap-2 rounded-r-sm transition-colors duration-150 hover:bg-white/3">
         <div
            className="absolute -left-3 top-1/2 w-2.5 h-px rounded-full"
            style={{ backgroundColor: `${color}90` }}
         />

         <div className="flex-1 min-w-0">
            {mov.concepto?.trim() ? (
               <p className="text-sm font-medium text-white line-clamp-2">
                  {mov.concepto}
               </p>
            ) : (
               <p className="text-sm text-text-muted">—</p>
            )}

            {mov.plataforma && (
               <div className="flex items-center mt-0.5">
                  <span className="text-xs font-medium text-text-muted border border-border-strong rounded-full px-1.5 py-px leading-none">
                     {mov.plataforma.nombre}
                  </span>
               </div>
            )}
         </div>

         <div className="flex flex-col items-end gap-0 shrink-0">
            <span
               className={cn(
                  'font-heading text-sm font-semibold tabular-nums',
                  mov.tipo === 'INGRESO' ? 'text-accent' : 'text-danger'
               )}
            >
               {formatCurrency(mov.monto)}
            </span>

            <span className="text-xs text-text-muted tabular-nums">
               {format(new Date(mov.fecha), 'd MMM', { locale: es })}
            </span>
         </div>

         <button
            onClick={() => onEditClick(mov)}
            className="w-10 h-10 rounded-sm border-none bg-transparent text-text-muted flex items-center justify-center shrink-0 hover:opacity-100 hover:bg-white/8 transition-[background-color,opacity] duration-150"
         >
            <SquarePen size={14} />
         </button>
      </div>
   </div>
)
