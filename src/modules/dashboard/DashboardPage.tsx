import { EditMovementForm } from '@/modules/movements/components/EditMovementForm'
import type { Movimiento } from '@/modules/movements/services/getMovimientos'
import { MovementForm } from '@/modules/movements/components/MovementForm'
import { useCategories } from '@/modules/categories/hooks/useCategories'
import { CategoryManager } from '@/modules/categories/CategoryManager'
import { useMovements } from '@/modules/movements/hooks/useMovements'
import { usePlatforms } from '@/modules/platforms/hooks/usePlatforms'
import { useSavingsConfig } from './hooks/useSavingsConfig'
import { useMonthSelector } from './hooks/useMonthSelector'
import { MovementsFolder } from './components/MovementsFolder'
import { UserManager } from '@/modules/admin/UserManager'
import { DashboardSkeleton } from '@/components/Skeleton'
import { formatCurrency } from '@/utils/formatCurrency'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { PrimaryButton } from '@/components'
import { SavingsBar } from './components/SavingsBar'
import { useAuthStore } from '@/stores/authStore'
import { Header } from './components/Header'
import { useState } from 'react'
import { cn } from '@/utils/cn'
import {
   Wallet,
   Tags,
   Plus,
   CreditCard,
   ChevronLeft,
   ChevronRight,
   Users,
   LogOut,
} from 'lucide-react'
import { PlatformManager } from '../platforms/PlatformManager'

export function DashboardPage() {
   const { mes, anio, monthName, goToPrevMonth, goToNextMonth } = useMonthSelector()
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
   const [formOpen, setFormOpen] = useState(false)
   const [editingMov, setEditingMov] = useState<Movimiento | null>(null)

   const saldo = resumen?.saldo ?? 0
   const isPositive = saldo >= 0

   return (
      <div className="min-h-dvh">
         {/* Desktop Topbar */}
         <header
            className="hidden lg:flex items-center justify-between sticky top-0 z-30 h-16 px-10 border-b border-white/6"
            style={{
               background: 'rgba(0, 42, 38, 0.92)',
               backdropFilter: 'blur(16px)',
               WebkitBackdropFilter: 'blur(16px)',
            }}
         >
            <div className="flex items-center gap-2.5">
               <div
                  className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
                  style={{
                     background:
                        'linear-gradient(135deg, var(--color-accent), var(--color-accent-dim))',
                  }}
               >
                  <Wallet size={18} color="#002a26" strokeWidth={2.5} />
               </div>
               <div>
                  <div className="font-heading text-base font-black tracking-[-0.3px] text-white">
                     Full Cash
                  </div>
                  <p className="text-[11px] text-text-muted">Finanzas personales</p>
               </div>
            </div>

            <div className="flex items-center gap-1.5 bg-surface border border-border rounded-full p-[5px]">
               <button
                  onClick={goToPrevMonth}
                  aria-label="Mes anterior"
                  className="w-7.5 h-7.5 rounded-full border-none bg-background text-text-secondary flex items-center justify-center cursor-pointer hover:text-white transition-colors"
               >
                  <ChevronLeft size={15} />
               </button>
               <span className="font-heading text-[13px] font-semibold capitalize min-w-[110px] text-center text-white">
                  {monthName} {anio}
               </span>
               <button
                  onClick={goToNextMonth}
                  aria-label="Mes siguiente"
                  className="w-7.5 h-7.5 rounded-full border-none bg-background text-text-secondary flex items-center justify-center cursor-pointer hover:text-white transition-colors"
               >
                  <ChevronRight size={15} />
               </button>
            </div>

            <div className="flex items-center gap-2">
               {user?.role === 'ADMIN' && (
                  <button
                     onClick={() => setShowUserManager(true)}
                     className="flex items-center gap-1.5 px-3.5 h-9 rounded-md border border-border-strong bg-transparent text-text-secondary text-[13px] font-medium cursor-pointer hover:border-accent hover:text-accent transition-all duration-200"
                  >
                     <Users size={14} />
                     Usuarios
                  </button>
               )}

               <button
                  onClick={() => setShowCategoryManager(true)}
                  className="flex items-center gap-1.5 px-3.5 h-9 rounded-md border border-border-strong bg-transparent text-text-secondary text-[13px] font-medium cursor-pointer hover:border-accent hover:text-accent transition-all duration-200"
               >
                  <Tags size={14} />
                  Categorías
               </button>

               <button
                  onClick={() => setShowPlatformManager(true)}
                  className="flex items-center gap-1.5 px-3.5 h-9 rounded-md border border-border-strong bg-transparent text-text-secondary text-[13px] font-medium cursor-pointer hover:border-accent hover:text-accent transition-all duration-200"
               >
                  <CreditCard size={14} />
                  Plataformas
               </button>

               <PrimaryButton
                  size="sm"
                  icon={<Plus size={15} strokeWidth={2.5} />}
                  onClick={() => setFormOpen(true)}
               >
                  Nuevo
               </PrimaryButton>
               <button
                  onClick={logout}
                  title="Cerrar sesión"
                  className="w-9 h-9 flex items-center justify-center rounded-md border border-border-strong text-text-secondary cursor-pointer hover:border-danger/60 hover:text-danger transition-all duration-200"
               >
                  <LogOut size={15} />
               </button>
            </div>
         </header>

         {/* Mobile Header */}
         <div className="lg:hidden max-w-[520px] mx-auto px-4">
            <Header
               anio={anio}
               monthName={monthName}
               saldo={saldo}
               isAdmin={user?.role === 'ADMIN'}
               onPrevMonth={goToPrevMonth}
               onNextMonth={goToNextMonth}
               onOpenCategories={() => setShowCategoryManager(true)}
               onOpenPlatforms={() => setShowPlatformManager(true)}
               onLogout={logout}
               onOpenUsers={() => setShowUserManager(true)}
            />
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
