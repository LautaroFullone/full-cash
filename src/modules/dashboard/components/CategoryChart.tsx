import type { DistribucionCategoria } from '@/modules/movements/services/getResumenMensual'
import { getCategoryColor } from '@/models/categoria'
import type { TipoMovimiento } from '@/models/categoria'
import { cn } from '@/utils/cn'

interface CategoryChartProps {
   distribucion: DistribucionCategoria[]
   tipo?: TipoMovimiento
   bare?: boolean
}

export const CategoryChart: React.FC<CategoryChartProps> = ({
   distribucion,
   tipo = 'EGRESO',
   bare = false,
}) => {
   const label = tipo === 'INGRESO' ? 'ingresos' : 'gastos'
   const wrapperClass = bare
      ? ''
      : 'card animate-slide-up p-5 [animation-delay:0.3s] [animation-fill-mode:backwards]'

   if (!distribucion.length) {
      return (
         <div
            className={cn(
               bare
                  ? 'text-center py-6'
                  : 'card animate-slide-up px-5 py-8 text-center [animation-delay:0.3s] [animation-fill-mode:backwards]'
            )}
         >
            <p className="text-sm text-text-muted">
               No hay {label} este mes para graficar
            </p>
         </div>
      )
   }

   const chartData = distribucion.map((item) => ({
      ...item,
      color: getCategoryColor(item.colorIndex),
   }))

   return (
      <div className={wrapperClass}>
         {/* Segmented bar — each segment's width is proportional via flex */}
         <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
            {chartData.map((item) => (
               <div
                  key={item.categoriaId}
                  style={{
                     flex: item.porcentaje,
                     minWidth: '10px', // ancho visual minimo por categoria
                     backgroundColor: item.color,
                  }}
               />
            ))}
         </div>

         {/* Legend */}
         <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {chartData.map((item) => (
               <div key={item.categoriaId} className="flex items-center gap-1.5">
                  <div
                     className="w-2.5 h-2.5 rounded-full shrink-0"
                     style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-text-secondary">
                     {item.categoriaNombre}
                  </span>
               </div>
            ))}
         </div>
      </div>
   )
}
