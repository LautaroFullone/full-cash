import type { Movimiento } from '@/modules/movements/services/getMovimientos'
import { MovementForm } from '@/modules/movements/components/MovementForm'
import { useCategories } from '@/modules/categories/hooks/useCategories'
import { CategoryManager } from '@/modules/categories/CategoryManager'
import { useMovements } from '@/modules/movements/hooks/useMovements'
import { usePlatforms } from '@/modules/platforms/hooks/usePlatforms'
import { PlatformManager } from '../platforms/PlatformManager'
import { MovementsFolder } from './components/MovementsFolder'
import { useSavingsConfig } from './hooks/useSavingsConfig'
import { useMonthSelector } from './hooks/useMonthSelector'
import { MonthSelector } from './components/MonthSelector'
import { UserManager } from '@/modules/admin/UserManager'
import type { TipoMovimiento } from '@/models/categoria'
import { formatCurrency } from '@/utils/formatCurrency'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { SavingsBar } from './components/SavingsBar'
import { AppHeader } from './components/AppHeader'
import { useAuthStore } from '@/stores/authStore'
import { Skeleton } from '@/components'
import { useState } from 'react'
import { cn } from '@/utils/cn'

export function DashboardPage() {
   const { mes, anio, monthName, goToPrevMonth, goToNextMonth, goToMonth } =
      useMonthSelector()
   const {
      movimientos,
      resumen,
      isLoading,
      createMovimiento,
      deleteMovimiento,
      updateMovimiento,
   } = useMovements(mes, anio)
   const { categorias, createCategoria, updateCategoria, deleteCategoria } =
      useCategories()
   const { plataformas, createPlataforma, deletePlataforma } = usePlatforms()
   const { config, updatePorcentaje } = useSavingsConfig()

   const { logout } = useAuth()
   const { user } = useAuthStore()
   const [showCategoryManager, setShowCategoryManager] = useState(false)
   const [showUserManager, setShowUserManager] = useState(false)
   const [showPlatformManager, setShowPlatformManager] = useState(false)
   const [activeTab, setActiveTab] = useState<TipoMovimiento>('EGRESO')
   const [formOpen, setFormOpen] = useState(false)
   const [editingMov, setEditingMov] = useState<Movimiento | null>(null)

   const saldo = resumen?.saldo ?? 0
   const isPositive = saldo > 0

   return (
      <div className="min-h-dvh">
         <AppHeader
            isAdmin={user?.role === 'ADMIN'}
            onOpenCategories={() => setShowCategoryManager(true)}
            onOpenPlatforms={() => setShowPlatformManager(true)}
            onLogout={logout}
            onOpenUsers={() => setShowUserManager(true)}
            onNewMovement={() => setFormOpen(true)}
         />

         <div className="max-w-[520px] lg:max-w-300 mx-auto px-4 lg:px-10 pt-5 lg:pt-8">
            <MonthSelector
               mes={mes}
               anio={anio}
               monthName={monthName}
               onPrevMonth={goToPrevMonth}
               onNextMonth={goToNextMonth}
               onSelectMonth={goToMonth}
            />
         </div>

         <div className="lg:hidden max-w-[520px] mx-auto px-4 pt-3">
            <div
               className="card p-5 text-center"
               style={{
                  background: `linear-gradient(135deg, var(--color-surface), ${isPositive ? 'rgba(229,255,166,0.05)' : 'rgba(255,75,90,0.05)'})`,
               }}
            >
               <p className="text-xs text-text-muted mb-1 font-semibold uppercase tracking-[1px]">
                  Saldo del mes
               </p>
               <h2
                  className={cn(
                     'font-heading text-4xl font-black tracking-[-1px] transition-colors duration-300',
                     saldo === 0
                        ? 'text-text-secondary'
                        : isPositive
                          ? 'text-accent'
                          : 'text-danger'
                  )}
               >
                  {saldo !== 0 && (isPositive ? '+' : '')}
                  {formatCurrency(saldo)}
               </h2>
            </div>
         </div>

         {/* Content */}
         {isLoading ? (
            <DashboardSkeleton />
         ) : (
            <div className="max-w-130 lg:max-w-300 mx-auto px-4 lg:px-10 pb-24 lg:pb-12 lg:pt-8 lg:grid lg:grid-cols-[340px_1fr] lg:gap-6 lg:items-start">
               <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-20">
                  <div
                     className="card animate-fade-in p-8 text-center"
                     style={{
                        background: `linear-gradient(135deg, var(--color-surface), ${isPositive ? 'rgba(229,255,166,0.07)' : 'rgba(255,75,90,0.07)'})`,
                     }}
                  >
                     <p className="text-[11px] text-text-muted mb-2.5 font-semibold uppercase tracking-[1.5px]">
                        Saldo del mes
                     </p>

                     <h2
                        className={cn(
                           'font-heading text-5xl font-black tracking-[-2px] transition-colors duration-300',
                           saldo === 0
                              ? 'text-text-secondary'
                              : isPositive
                                ? 'text-accent'
                                : 'text-danger'
                        )}
                     >
                        {saldo !== 0 && (isPositive ? '+' : '')}
                        {formatCurrency(saldo)}
                     </h2>
                  </div>
                  {/*
                     {config && (
                        <SavingsBar
                           totalIngresos={resumen?.totalIngresos ?? 0}
                           totalEgresos={resumen?.totalEgresos ?? 0}
                           porcentajeAhorro={config.porcentajeAhorro}
                           onUpdatePorcentaje={updatePorcentaje}
                        />
                     )} */}
               </aside>

               <main className="mt-4 lg:mt-0">
                  <MovementsFolder
                     movimientos={movimientos}
                     totalIngresos={resumen?.totalIngresos ?? 0}
                     totalEgresos={resumen?.totalEgresos ?? 0}
                     activeTab={activeTab}
                     onTabChange={setActiveTab}
                     onEdit={setEditingMov}
                  />
               </main>
            </div>
         )}

         <MovementForm
            categorias={categorias}
            plataformas={plataformas}
            onSubmit={createMovimiento}
            isOpen={formOpen}
            initialTipo={activeTab}
            onOpen={() => setFormOpen(true)}
            onClose={() => {
               setFormOpen(false)
               setEditingMov(null)
            }}
            movimiento={editingMov}
            onUpdate={updateMovimiento}
            onDelete={deleteMovimiento}
         />

         {showCategoryManager && (
            <CategoryManager
               categorias={categorias}
               onClose={() => setShowCategoryManager(false)}
               onCreate={createCategoria}
               onUpdate={updateCategoria}
               onDelete={deleteCategoria}
            />
         )}

         {showUserManager && <UserManager onClose={() => setShowUserManager(false)} />}

         {showPlatformManager && (
            <PlatformManager
               plataformas={plataformas}
               onCreate={createPlataforma}
               onDelete={deletePlataforma}
               onClose={() => setShowPlatformManager(false)}
            />
         )}
      </div>
   )
}

const DashboardSkeleton: React.FC = () => {
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
