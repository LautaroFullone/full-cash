import type { DistribucionCategoria } from '@/modules/movements/services/getResumenMensual'
import type { Movimiento } from '@/modules/movements/services/getMovimientos'
import { MovementList } from '@/modules/movements/components/MovementList'
import type { TipoMovimiento } from '@/models/categoria'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { MovementTimeline } from './MovementTimeline'
import { CategoryChart } from './CategoryChart'
import { SummaryChip } from './SummaryChip'
import { formatCurrency } from '@/utils'

interface FolderBodyProps {
   activeTab: TipoMovimiento | null
   filtered: Movimiento[]
   distribucion: DistribucionCategoria[]
   totalIngresos: number
   totalEgresos: number
   onTabChange: (tab: TipoMovimiento | null) => void
   onEdit: (mov: Movimiento) => void
}

export const FolderBody: React.FC<FolderBodyProps> = ({
   activeTab,
   filtered,
   distribucion,
   totalIngresos,
   totalEgresos,
   onTabChange,
   onEdit,
}) =>
   activeTab === null ? (
      <>
         <div className="flex gap-3 -mt-5">
            <SummaryChip
               label="Ingresos"
               value={formatCurrency(totalIngresos)}
               icon={<TrendingUp size={15} />}
               tone="accent"
               onClick={() => onTabChange('INGRESO')}
            />

            <SummaryChip
               label="Egresos"
               value={formatCurrency(totalEgresos)}
               icon={<TrendingDown size={15} />}
               tone="danger"
               onClick={() => onTabChange('EGRESO')}
            />
         </div>

         <MovementTimeline movimientos={filtered} onEdit={onEdit} />
      </>
   ) : (
      <>
         <CategoryChart distribucion={distribucion} tipo={activeTab} bare />

         <div className="h-px bg-white/6" />

         <MovementList movimientos={filtered} tipo={activeTab} onEdit={onEdit} bare />
      </>
   )
