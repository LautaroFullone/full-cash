import { cn } from '@/utils/cn'

interface FolderTabProps {
   label: string
   value: string
   icon: React.ReactNode
   accentClass: string
   bubbleClass: string
   iconBgClass: string
   active: boolean
   side: 'left' | 'right' | 'both'
   onClick: () => void
}

export const FolderTab: React.FC<FolderTabProps> = ({
   label,
   value,
   icon,
   accentClass,
   bubbleClass,
   iconBgClass,
   active,
   side,
   onClick,
}) => (
   <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      data-active={active}
      data-side={side}
      className="folder-tab px-2 py-5"
   >
      <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none">
         <div
            className={cn(
               'absolute -top-2.5 -right-2.5 w-[60px] h-[60px] rounded-full',
               bubbleClass
            )}
         />
      </div>

      <div className="relative flex items-center gap-2 mb-3 mx-2">
         <div
            className={cn(
               'w-8 h-8 rounded-sm flex items-center justify-center',
               iconBgClass,
               accentClass
            )}
         >
            {icon}
         </div>

         <span className="text-xs font-semibold text-text-muted uppercase tracking-[0.5px]">
            {label}
         </span>
      </div>

      <p
         className={cn(
            'relative font-heading text-2xl lg:text-3xl font-bold tracking-[-0.5px] tabular-nums text-center',
            accentClass
         )}
      >
         {value}
      </p>
   </button>
)
