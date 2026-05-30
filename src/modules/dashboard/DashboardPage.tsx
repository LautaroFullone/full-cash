import type { Movimiento } from '@/modules/movements/services/getMovimientos'
import { MovementForm } from '@/modules/movements/components/MovementForm'
import { DashboardSkeleton } from './components/DashboardSkeleton'
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
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { SavingsBar } from './components/SavingsBar'
import { AppHeader } from './components/AppHeader'
import { SaldoCard } from './components/SaldoCard'
import { useAuthStore } from '@/stores/authStore'
import { useState } from 'react'

export const DashboardPage: React.FC = () => {
   const { user } = useAuthStore()

   const [showCategoryManager, setShowCategoryManager] = useState(false)
   const [showUserManager, setShowUserManager] = useState(false)
   const [showPlatformManager, setShowPlatformManager] = useState(false)
   const [activeTab, setActiveTab] = useState<TipoMovimiento | null>(null)
   const [formOpen, setFormOpen] = useState(false)
   const [editingMov, setEditingMov] = useState<Movimiento | null>(null)

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

   const saldo = resumen?.saldo ?? 0

   return (
      <div className="min-h-dvh">
         <AppHeader
            isAdmin={user?.role === 'ADMIN'}
            userName={user?.nombre}
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
            <SaldoCard saldo={saldo} size="sm" />
         </div>

         {/* Content */}
         {isLoading ? (
            <DashboardSkeleton />
         ) : (
            <div className="max-w-130 lg:max-w-300 mx-auto px-4 lg:px-10 pb-24 lg:pb-12 lg:pt-8 lg:grid lg:grid-cols-[340px_1fr] lg:gap-6 lg:items-start">
               <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-20">
                  <SaldoCard saldo={saldo} size="lg" />
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
            initialTipo={activeTab ?? 'EGRESO'}
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
