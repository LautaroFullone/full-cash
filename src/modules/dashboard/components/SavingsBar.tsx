import { useState } from 'react'
import { PiggyBank, Settings2, Check } from 'lucide-react'
import { formatCurrency } from '@/utils/formatCurrency'

interface SavingsBarProps {
   totalIngresos: number
   totalEgresos: number
   porcentajeAhorro: number
   onUpdatePorcentaje: (value: number) => Promise<void> | void
}

export const SavingsBar: React.FC<SavingsBarProps> = ({
   totalIngresos,
   totalEgresos,
   porcentajeAhorro,
   onUpdatePorcentaje,
}) => {
   const [editing, setEditing] = useState(false)
   const [tempPorcentaje, setTempPorcentaje] = useState(Math.round(porcentajeAhorro * 100))

   const montoRecomendado = totalIngresos * porcentajeAhorro
   const ahorroReal = totalIngresos - totalEgresos
   const progreso =
      montoRecomendado > 0 ? Math.min((ahorroReal / montoRecomendado) * 100, 100) : 0
   const progressColor =
      progreso >= 80
         ? 'var(--color-accent)'
         : progreso >= 50
           ? 'var(--color-warning)'
           : 'var(--color-danger)'

   const handleSave = async () => {
      await onUpdatePorcentaje(tempPorcentaje / 100)
      setEditing(false)
   }

   return (
      <div className="card animate-slide-up p-5 [animation-delay:0.2s] [animation-fill-mode:backwards]">
         <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2.5">
               <div className="w-8 h-8 rounded-sm bg-warning/12 flex items-center justify-center">
                  <PiggyBank size={16} className="text-warning" />
               </div>
               <div>
                  <h3 className="text-sm font-semibold">Meta de ahorro</h3>
                  <p className="text-xs text-text-muted tabular-nums">
                     {Math.round(porcentajeAhorro * 100)}% del ingreso
                  </p>
               </div>
            </div>

            {editing ? (
               <div className="flex items-center gap-2">
                  <input
                     type="number"
                     min={1}
                     max={100}
                     value={tempPorcentaje}
                     onChange={(e) => setTempPorcentaje(Number(e.target.value))}
                     className="w-[60px] text-center text-[13px] rounded-sm py-1.5 px-2 tabular-nums"
                  />
                  <span className="text-[13px] text-text-muted">%</span>
                  {/* w-9 h-9 = 36px — mejor hit area */}
                  <button
                     onClick={handleSave}
                     className="w-9 h-9 rounded-sm border-none bg-accent text-background flex items-center justify-center active:scale-[0.96] transition-transform"
                  >
                     <Check size={14} />
                  </button>
               </div>
            ) : (
               <button
                  onClick={() => {
                     setTempPorcentaje(Math.round(porcentajeAhorro * 100))
                     setEditing(true)
                  }}
                  className="w-9 h-9 rounded-sm border border-border-strong bg-transparent text-text-muted flex items-center justify-center hover:border-accent hover:text-accent transition-colors duration-200 active:scale-[0.96]"
               >
                  <Settings2 size={14} />
               </button>
            )}
         </div>

         <div className="h-2 rounded-full bg-white/6 overflow-hidden mb-3">
            <div
               className="h-full rounded-full transition-[width] duration-500"
               style={{ width: `${Math.max(progreso, 0)}%`, background: progressColor }}
            />
         </div>

         <div className="flex justify-between text-[13px]">
            <span className="text-text-muted">
               Ahorro real:{' '}
               <span className={`font-semibold tabular-nums ${ahorroReal >= 0 ? 'text-accent' : 'text-danger'}`}>
                  {formatCurrency(ahorroReal)}
               </span>
            </span>
            <span className="text-text-muted">
               Meta:{' '}
               <span className="font-semibold tabular-nums text-text-secondary">
                  {formatCurrency(montoRecomendado)}
               </span>
            </span>
         </div>
      </div>
   )
}
