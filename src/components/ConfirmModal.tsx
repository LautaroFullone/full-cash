import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'
import {
   AlertDialog,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ConfirmModalProps {
   open: boolean
   onCancel: () => void
   onConfirm: () => void
   title: string
   description?: string
   confirmLabel?: string
   confirmVariant?: 'danger' | 'accent'
   isLoading?: boolean
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
   open,
   onCancel,
   onConfirm,
   title,
   description,
   confirmLabel = 'Confirmar',
   confirmVariant = 'danger',
   isLoading = false,
}) => (
   <AlertDialog open={open}>
      <AlertDialogContent className="w-[calc(100%-2rem)] max-w-sm bg-surface border border-border-strong rounded-xl p-0 gap-0 shadow-elevated outline-none overflow-hidden">
         <div className="px-5 py-4 border-b border-border">
            <AlertDialogTitle className="font-heading text-base font-bold text-white text-left">
               {title}
            </AlertDialogTitle>
         </div>

         {description && (
            <div className="px-5 py-4">
               <AlertDialogDescription className="text-[13px] text-text-muted text-left text-wrap-pretty">
                  {description}
               </AlertDialogDescription>
            </div>
         )}

         <div className="px-5 py-4 border-t border-border flex gap-2">
            <button
               onClick={onCancel}
               disabled={isLoading}
               className="flex-1 h-10 rounded-md border border-border text-text-secondary text-sm cursor-pointer hover:border-border-strong hover:text-white transition-colors bg-transparent disabled:opacity-60 disabled:cursor-not-allowed"
            >
               Cancelar
            </button>

            <button
               onClick={onConfirm}
               disabled={isLoading}
               className={cn(
                  'flex-1 h-10 rounded-md font-heading font-bold text-sm cursor-pointer transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed',
                  confirmVariant === 'danger'
                     ? 'bg-danger text-white hover:bg-danger-dim'
                     : 'bg-accent text-background-deep hover:bg-accent-dim'
               )}
            >
               {isLoading && <Loader2 size={13} className="animate-spin" />}
               {confirmLabel}
            </button>
         </div>
      </AlertDialogContent>
   </AlertDialog>
)
