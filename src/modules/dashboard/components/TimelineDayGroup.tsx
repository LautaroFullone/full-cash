import type { Movimiento } from '@/modules/movements/services/getMovimientos'
import type { DayBucket } from '../utils/groupByDay'
import { TimelineRow } from './TimelineRow'
import { es } from 'date-fns/locale'
import { format } from 'date-fns'

interface TimelineDayGroupProps {
   bucket: DayBucket
   onEditClick: (mov: Movimiento) => void
}

export const TimelineDayGroup: React.FC<TimelineDayGroupProps> = ({
   bucket,
   onEditClick,
}) => {
   const label = format(bucket.date, 'EEEE d', { locale: es })
   const dayLabel = label.charAt(0).toUpperCase() + label.slice(1)

   return (
      <div>
         <div className="flex items-center gap-2 pt-2 pb-1">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-[0.5px]">
               {dayLabel}
            </span>
         </div>

         <div className="flex flex-col">
            {bucket.items.map((mov) => (
               <TimelineRow key={mov.id} mov={mov} onEditClick={onEditClick} />
            ))}
         </div>
      </div>
   )
}
