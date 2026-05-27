import { cn } from '@/utils/cn'

interface SkeletonProps {
   className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
   <div className={cn('rounded-md bg-surface-elevated animate-pulse', className)} />
)
