import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '@/utils/formatCurrency'

interface SummaryCardsProps {
   totalIngresos: number
   totalEgresos: number
}

export function SummaryCards({ totalIngresos, totalEgresos }: SummaryCardsProps) {
   return (
      <div className="animate-slide-up grid grid-cols-2 gap-3 [animation-delay:0.1s] [animation-fill-mode:backwards]">
         <div className="card p-5 relative overflow-hidden">
            <div className="absolute -top-2.5 -right-2.5 w-[60px] h-[60px] rounded-full bg-accent/8" />
            <div className="flex items-center gap-2 mb-3">
               <div className="w-8 h-8 rounded-sm bg-accent/12 flex items-center justify-center">
                  <TrendingUp size={16} className="text-accent" />
               </div>
               <span className="text-xs font-semibold text-text-muted uppercase tracking-[0.5px]">
                  Ingresos
               </span>
            </div>
            <p className="font-heading text-[22px] font-bold text-accent tracking-[-0.5px]">
               {formatCurrency(totalIngresos)}
            </p>
         </div>

         <div className="card p-5 relative overflow-hidden">
            <div className="absolute -top-2.5 -right-2.5 w-[60px] h-[60px] rounded-full bg-danger/8" />
            <div className="flex items-center gap-2 mb-3">
               <div className="w-8 h-8 rounded-sm bg-danger/12 flex items-center justify-center">
                  <TrendingDown size={16} className="text-danger" />
               </div>
               <span className="text-xs font-semibold text-text-muted uppercase tracking-[0.5px]">
                  Egresos
               </span>
            </div>
            <p className="font-heading text-[22px] font-bold text-danger tracking-[-0.5px]">
               -{formatCurrency(totalEgresos)}
            </p>
         </div>
      </div>
   )
}
