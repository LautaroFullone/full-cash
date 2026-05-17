import { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(value + 'T12:00:00') : null;
  const [viewMonth, setViewMonth] = useState(selected ?? new Date());

  const displayLabel = selected
    ? format(selected, "d 'de' MMMM, yyyy", { locale: es })
    : 'Seleccionar fecha';

  // Build calendar grid
  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let cur = calStart;
  while (cur <= calEnd) {
    days.push(cur);
    cur = addDays(cur, 1);
  }

  const today = new Date();

  const handleDayClick = (day: Date) => {
    onChange(format(day, 'yyyy-MM-dd'));
    setOpen(false);
  };

  const WEEKDAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

  return (
    <>
      <div style={{ position: 'relative' }}>
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', borderRadius: 'var(--radius-md)',
            border: `1px solid ${open ? 'var(--color-accent)' : 'var(--color-border-strong)'}`,
            background: 'var(--color-background)', color: 'var(--color-text-primary)',
            fontSize: '14px', fontFamily: 'var(--font-body)', cursor: 'pointer',
            textAlign: 'left', transition: 'border-color 0.2s ease',
            boxShadow: open ? '0 0 0 3px rgba(229,255,166,0.1)' : 'none',
          }}
        >
          <CalendarDays size={16} color={open ? 'var(--color-accent)' : 'var(--color-text-muted)'} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1, textTransform: 'capitalize' }}>{displayLabel}</span>
        </button>

        {/* Calendar Popover */}
        {open && (
          <div
            style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 100,
              background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-strong)', padding: '16px',
              boxShadow: 'var(--shadow-elevated)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Month Nav */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <button
                type="button"
                onClick={() => setViewMonth(m => subMonths(m, 1))}
                style={{ width: '28px', height: '28px', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-xs)', background: 'transparent', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ChevronLeft size={14} />
              </button>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '14px', textTransform: 'capitalize' }}>
                {format(viewMonth, 'MMMM yyyy', { locale: es })}
              </span>
              <button
                type="button"
                onClick={() => setViewMonth(m => addMonths(m, 1))}
                style={{ width: '28px', height: '28px', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-xs)', background: 'transparent', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Weekday headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
              {WEEKDAYS.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: '10px', fontWeight: 700, color: 'var(--color-text-muted)', padding: '4px 0', textTransform: 'uppercase' }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
              {days.map((day, i) => {
                const isSelected = selected && isSameDay(day, selected);
                const isToday = isSameDay(day, today);
                const isCurrentMonth = isSameMonth(day, viewMonth);

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleDayClick(day)}
                    style={{
                      width: '100%', aspectRatio: '1', borderRadius: 'var(--radius-sm)',
                      border: isToday && !isSelected ? '1px solid var(--color-border-strong)' : '1px solid transparent',
                      background: isSelected ? 'var(--color-accent)' : 'transparent',
                      color: isSelected
                        ? '#003a34'
                        : isToday
                          ? 'var(--color-accent)'
                          : isCurrentMonth
                            ? 'var(--color-text-secondary)'
                            : 'var(--color-text-muted)',
                      fontSize: '13px',
                      fontFamily: 'var(--font-body)',
                      fontWeight: isSelected || isToday ? 700 : 400,
                      cursor: 'pointer',
                      opacity: isCurrentMonth ? 1 : 0.3,
                      transition: 'all 0.1s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Backdrop to close */}
      {open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 99 }}
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
