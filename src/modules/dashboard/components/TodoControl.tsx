import { cn } from '@/utils/cn'

interface TodoControlProps {
   active: boolean
   onClick: () => void
}

export const TodoControl: React.FC<TodoControlProps> = ({ active, onClick }) => (
   <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
         'flex items-center justify-center w-full h-9 rounded-t-md text-xs font-semibold uppercase tracking-[0.5px] transition-colors',
         active
            ? 'bg-surface-elevated text-text-primary shadow-[inset_0_2px_0_0_var(--color-text-secondary)]'
            : 'bg-surface text-text-muted hover:text-text-primary'
      )}
   >
      General
   </button>
)
