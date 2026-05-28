import { PrimaryButton } from '@/components'
import { Tags, Users, CreditCard, LogOut, Plus } from 'lucide-react'
import { getGreeting } from '../utils/getGreeting'
import { Logo } from './Logo'

interface AppHeaderProps {
   isAdmin?: boolean
   userName?: string
   onOpenCategories: () => void
   onOpenPlatforms: () => void
   onLogout: () => void
   onOpenUsers?: () => void
   onNewMovement: () => void
}

export const AppHeader: React.FC<AppHeaderProps> = ({
   isAdmin,
   userName,
   onOpenCategories,
   onOpenPlatforms,
   onLogout,
   onOpenUsers,
   onNewMovement,
}) => {
   const firstName = userName?.split(' ')[0]
   const greeting = firstName ? `${getGreeting()}, ${firstName}!` : null

   return (
      <>
         {/* Desktop */}
         <header
            className="hidden lg:flex items-center justify-between sticky top-0 z-30 h-16 px-10 border-b border-white/6"
            style={{
               background: 'rgba(0, 42, 38, 0.92)',
               backdropFilter: 'blur(16px)',
               WebkitBackdropFilter: 'blur(16px)',
            }}
         >
            <Logo />

            {greeting && (
               <p className="text-sm text-text-secondary font-medium">{greeting}</p>
            )}

            <div className="flex items-center gap-2">
               {isAdmin && (
                  <button
                     onClick={onOpenUsers}
                     className="flex items-center gap-1.5 px-3.5 h-9 rounded-md border border-border-strong bg-transparent text-text-secondary text-[13px] font-medium cursor-pointer hover:border-accent hover:text-accent transition-all duration-200"
                  >
                     <Users size={14} />
                     Usuarios
                  </button>
               )}

               <button
                  onClick={onOpenCategories}
                  className="flex items-center gap-1.5 px-3.5 h-9 rounded-md border border-border-strong bg-transparent text-text-secondary text-[13px] font-medium cursor-pointer hover:border-accent hover:text-accent transition-all duration-200"
               >
                  <Tags size={14} />
                  Categorías
               </button>

               <button
                  onClick={onOpenPlatforms}
                  className="flex items-center gap-1.5 px-3.5 h-9 rounded-md border border-border-strong bg-transparent text-text-secondary text-[13px] font-medium cursor-pointer hover:border-accent hover:text-accent transition-all duration-200"
               >
                  <CreditCard size={14} />
                  Plataformas
               </button>

               <PrimaryButton
                  size="sm"
                  icon={<Plus size={18} strokeWidth={2.5} />}
                  onClick={onNewMovement}
               >
                  Nuevo
               </PrimaryButton>

               <button
                  onClick={onLogout}
                  title="Cerrar sesión"
                  className="w-9 h-9 flex items-center justify-center rounded-md border border-border-strong text-text-secondary cursor-pointer hover:border-danger/60 hover:text-danger transition-all duration-200"
               >
                  <LogOut size={18} />
               </button>
            </div>
         </header>

         {/* Mobile */}
         <div className="lg:hidden max-w-[520px] mx-auto px-4">
            <header className="animate-fade-in pt-5 flex flex-col gap-3">
               <div className="flex items-center justify-between">
                  <Logo subtitle={greeting ?? undefined} />

                  <div className="flex items-center gap-2">
                     {isAdmin && (
                        <button
                           onClick={onOpenUsers}
                           title="Gestionar usuarios"
                           className="w-10 h-10 rounded-sm border border-border-strong bg-transparent text-text-muted flex items-center justify-center hover:border-accent hover:text-accent transition-colors duration-200"
                        >
                           <Users size={18} />
                        </button>
                     )}

                     <button
                        onClick={onOpenCategories}
                        title="Gestionar categorías"
                        className="w-10 h-10 rounded-sm border border-border-strong bg-transparent text-text-muted flex items-center justify-center hover:border-accent hover:text-accent transition-colors duration-200"
                     >
                        <Tags size={18} />
                     </button>

                     <button
                        onClick={onOpenPlatforms}
                        title="Gestionar plataformas"
                        className="w-10 h-10 rounded-sm border border-border-strong bg-transparent text-text-muted flex items-center justify-center hover:border-accent hover:text-accent transition-colors duration-200"
                     >
                        <CreditCard size={18} />
                     </button>

                     <button
                        onClick={onLogout}
                        title="Cerrar sesión"
                        className="w-10 h-10 rounded-sm border border-border-strong bg-transparent text-text-muted flex items-center justify-center hover:border-danger/60 hover:text-danger transition-colors duration-200"
                     >
                        <LogOut size={18} />
                     </button>
                  </div>
               </div>
            </header>
         </div>
      </>
   )
}
