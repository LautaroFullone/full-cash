import { useState } from 'react'
import {
   format,
   startOfMonth,
   endOfMonth,
   startOfWeek,
   endOfWeek,
   addDays,
   isSameDay,
   isSameMonth,
   addMonths,
   subMonths,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

interface DatePickerProps {
   value: string
   onChange: (value: string) => void
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
   const [open, setOpen] = useState(false)
   const selected = value ? new Date(value + 'T12:00:00') : null
   const [viewMonth, setViewMonth] = useState(selected ?? new Date())

   const displayLabel = selected
      ? format(selected, "d 'de' MMMM, yyyy", { locale: es })
      : 'Seleccionar fecha'

   const monthStart = startOfMonth(viewMonth)
   const monthEnd = endOfMonth(viewMonth)
   const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
   const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

   const days: Date[] = []
   let cur = calStart
   while (cur <= calEnd) {
      days.push(cur)
      cur = addDays(cur, 1)
   }

   const today = new Date()
   const WEEKDAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']

   const handleDayClick = (day: Date) => {
      onChange(format(day, 'yyyy-MM-dd'))
      setOpen(false)
   }

   return (
      <div
         className={cn(
            'rounded-md border bg-background transition-[border-color,box-shadow] duration-200',
            open
               ? 'border-accent shadow-[0_0_0_3px_rgba(229,255,166,0.1)]'
               : 'border-border-strong'
         )}
      >
         {/* Trigger */}
         <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-full flex items-center gap-2.5 py-2.5 px-3.5 text-white text-sm font-body cursor-pointer text-left bg-transparent border-none rounded-md active:scale-[0.99] transition-transform duration-100"
         >
            <CalendarDays
               size={16}
               className={cn('shrink-0 transition-colors duration-200', open ? 'text-accent' : 'text-text-muted')}
            />
            <span className="flex-1 capitalize">{displayLabel}</span>
            <ChevronDown
               size={14}
               className={cn(
                  'text-text-muted transition-transform duration-200',
                  open && 'rotate-180 text-accent'
               )}
            />
         </button>

         {/* Inline calendar — CSS grid-rows trick: 0fr → 1fr, no position:absolute */}
         <div
            className={cn(
               'grid transition-[grid-template-rows] duration-300 ease-out',
               open ? '[grid-template-rows:1fr]' : '[grid-template-rows:0fr]'
            )}
         >
            <div className="overflow-hidden">
               <div className="px-4 pb-4">
                  <div className="h-px bg-border-strong mb-3" />

                  {/* Month navigation */}
                  <div className="flex items-center justify-between mb-3">
                     <button
                        type="button"
                        onClick={() => setViewMonth((m) => subMonths(m, 1))}
                        className="w-9 h-9 border border-border-strong rounded-sm bg-transparent text-text-muted flex items-center justify-center cursor-pointer hover:text-white transition-colors active:scale-[0.96]"
                     >
                        <ChevronLeft size={14} />
                     </button>
                     <span className="font-heading font-bold text-sm capitalize">
                        {format(viewMonth, 'MMMM yyyy', { locale: es })}
                     </span>
                     <button
                        type="button"
                        onClick={() => setViewMonth((m) => addMonths(m, 1))}
                        className="w-9 h-9 border border-border-strong rounded-sm bg-transparent text-text-muted flex items-center justify-center cursor-pointer hover:text-white transition-colors active:scale-[0.96]"
                     >
                        <ChevronRight size={14} />
                     </button>
                  </div>

                  {/* Weekday headers */}
                  <div className="grid grid-cols-7 gap-0.5 mb-1">
                     {WEEKDAYS.map((d) => (
                        <div
                           key={d}
                           className="text-center text-[10px] font-bold text-text-muted py-1 uppercase"
                        >
                           {d}
                        </div>
                     ))}
                  </div>

                  {/* Day grid */}
                  <div className="grid grid-cols-7 gap-0.5">
                     {days.map((day, i) => {
                        const isSelected = selected && isSameDay(day, selected)
                        const isToday = isSameDay(day, today)
                        const isCurrentMonth = isSameMonth(day, viewMonth)
                        return (
                           <button
                              key={i}
                              type="button"
                              onClick={() => handleDayClick(day)}
                              className={cn(
                                 'w-full aspect-square rounded-sm border flex items-center justify-center text-[13px] font-body cursor-pointer transition-colors duration-100 active:scale-[0.9]',
                                 isSelected
                                    ? 'bg-accent text-[#003a34] border-transparent font-bold'
                                    : isToday
                                      ? 'border-border-strong text-accent font-bold bg-transparent hover:bg-white/6'
                                      : 'border-transparent hover:bg-white/6',
                                 !isSelected && (isCurrentMonth ? 'text-text-secondary' : 'text-text-muted opacity-30')
                              )}
                           >
                              {format(day, 'd')}
                           </button>
                        )
                     })}
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}
