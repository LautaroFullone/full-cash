import type { Movimiento } from '@/modules/movements/services/getMovimientos'
import { TimelineDayGroup } from './TimelineDayGroup'
import { groupByDay } from '../utils/groupByDay'
import { Inbox } from 'lucide-react'
import { useMemo } from 'react'

interface MovementTimelineProps {
   movimientos: Movimiento[]
   onEdit: (mov: Movimiento) => void
}

export const MovementTimeline: React.FC<MovementTimelineProps> = ({
   movimientos,
   onEdit,
}) => {
   // groupByDay devuelve ascendente; en el feed mostramos el día más reciente primero.
   const dias = useMemo(() => groupByDay(movimientos).reverse(), [movimientos])

   return (
      <div>
         <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold">Movimientos</h3>
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
            <div className="flex flex-col">
               {dias.map((bucket) => (
                  <TimelineDayGroup
                     key={bucket.key}
                     bucket={bucket}
                     onEditClick={onEdit}
                  />
               ))}
            </div>
         )}
      </div>
   )
}
