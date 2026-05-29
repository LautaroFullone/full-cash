import { Lock, Pencil, Trash2 } from 'lucide-react'
import type { Categoria } from '@/models/categoria'
import { CategoryIcon } from './CategoryIcon'
import { cn } from '@/utils/cn'

interface CategoryRowProps {
   categoria: Categoria
   isDeleting: boolean
   onEdit: (categoria: Categoria) => void
   onDelete: (categoria: Categoria) => void
}

export const CategoryRow: React.FC<CategoryRowProps> = ({
   categoria,
   isDeleting,
   onEdit,
   onDelete,
}) => (
   <div
      className={cn(
         'flex items-center gap-3 px-4 py-3 rounded-lg bg-background border border-border transition-opacity',
         isDeleting && 'opacity-40'
      )}
   >
      <div className="w-9 h-9 rounded-lg bg-surface-elevated flex items-center justify-center shrink-0">
         <CategoryIcon icono={categoria.icono} size={18} />
      </div>

      <span className="flex-1 text-sm font-medium text-white">{categoria.nombre}</span>

      {categoria.isDefault ? (
         <div className="w-8 h-8 flex items-center justify-center text-text-muted/40">
            <Lock size={13} />
         </div>
      ) : categoria.userId === null ? (
         <button
            onClick={() => onDelete(categoria)}
            disabled={isDeleting}
            title="Ocultar de mi lista"
            className="w-8 h-8 flex items-center justify-center rounded-md text-text-muted hover:text-text-secondary hover:bg-white/8 transition-colors border-none bg-transparent cursor-pointer"
         >
            <Trash2 size={14} />
         </button>
      ) : (
         <div className="flex gap-1">
            <button
               onClick={() => onEdit(categoria)}
               disabled={isDeleting}
               className="w-8 h-8 flex items-center justify-center rounded-md text-text-muted hover:text-white hover:bg-white/8 transition-colors border-none bg-transparent cursor-pointer"
            >
               <Pencil size={14} />
            </button>

            <button
               onClick={() => onDelete(categoria)}
               disabled={isDeleting}
               className="w-8 h-8 flex items-center justify-center rounded-md text-text-muted hover:text-danger hover:bg-danger/10 transition-colors border-none bg-transparent cursor-pointer"
            >
               <Trash2 size={14} />
            </button>
         </div>
      )}
   </div>
)
