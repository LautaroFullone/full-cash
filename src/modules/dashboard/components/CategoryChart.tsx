import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { CATEGORY_COLORS } from '@/models/categoria'
import { formatCurrency } from '@/utils/formatCurrency'
import type { DistribucionCategoria } from '@/modules/movements/services/getResumenMensual'

interface CategoryChartProps {
   distribucion: DistribucionCategoria[]
}

function CustomTooltip({
   active,
   payload,
}: {
   active?: boolean
   payload?: { payload: DistribucionCategoria }[]
}) {
   if (!active || !payload?.length) return null
   const data = payload[0].payload
   return (
      <div className="bg-surface-elevated border border-border-strong rounded-md px-3.5 py-2.5 shadow-elevated">
         <p className="text-[13px] font-semibold text-white">{data.categoriaNombre}</p>
         <p className="text-xs text-text-muted mt-0.5">
            {formatCurrency(data.total)} · {data.porcentaje.toFixed(1)}%
         </p>
      </div>
   )
}

export function CategoryChart({ distribucion }: CategoryChartProps) {
   if (!distribucion.length) {
      return (
         <div className="card animate-slide-up px-5 py-8 text-center [animation-delay:0.3s] [animation-fill-mode:backwards]">
            <p className="text-sm text-text-muted">
               No hay gastos este mes para graficar
            </p>
         </div>
      )
   }

   const chartData = distribucion.map((item, i) => ({
      ...item,
      color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
   }))

   return (
      <div className="card animate-slide-up p-5 [animation-delay:0.3s] [animation-fill-mode:backwards]">
         <h3 className="text-sm font-semibold mb-4">Distribución de gastos</h3>
         <div className="flex items-center gap-5">
            <div className="w-[140px] h-[140px] shrink-0">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="total"
                        stroke="none"
                        animationDuration={800}
                     >
                        {chartData.map((entry, i) => (
                           <Cell key={i} fill={entry.color} />
                        ))}
                     </Pie>
                     <Tooltip content={<CustomTooltip />} />
                  </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="flex-1 flex flex-col gap-2">
               {chartData.map((item) => (
                  <div
                     key={item.categoriaId}
                     className="flex items-center justify-between text-[13px]"
                  >
                     <div className="flex items-center gap-2">
                        <div
                           className="w-2 h-2 rounded-full shrink-0"
                           style={{ background: item.color }}
                        />
                        <span className="text-text-secondary">
                           {item.categoriaNombre}
                        </span>
                     </div>
                     <span className="text-text-muted font-medium text-xs">
                        {item.porcentaje.toFixed(0)}%
                     </span>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}
