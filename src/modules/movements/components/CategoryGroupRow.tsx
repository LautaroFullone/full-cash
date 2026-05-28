import { CategoryIcon } from '@/modules/categories/components/CategoryIcon'
import { formatCurrency } from '@/utils/formatCurrency'
import { getCategoryColor } from '@/models/categoria'
import type { TipoMovimiento } from '@/models/categoria'
import type { Movimiento } from '../services/getMovimientos'
import { MovementRow } from './MovementRow'
import type { Grupo } from '../models/grupo'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

interface CategoryGroupRowProps {
   grupo: Grupo
   tipo: TipoMovimiento | undefined
   isExpanded: boolean
   onToggle: () => void
   onEditClick: (mov: Movimiento) => void
}

export const CategoryGroupRow: React.FC<CategoryGroupRowProps> = ({
   grupo,
   tipo,
   isExpanded,
   onToggle,
   onEditClick,
}) => {
   const color = getCategoryColor(grupo.colorIndex)
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
                  <p className="text-base font-medium text-white">{grupo.nombre}</p>
               </div>

               <p className="text-sm text-text-muted tabular-nums">
                  {grupo.porcentaje >= 1
                     ? `${Math.round(grupo.porcentaje)}%`
                     : `${grupo.porcentaje.toFixed(1)}%`}
               </p>
            </div>

            <span
               className={cn(
                  'font-heading text-base font-bold tabular-nums shrink-0',
                  tipo === 'INGRESO' ? 'text-accent' : 'text-danger'
               )}
            >
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
               <div className="pl-3 pr-1 pb-3">
                  <div className="pl-3 flex flex-col">
                     {grupo.items.map((mov, index) => (
                        <MovementRow
                           key={mov.id}
                           mov={mov}
                           color={color}
                           isLast={index === grupo.items.length - 1}
                           onEditClick={onEditClick}
                        />
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}
