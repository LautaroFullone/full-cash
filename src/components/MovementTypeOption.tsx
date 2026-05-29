import { TrendingUp, TrendingDown } from 'lucide-react'
import type { TipoMovimiento } from '@/models/categoria'
import { cn } from '@/utils/cn'

interface MovementTypeOptionProps {
   tipo: TipoMovimiento
   variant: 'solid' | 'soft'
   isActive: boolean
   count?: number
   onSelect: (tipo: TipoMovimiento) => void
}

export const MovementTypeOption: React.FC<MovementTypeOptionProps> = ({
   tipo,
   variant,
   isActive,
   count,
   onSelect,
}) => {
   const isIngreso = tipo === 'INGRESO'

   if (variant === 'solid') {
      return (
         <button
            type="button"
            onClick={() => onSelect(tipo)}
            className={cn(
               'flex items-center justify-center gap-2 py-3 border-none text-sm font-bold font-body cursor-pointer transition-colors duration-200 active:scale-[0.96]',
               isActive
                  ? isIngreso
                     ? 'bg-accent text-background-deep'
                     : 'bg-danger text-white'
                  : 'bg-background text-text-muted hover:text-text-secondary'
            )}
         >
            {isIngreso ? (
               <TrendingUp size={15} strokeWidth={2.5} />
            ) : (
               <TrendingDown size={15} strokeWidth={2.5} />
            )}
            {isIngreso ? 'Ingreso' : 'Gasto'}
         </button>
      )
   }

   const noun = isIngreso
      ? count !== undefined
         ? 'Ingresos'
         : 'Ingreso'
      : count !== undefined
        ? 'Gastos'
        : 'Gasto'

   return (
      <button
         type="button"
         onClick={() => onSelect(tipo)}
         className={cn(
            'flex-1 py-2 rounded-full border-none text-[13px] font-semibold font-body cursor-pointer transition-colors duration-200',
            isActive
               ? isIngreso
                  ? 'bg-accent/12 text-accent'
                  : 'bg-danger/15 text-danger'
               : 'bg-transparent text-text-muted'
         )}
      >
         {isIngreso ? '↑' : '↓'} {noun}
         {count !== undefined ? ` (${count})` : ''}
      </button>
   )
}
