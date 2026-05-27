import {
   ChevronLeft,
   ChevronRight,
   Wallet,
   Tags,
   Users,
   CreditCard,
   LogOut,
} from 'lucide-react'
import { formatCurrency } from '@/utils/formatCurrency'

interface HeaderProps {
   anio: number
   monthName: string
   saldo: number
   isAdmin?: boolean
   onPrevMonth: () => void
   onNextMonth: () => void
   onOpenCategories: () => void
   onOpenPlatforms: () => void
   onLogout: () => void
   onOpenUsers?: () => void
}

export const Header: React.FC<HeaderProps> = ({
   anio,
   monthName,
   saldo,
   isAdmin,
   onPrevMonth,
   onNextMonth,
   onOpenCategories,
   onOpenPlatforms,
   onLogout,
   onOpenUsers,
}) => {
   const isPositive = saldo >= 0

   return (
      <header className="animate-fade-in pt-5 flex flex-col gap-3">
         {/* Fila 1: logo + botones de acción */}
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
               <div
                  className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
                  style={{
                     background:
                        'linear-gradient(135deg, var(--color-accent), var(--color-accent-dim))',
                  }}
               >
                  <Wallet size={18} color="#003a34" strokeWidth={2.5} />
               </div>
               <div>
                  <h1 className="font-heading text-lg font-black tracking-[-0.5px] leading-tight">
                     Full Cash
                  </h1>
                  <p className="text-[11px] text-text-muted leading-tight">
                     Finanzas personales
                  </p>
               </div>
            </div>

            <div className="flex items-center gap-1.5">
               {isAdmin && onOpenUsers && (
                  <button
                     onClick={onOpenUsers}
                     title="Gestionar usuarios"
                     className="w-8 h-8 rounded-sm border border-border-strong bg-transparent text-text-muted flex items-center justify-center hover:border-accent hover:text-accent transition-colors duration-200"
                  >
                     <Users size={15} />
                  </button>
               )}
               <button
                  onClick={onOpenCategories}
                  title="Gestionar categorías"
                  className="w-8 h-8 rounded-sm border border-border-strong bg-transparent text-text-muted flex items-center justify-center hover:border-accent hover:text-accent transition-colors duration-200"
               >
                  <Tags size={15} />
               </button>
               <button
                  onClick={onOpenPlatforms}
                  title="Gestionar plataformas"
                  className="w-8 h-8 rounded-sm border border-border-strong bg-transparent text-text-muted flex items-center justify-center hover:border-accent hover:text-accent transition-colors duration-200"
               >
                  <CreditCard size={15} />
               </button>
               <button
                  onClick={onLogout}
                  title="Cerrar sesión"
                  className="w-8 h-8 rounded-sm border border-border-strong bg-transparent text-text-muted flex items-center justify-center hover:border-danger/60 hover:text-danger transition-colors duration-200"
               >
                  <LogOut size={15} />
               </button>
            </div>
         </div>

         {/* Fila 2: selector de mes (centrado, ancho completo) */}
         <div className="flex items-center bg-surface border border-border rounded-full p-1.5">
            <button
               onClick={onPrevMonth}
               aria-label="Mes anterior"
               className="w-8 h-8 rounded-full border-none bg-background text-text-secondary flex items-center justify-center cursor-pointer hover:text-white transition-colors duration-200 shrink-0"
            >
               <ChevronLeft size={16} />
            </button>
            <span className="flex-1 font-heading text-sm font-semibold capitalize text-center text-white">
               {monthName} {anio}
            </span>
            <button
               onClick={onNextMonth}
               aria-label="Mes siguiente"
               className="w-8 h-8 rounded-full border-none bg-background text-text-secondary flex items-center justify-center cursor-pointer hover:text-white transition-colors duration-200 shrink-0"
            >
               <ChevronRight size={16} />
            </button>
         </div>

         {/* Saldo del mes */}
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
               className={`font-heading text-4xl font-black tracking-[-1px] transition-colors duration-300 ${isPositive ? 'text-accent' : 'text-danger'}`}
            >
               {isPositive ? '+' : ''}
               {formatCurrency(saldo)}
            </h2>
         </div>
      </header>
   )
}
