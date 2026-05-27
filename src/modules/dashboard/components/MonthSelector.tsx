import { MonthYearPicker } from './MonthYearPicker'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MonthSelectorProps {
   mes: number
   anio: number
   monthName: string
   onPrevMonth: () => void
   onNextMonth: () => void
   onSelectMonth: (mes: number, anio: number) => void
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
   mes,
   anio,
   monthName,
   onPrevMonth,
   onNextMonth,
   onSelectMonth,
}) => (
   <div className="flex items-center bg-surface border border-border rounded-full p-1.5">
      <button
         onClick={onPrevMonth}
         aria-label="Mes anterior"
         className="w-8 h-8 rounded-full border-none bg-background text-text-secondary flex items-center justify-center cursor-pointer hover:text-white transition-colors duration-200 shrink-0"
      >
         <ChevronLeft size={16} />
      </button>
      <MonthYearPicker
         mes={mes}
         anio={anio}
         monthName={monthName}
         onSelect={onSelectMonth}
      />
      <button
         onClick={onNextMonth}
         aria-label="Mes siguiente"
         className="w-8 h-8 rounded-full border-none bg-background text-text-secondary flex items-center justify-center cursor-pointer hover:text-white transition-colors duration-200 shrink-0"
      >
         <ChevronRight size={16} />
      </button>
   </div>
)
