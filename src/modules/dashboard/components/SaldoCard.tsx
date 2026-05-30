import { formatCurrency } from '@/utils'
import { cn } from '@/utils/cn'

interface SaldoCardProps {
   saldo: number
   size?: 'sm' | 'lg'
}

export const SaldoCard: React.FC<SaldoCardProps> = ({ saldo, size = 'sm' }) => {
   const isPositive = saldo > 0
   const isLarge = size === 'lg'

   const tint = isPositive ? '229,255,166' : '255,75,90'
   const tintOpacity = isLarge ? 0.07 : 0.05

   return (
      <div
         className={cn('card text-center', isLarge ? 'animate-fade-in p-8' : 'p-5')}
         style={{
            background: `linear-gradient(135deg, var(--color-surface), rgba(${tint},${tintOpacity}))`,
         }}
      >
         <p
            className={cn(
               'text-text-muted font-semibold uppercase',
               isLarge
                  ? 'text-[11px] mb-2.5 tracking-[1.5px]'
                  : 'text-xs mb-1 tracking-[1px]'
            )}
         >
            Saldo del mes
         </p>

         <h2
            className={cn(
               'font-heading font-black transition-colors duration-300',
               isLarge ? 'text-5xl tracking-[-2px]' : 'text-4xl tracking-[-1px]',
               saldo === 0
                  ? 'text-text-secondary'
                  : isPositive
                    ? 'text-accent'
                    : 'text-danger'
            )}
         >
            {saldo !== 0 && (isPositive ? '+' : '')}
            {formatCurrency(saldo)}
         </h2>
      </div>
   )
}
