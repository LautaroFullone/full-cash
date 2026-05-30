import type { DistribucionCategoria } from '@/modules/movements/services/getResumenMensual'
import type { Movimiento } from '@/modules/movements/services/getMovimientos'
import { MovementList } from '@/modules/movements/components/MovementList'
import type { TipoMovimiento } from '@/models/categoria'
import { MovementTimeline } from './MovementTimeline'
import { CategoryChart } from './CategoryChart'

interface FolderBodyProps {
   activeTab: TipoMovimiento | null
   filtered: Movimiento[]
   distribucion: DistribucionCategoria[]
   onEdit: (mov: Movimiento) => void
}

export const FolderBody: React.FC<FolderBodyProps> = ({
   activeTab,
   filtered,
   distribucion,
   onEdit,
}) =>
   activeTab === null ? (
      <MovementTimeline movimientos={filtered} onEdit={onEdit} />
   ) : (
      <>
         <CategoryChart distribucion={distribucion} tipo={activeTab} bare />

         <div className="h-px bg-white/6" />

         <MovementList movimientos={filtered} tipo={activeTab} onEdit={onEdit} bare />
      </>
   )
