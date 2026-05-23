import { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(value + 'T12:00:00') : null;
  const [viewMonth, setViewMonth] = useState(selected ?? new Date());

  const displayLabel = selected
    ? format(selected, "d 'de' MMMM, yyyy", { locale: es })
    : 'Seleccionar fecha';

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let cur = calStart;
  while (cur <= calEnd) { days.push(cur); cur = addDays(cur, 1); }

  const today = new Date();
  const WEEKDAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

  const handleDayClick = (day: Date) => {
    onChange(format(day, 'yyyy-MM-dd'));
    setOpen(false);
  };

  return (
    <>
      <div className="relative">
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className={cn(
            'w-full flex items-center gap-2.5 py-2.5 px-3.5 rounded-md border bg-background text-white text-sm font-body cursor-pointer text-left transition-all duration-200',
            open ? 'border-accent shadow-[0_0_0_3px_rgba(229,255,166,0.1)]' : 'border-border-strong'
          )}
        >
          <CalendarDays size={16} className={cn('shrink-0', open ? 'text-accent' : 'text-text-muted')} />
          <span className="flex-1 capitalize">{displayLabel}</span>
        </button>

        {/* Calendar popover */}
        {open && (
          <div
            className="absolute top-[calc(100%+8px)] left-0 right-0 z-[100] bg-surface rounded-lg border border-border-strong p-4 shadow-elevated"
            onClick={e => e.stopPropagation()}
          >
            {/* Month nav */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => setViewMonth(m => subMonths(m, 1))}
                className="w-7 h-7 border border-border-strong rounded-xs bg-transparent text-text-muted flex items-center justify-center cursor-pointer hover:text-white transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="font-heading font-bold text-sm capitalize">
                {format(viewMonth, 'MMMM yyyy', { locale: es })}
              </span>
              <button
                type="button"
                onClick={() => setViewMonth(m => addMonths(m, 1))}
                className="w-7 h-7 border border-border-strong rounded-xs bg-transparent text-text-muted flex items-center justify-center cursor-pointer hover:text-white transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {WEEKDAYS.map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-text-muted py-1 uppercase">
                  {d}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {days.map((day, i) => {
                const isSelected = selected && isSameDay(day, selected);
                const isToday = isSameDay(day, today);
                const isCurrentMonth = isSameMonth(day, viewMonth);

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      'w-full aspect-square rounded-sm border flex items-center justify-center text-[13px] font-body cursor-pointer transition-all duration-100',
                      isSelected ? 'bg-accent text-[#003a34] border-transparent font-bold'
                        : isToday ? 'border-border-strong text-accent font-bold bg-transparent hover:bg-white/[6%]'
                          : 'border-transparent hover:bg-white/[6%]',
                      isSelected ? '' : isCurrentMonth ? 'text-text-secondary' : 'text-text-muted opacity-30'
                    )}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-[99]" onClick={() => setOpen(false)} />
      )}
    </>
  );
}
