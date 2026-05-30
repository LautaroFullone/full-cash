import { Skeleton } from '@/components'
import { cn } from '@/utils/cn'

export const DashboardSkeleton: React.FC = () => {
   const folderBg = 'var(--color-surface)'

   return (
      <div
         className="max-w-130 lg:max-w-300 mx-auto px-4 lg:px-10 pb-24 lg:pb-12 pt-2 lg:pt-8 lg:grid lg:grid-cols-[340px_1fr] lg:gap-6 lg:items-start"
         style={{ '--folder-bg': folderBg } as React.CSSProperties}
      >
         {/* Desktop sidebar — saldo card */}
         <div className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-20">
            <div className="card p-8 flex flex-col items-center gap-3">
               <Skeleton className="h-2.5 w-24 rounded-full" />
               <Skeleton className="h-10 w-36 rounded-md" />
            </div>
         </div>

         {/* Main — movements folder */}
         <div className="mt-4 lg:mt-0">
            {/* Folder tabs */}
            <div className="grid grid-cols-2 gap-4">
               <div
                  data-active="false"
                  data-side="left"
                  className="folder-tab px-2 py-5 pointer-events-none"
               >
                  <div className="flex items-center gap-2 mb-3 mx-2">
                     <Skeleton className="w-8 h-8 rounded-sm shrink-0" />
                     <Skeleton className="h-2.5 w-14 rounded-full" />
                  </div>
                  <Skeleton className="h-7 w-24 mx-auto rounded-md" />
               </div>

               <div
                  data-active="true"
                  data-side="right"
                  className="folder-tab px-2 py-5 pointer-events-none"
               >
                  <div className="flex items-center gap-2 mb-3 mx-2">
                     <Skeleton className="w-8 h-8 rounded-sm shrink-0" />
                     <Skeleton className="h-2.5 w-14 rounded-full" />
                  </div>
                  <Skeleton className="h-7 w-24 mx-auto rounded-md" />
               </div>
            </div>

            {/* Folder body */}
            <div
               className="mt-4 p-5 flex flex-col gap-5 rounded-b-lg rounded-tl-lg"
               style={{ backgroundColor: folderBg }}
            >
               {/* CategoryChart skeleton */}
               <div>
                  <Skeleton className="h-3 w-full rounded-full" />
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                     {(['w-16', 'w-12', 'w-10', 'w-8'] as const).map((w, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                           <Skeleton className="w-2.5 h-2.5 rounded-full shrink-0" />
                           <Skeleton className={cn('h-2.5 rounded-full', w)} />
                        </div>
                     ))}
                  </div>
               </div>

               <div className="h-px bg-white/6" />

               {/* MovementList skeleton */}
               <div>
                  <div className="flex items-center gap-2 mb-4">
                     <Skeleton className="h-4 w-14 rounded" />
                     <Skeleton className="h-5 w-5 rounded-full" />
                  </div>

                  <div className="flex flex-col gap-0.5">
                     {(
                        [
                           { w: 'w-24', expanded: true },
                           { w: 'w-20', expanded: false },
                           { w: 'w-28', expanded: false },
                        ] as const
                     ).map((row, i) => (
                        <div key={i}>
                           <div className="flex items-center py-2 gap-3">
                              <Skeleton className="w-9 h-9 rounded-sm shrink-0" />
                              <div className="flex-1 flex flex-col gap-1.5">
                                 <div className="flex items-center gap-1.5">
                                    <Skeleton className="w-2 h-2 rounded-full shrink-0" />
                                    <Skeleton className={cn('h-4 rounded', row.w)} />
                                 </div>
                                 <Skeleton className="h-3 w-7 rounded" />
                              </div>
                              <Skeleton className="h-4 w-14 rounded shrink-0" />
                              <Skeleton className="w-4 h-4 rounded shrink-0" />
                           </div>

                           {row.expanded && (
                              <div className="pl-3 pr-1 pb-3">
                                 <div className="pl-3 flex flex-col">
                                    {([true, false] as const).map((withBadge, j) => (
                                       <div
                                          key={j}
                                          className="flex items-center pl-1.5 py-2 gap-2"
                                       >
                                          <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                                             <Skeleton
                                                className={cn(
                                                   'h-4 rounded',
                                                   withBadge ? 'w-3/4' : 'w-1/2'
                                                )}
                                             />
                                             {withBadge && (
                                                <Skeleton className="h-4 w-20 rounded-full" />
                                             )}
                                          </div>
                                          <div className="flex flex-col items-end gap-1 shrink-0">
                                             <Skeleton className="h-4 w-14 rounded" />
                                             <Skeleton className="h-3 w-8 rounded" />
                                          </div>
                                          <Skeleton className="w-8 h-8 rounded-sm shrink-0" />
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}
