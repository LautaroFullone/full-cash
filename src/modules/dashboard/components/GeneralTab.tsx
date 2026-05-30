import { Layers } from 'lucide-react'
import { cn } from '@/utils/cn'

interface GeneralTabProps {
   active: boolean
   onClick: () => void
}

export const GeneralTab: React.FC<GeneralTabProps> = ({ active, onClick }) => (
   <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
         'relative flex items-center justify-center gap-2 w-full px-5 py-4 transition-[background-color,box-shadow,color,transform] duration-300 active:scale-[0.99] focus-visible:outline-offset-2 focus-visible:[outline:2px_solid_var(--color-accent)]',
         active
            ? 'rounded-t-lg bg-[var(--folder-bg)] text-text-primary shadow-[inset_0_2px_0_0_var(--folder-accent)]'
            : 'rounded-md bg-surface text-text-muted hover:bg-surface-elevated hover:text-text-primary'
      )}
   >
      <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none">
         <div className="absolute -top-2.5 -right-2.5 w-[60px] h-[60px] rounded-full bg-white/[0.06]" />
      </div>

      <div
         className={cn(
            'relative w-8 h-8 rounded-sm flex items-center justify-center transition-colors',
            active ? 'bg-white/8 text-text-secondary' : 'bg-white/5 text-text-muted'
         )}
      >
         <Layers size={16} />
      </div>

      <span className="relative text-xs font-semibold uppercase tracking-[0.5px]">
         General
      </span>
   </button>
)
