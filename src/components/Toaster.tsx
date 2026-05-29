import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner'

export const Toaster: React.FC = () => (
   <SonnerToaster
      gap={10}
      offset={88}
      className="fc-toaster"
      position="bottom-center"
      mobileOffset={{ bottom: 88, left: 16, right: 16 }}
   />
)

export const toast = {
   success: (msg: string) => sonnerToast.success(msg),
   error: (msg: string) => sonnerToast.error(msg),
}
