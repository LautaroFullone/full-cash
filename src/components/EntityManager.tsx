import { PrimaryButton } from './PrimaryButton'
import { Loader2, X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface PrimaryBtnConfig {
   icon?: React.ComponentType<{ size?: number; strokeWidth?: number }>
   label: string
   onClick: () => void
   disabled?: boolean
   isLoading?: boolean
}

interface SecondaryBtnConfig {
   label: string
   onClick: () => void
   disabled?: boolean
}

interface EntityManagerProps {
   title: string
   description?: string
   onClose: () => void
   isLoading?: boolean
   primaryBtn?: PrimaryBtnConfig
   secondaryBtn?: SecondaryBtnConfig
   children: React.ReactNode
}

export const EntityManager: React.FC<EntityManagerProps> = ({
   title,
   description,
   onClose,
   isLoading,
   primaryBtn,
   secondaryBtn,
   children,
}) => {
   const hasFooter = primaryBtn !== undefined || secondaryBtn !== undefined
   const hasBoth = primaryBtn !== undefined && secondaryBtn !== undefined

   return (
      <div
         className="modal-overlay fixed inset-0 bg-black/70 backdrop-blur-lg z-60 flex justify-center"
         onClick={onClose}
      >
         <div
            className="modal-sheet animate-slide-up bg-surface flex flex-col"
            style={{ maxHeight: '88dvh' }}
            onClick={(e) => e.stopPropagation()}
         >
            {/* Drag handle — mobile only */}
            <div className="lg:hidden w-10 h-1 rounded-full bg-border-strong mx-auto mt-3 mb-1 shrink-0" />

            {/* Header */}
            <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-border">
               <div>
                  <h2 className="font-heading text-base font-bold text-white">{title}</h2>
                  {description && (
                     <p className="text-[13px] text-text-muted mt-0.5">{description}</p>
                  )}
               </div>
               <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-md text-text-muted hover:text-white hover:bg-white/8 transition-colors cursor-pointer border-none bg-transparent"
               >
                  <X size={18} />
               </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
               {isLoading ? (
                  <div className="flex justify-center py-8">
                     <Loader2 size={24} className="text-accent animate-spin" />
                  </div>
               ) : (
                  children
               )}
            </div>

            {/* Footer */}
            {hasFooter && (
               <div className="shrink-0 px-5 py-4 border-t border-border flex gap-2">
                  {secondaryBtn && (
                     <button
                        onClick={secondaryBtn.onClick}
                        disabled={secondaryBtn.disabled}
                        className={cn(
                           'h-10 rounded-md border border-border text-text-secondary text-sm cursor-pointer hover:border-border-strong hover:text-white transition-colors bg-transparent',
                           hasBoth ? 'flex-1' : 'w-full'
                        )}
                     >
                        {secondaryBtn.label}
                     </button>
                  )}
                  {primaryBtn && (
                     <PrimaryButton
                        size="md"
                        icon={
                           primaryBtn.icon && (
                              <primaryBtn.icon size={15} strokeWidth={2.5} />
                           )
                        }
                        onClick={primaryBtn.onClick}
                        disabled={primaryBtn.disabled}
                        isLoading={primaryBtn.isLoading}
                        fullWidth={!hasBoth}
                        className={cn(hasBoth && 'flex-1')}
                     >
                        {primaryBtn.label}
                     </PrimaryButton>
                  )}
               </div>
            )}
         </div>
      </div>
   )
}
