import { Tag } from 'lucide-react'
import { cn } from '@/utils/cn'

interface CategoryIconProps {
   icono: string
   size?: number
   className?: string
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
   icono,
   size = 20,
   className = '',
}) => {
   const isEmoji = icono && !/^[A-Z]/.test(icono)

   if (!isEmoji) {
      return (
         <Tag
            size={Math.round(size * 0.8)}
            className={cn('text-text-muted', className)}
            aria-label="category icon"
         />
      )
   }

   return (
      <span
         className={`inline-flex items-center leading-none ${className}`}
         style={{ fontSize: size }}
         role="img"
         aria-label="category icon"
      >
         {icono}
      </span>
   )
}
