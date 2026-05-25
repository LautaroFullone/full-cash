import { cn } from '@/utils/cn'
import {
   AlertDialog as AlertDialogRoot,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogCancel,
   AlertDialogAction,
} from '@/components/ui/alert-dialog'

interface AlertDialogProps {
   open: boolean
   onCancel: () => void
   onConfirm: () => void
   title: string
   description?: string
   confirmLabel?: string
   confirmVariant?: 'danger' | 'accent'
   loading?: boolean
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
   open,
   onCancel,
   onConfirm,
   title,
   description,
   confirmLabel = 'Confirmar',
   confirmVariant = 'danger',
   loading = false,
}) => (
   <AlertDialogRoot open={open}>
      <AlertDialogContent className="w-[calc(100%-2rem)] max-w-sm bg-surface border border-border-strong rounded-xl p-6 shadow-elevated outline-none">
         <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-base font-bold text-white text-wrap-balance">
               {title}
            </AlertDialogTitle>
            {description && (
               <AlertDialogDescription className="text-sm text-text-muted text-wrap-pretty">
                  {description}
               </AlertDialogDescription>
            )}
         </AlertDialogHeader>
         <AlertDialogFooter className="flex-row gap-2 justify-end sm:space-x-0">
            <AlertDialogCancel
               onClick={onCancel}
               className="mt-0 h-9 px-4 rounded-md border border-border-strong bg-transparent text-text-secondary text-sm font-medium hover:border-border hover:text-white hover:bg-transparent transition-colors duration-150 active:scale-[0.96]"
            >
               Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
               onClick={onConfirm}
               disabled={loading}
               className={cn(
                  'h-9 px-4 rounded-md border-none text-sm font-bold font-heading cursor-pointer transition-colors duration-150 active:scale-[0.96] disabled:opacity-60',
                  confirmVariant === 'danger'
                     ? 'bg-danger text-white hover:bg-danger-dim'
                     : 'bg-accent text-background-deep hover:bg-accent-dim'
               )}
            >
               {confirmLabel}
            </AlertDialogAction>
         </AlertDialogFooter>
      </AlertDialogContent>
   </AlertDialogRoot>
)
