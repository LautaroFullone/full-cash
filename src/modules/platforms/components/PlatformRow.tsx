import type { Plataforma } from '@/models/plataforma'
import { CreditCard, Trash2 } from 'lucide-react'
import { cn } from '@/utils/cn'

interface PlatformRowProps {
   plataforma: Plataforma
   isDeleting: boolean
   onDelete: (plataforma: Plataforma) => void
}

export const PlatformRow: React.FC<PlatformRowProps> = ({
   plataforma,
   isDeleting,
   onDelete,
}) => (
   <div
      className={cn(
         'flex items-center gap-3 px-4 py-3 rounded-lg bg-background border border-border transition-opacity',
         isDeleting && 'opacity-40'
      )}
   >
      <div className="w-9 h-9 rounded-lg bg-surface-elevated flex items-center justify-center shrink-0">
         <CreditCard size={16} className="text-text-muted" />
      </div>

      <span className="flex-1 text-sm font-medium text-white">{plataforma.nombre}</span>

      <button
         onClick={() => onDelete(plataforma)}
         disabled={isDeleting}
         className="w-8 h-8 flex items-center justify-center rounded-md text-text-muted hover:text-danger hover:bg-danger/10 transition-colors border-none bg-transparent cursor-pointer"
      >
         <Trash2 size={14} />
      </button>
   </div>
)
