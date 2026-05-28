import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

interface PrimaryButtonProps extends Omit<
   React.ButtonHTMLAttributes<HTMLButtonElement>,
   'children'
> {
   children: React.ReactNode
   size?: 'sm' | 'md' | 'lg'
   fullWidth?: boolean
   icon?: React.ReactNode
   isLoading?: boolean
}

const SIZE_CLASSES: Record<NonNullable<PrimaryButtonProps['size']>, string> = {
   sm: 'h-9 text-[13px] px-4',
   md: 'h-10 text-sm px-4',
   lg: 'h-11 text-sm px-4',
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
   children,
   size = 'md',
   fullWidth = false,
   icon,
   isLoading = false,
   disabled,
   className,
   ...props
}) => (
   <button
      disabled={disabled || isLoading}
      className={cn(
         'rounded-md bg-accent text-background-deep font-heading font-bold',
         'cursor-pointer hover:bg-accent-dim transition-colors',
         'disabled:opacity-60 disabled:cursor-not-allowed',
         'flex items-center justify-center gap-2',
         SIZE_CLASSES[size],
         fullWidth && 'w-full',
         className
      )}
      {...props}
   >
      {isLoading ? <Loader2 size={13} className="animate-spin" /> : (icon ?? null)}
      {children}
   </button>
)
