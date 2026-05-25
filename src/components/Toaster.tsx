import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner'

export const Toaster: React.FC = () => (
   <SonnerToaster
      position="bottom-center"
      offset={88}
      toastOptions={{
         style: {
            background: 'var(--color-surface-elevated)',
            border: '1px solid var(--color-border-strong)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            borderRadius: '10px',
         },
         classNames: {
            success: 'border-accent/30',
            error: 'border-danger/30',
         },
      }}
   />
)

export const toast = {
   success: (msg: string) => sonnerToast.success(msg),
   error: (msg: string) => sonnerToast.error(msg),
}
