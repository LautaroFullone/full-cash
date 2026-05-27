import { EditMovementForm } from '@/modules/movements/components/EditMovementForm'
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
      loading,
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
   const isPositive = saldo >= 0

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
               <p className="text-[10px] text-text-muted mb-1 font-semibold uppercase tracking-[1px]">
                  Saldo del mes
               </p>
               <h2
                  className={cn(
                     'font-heading text-4xl font-black tracking-[-1px] transition-colors duration-300',
                     isPositive ? 'text-accent' : 'text-danger'
                  )}
               >
                  {isPositive ? '+' : ''}
                  {formatCurrency(saldo)}
               </h2>
            </div>
         </div>

         {/* Content */}
         {loading ? (
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
                           isPositive ? 'text-accent' : 'text-danger'
                        )}
                     >
                        {isPositive ? '+' : ''}
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
            onClose={() => setFormOpen(false)}
            onOpen={() => setFormOpen(true)}
         />

         <EditMovementForm
            movimiento={editingMov}
            categorias={categorias}
            plataformas={plataformas}
            onUpdate={updateMovimiento}
            onDelete={deleteMovimiento}
            onClose={() => setEditingMov(null)}
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

const DashboardSkeleton: React.FC = () => (
   <div className="max-w-130 mx-auto px-4 pb-24 flex flex-col gap-4 pt-2">
      <Skeleton className="h-[88px] rounded-xl" />

      <div className="grid grid-cols-2 gap-3">
         <Skeleton className="h-[88px]" />
         <Skeleton className="h-[88px]" />
      </div>

      <Skeleton className="h-[112px]" />

      <Skeleton className="h-[192px]" />

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
