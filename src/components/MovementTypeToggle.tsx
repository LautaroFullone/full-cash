import { MovementTypeOption } from './MovementTypeOption'
import type { TipoMovimiento } from '@/models/categoria'

interface MovementTypeToggleProps {
   value: TipoMovimiento
   onChange: (tipo: TipoMovimiento) => void
   variant?: 'solid' | 'soft'
   counts?: Record<TipoMovimiento, number>
}

const ORDER: Record<'solid' | 'soft', TipoMovimiento[]> = {
   solid: ['INGRESO', 'EGRESO'],
   soft: ['EGRESO', 'INGRESO'],
}

export const MovementTypeToggle: React.FC<MovementTypeToggleProps> = ({
   value,
   onChange,
   variant = 'solid',
   counts,
}) => {
   return (
      <div
         className={
            variant === 'solid'
               ? 'grid grid-cols-2 rounded-md overflow-hidden border border-border-strong'
               : 'flex gap-0.5 bg-background rounded-full p-0.75'
         }
      >
         {ORDER[variant].map((tipo) => (
            <MovementTypeOption
               key={tipo}
               tipo={tipo}
               variant={variant}
               isActive={value === tipo}
               count={counts?.[tipo]}
               onSelect={onChange}
            />
         ))}
      </div>
   )
}
