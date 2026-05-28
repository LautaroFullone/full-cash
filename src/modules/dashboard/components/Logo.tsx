import { Wallet } from 'lucide-react'

interface LogoProps {
   subtitle?: string
}

export const Logo: React.FC<LogoProps> = ({ subtitle = 'Finanzas personales' }) => (
   <div className="flex items-center gap-2.5">
      <div
         className="w-10 h-10 lg:w-9 lg:h-9 rounded-md flex items-center justify-center shrink-0"
         style={{
            background:
               'linear-gradient(135deg, var(--color-accent), var(--color-accent-dim))',
         }}
      >
         <Wallet size={20} color="#002a26" strokeWidth={2.5} />
      </div>

      <div>
         <div className="font-heading text-lg  font-black tracking-[-0.3px] text-white leading-tight">
            Full Cash
         </div>

         <p className="text-xs sm:text-sm text-text-muted leading-tight">{subtitle}</p>
      </div>
   </div>
)
