import { cn } from '@/utils/cn'

interface SummaryChipProps {
   label: string
   value: string
   icon: React.ReactNode
   tone: 'accent' | 'danger'
   onClick: () => void
}

export const SummaryChip: React.FC<SummaryChipProps> = ({
   label,
   value,
   icon,
   tone,
   onClick,
}) => (
   <button
      type="button"
      onClick={onClick}
      className={cn(
         'flex items-center justify-center gap-2.5 flex-1 px-2 py-4 rounded-md bg-surface-elevated transition-[background-color,box-shadow]',
         tone === 'accent'
            ? 'hover:shadow-[inset_0_0_0_1px_var(--color-accent-dim)]'
            : 'hover:shadow-[inset_0_0_0_1px_var(--color-danger-dim)]'
      )}
   >
      <div
         className={cn(
            'w-7 h-7 rounded-sm flex items-center justify-center shrink-0',
            tone === 'accent' ? 'bg-accent/15 text-accent' : 'bg-danger/15 text-danger'
         )}
      >
         {icon}
      </div>

      <div className="min-w-0">
         <p className="text-[10px] font-semibold text-text-muted uppercase tracking-[0.5px] leading-tight">
            {label}
         </p>
         <p
            className={cn(
               'font-heading text-base font-bold tracking-[-0.3px] tabular-nums leading-tight',
               tone === 'accent' ? 'text-accent' : 'text-danger'
            )}
         >
            {value}
         </p>
      </div>
   </button>
)
