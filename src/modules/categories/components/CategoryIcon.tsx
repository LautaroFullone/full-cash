interface CategoryIconProps {
   icono: string
   size?: number
   className?: string
}

export function CategoryIcon({ icono, size = 20, className = '' }: CategoryIconProps) {
   const isEmoji = icono && !/^[A-Z]/.test(icono)
   const display = isEmoji ? icono : '💰'

   return (
      <span
         className={`inline-flex items-center leading-none ${className}`}
         style={{ fontSize: size }}
         role="img"
         aria-label="category icon"
      >
         {display}
      </span>
   )
}
