import { Check } from 'lucide-react'
import { cn } from '@/utils/cn'

interface PlatformOptionProps {
   id: string
   nombre: string
   isSelected: boolean
   onSelect: (id: string) => void
}

export const PlatformOption: React.FC<PlatformOptionProps> = ({
   id,
   nombre,
   isSelected,
   onSelect,
}) => (
   <button
      type="button"
      onClick={() => onSelect(id)}
      className={cn(
         'w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-body cursor-pointer border-none bg-transparent text-left transition-colors duration-100 active:scale-[0.98]',
         isSelected
            ? 'text-accent'
            : 'text-text-secondary hover:text-white hover:bg-white/4'
      )}
   >
      <span className="w-4 shrink-0 flex items-center justify-center">
         {isSelected && <Check size={13} className="text-accent" />}
      </span>
      {nombre}
   </button>
)
