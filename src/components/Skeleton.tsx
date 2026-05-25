import { cn } from '@/utils/cn'

interface SkeletonProps {
   className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
   <div
      className={cn('rounded-md bg-surface-elevated animate-pulse', className)}
   />
)

export const DashboardSkeleton: React.FC = () => (
   <div className="max-w-130 mx-auto px-4 pb-24 flex flex-col gap-4 pt-2">
      {/* Saldo */}
      <Skeleton className="h-[88px] rounded-xl" />

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
         <Skeleton className="h-[88px]" />
         <Skeleton className="h-[88px]" />
      </div>

      {/* Savings bar */}
      <Skeleton className="h-[112px]" />

      {/* Chart */}
      <Skeleton className="h-[192px]" />

      {/* Movement list */}
      <div className="bg-surface border border-border rounded-lg p-5 flex flex-col gap-3">
         <Skeleton className="h-5 w-32" />
         <Skeleton className="h-9 rounded-full" />
         {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 px-1">
               <Skeleton className="w-9 h-9 rounded-sm shrink-0" />
               <div className="flex-1 flex flex-col gap-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
               </div>
               <Skeleton className="h-4 w-16" />
            </div>
         ))}
      </div>
   </div>
)
