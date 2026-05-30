import type { DistribucionCategoria } from '@/modules/movements/services/getResumenMensual'
import type { Movimiento } from '@/modules/movements/services/getMovimientos'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { FOLDER_BG, FOLDER_ACCENT } from '../utils/folderColors'
import type { TipoMovimiento } from '@/models/categoria'
import { formatCurrency } from '@/utils'
import { GeneralTab } from './GeneralTab'
import { FolderBody } from './FolderBody'
import { FolderTab } from './FolderTab'
import { useMemo } from 'react'
import { cn } from '@/utils/cn'

interface MovementsFolderProps {
   movimientos: Movimiento[]
   totalIngresos: number
   totalEgresos: number
   activeTab: TipoMovimiento | null
   onTabChange: (tab: TipoMovimiento | null) => void
   onEdit: (mov: Movimiento) => void
}

export const MovementsFolder: React.FC<MovementsFolderProps> = ({
   movimientos,
   totalIngresos,
   totalEgresos,
   activeTab,
   onTabChange,
   onEdit,
}) => {
   const isGeneralTabActive = activeTab === null

   const filtered = useMemo(
      () =>
         isGeneralTabActive
            ? movimientos
            : movimientos.filter((m) => m.tipo === activeTab),
      [movimientos, activeTab, isGeneralTabActive]
   )

   const distribucion = useMemo<DistribucionCategoria[]>(() => {
      const map = new Map<string, { nombre: string; colorIndex: number; total: number }>()
      filtered.forEach((m) => {
         const cur = map.get(m.categoriaId)
         if (cur) cur.total += m.monto
         else
            map.set(m.categoriaId, {
               nombre: m.categoria?.nombre ?? '—',
               colorIndex: m.categoria?.colorIndex ?? 0,
               total: m.monto,
            })
      })

      const total = Array.from(map.values()).reduce((s, x) => s + x.total, 0)

      return Array.from(map.entries())
         .map(([categoriaId, data]) => ({
            categoriaId,
            categoriaNombre: data.nombre,
            colorIndex: data.colorIndex,
            total: data.total,
            porcentaje: total > 0 ? (data.total / total) * 100 : 0,
         }))
         .sort((a, b) => b.total - a.total)
   }, [filtered])

   const bodyRadius = isGeneralTabActive
      ? 'rounded-b-lg'
      : activeTab === 'INGRESO'
        ? 'rounded-b-lg rounded-tr-lg'
        : 'rounded-b-lg rounded-tl-lg'

   return (
      <div
         className="animate-slide-up [animation-delay:0.1s] [animation-fill-mode:backwards]"
         style={
            {
               '--folder-bg': isGeneralTabActive
                  ? 'var(--color-surface)'
                  : FOLDER_BG[activeTab],
               '--folder-accent': isGeneralTabActive
                  ? 'var(--color-text-secondary)'
                  : FOLDER_ACCENT[activeTab],
            } as React.CSSProperties
         }
      >
         {/* Cabecera General — ancla full-width, activa o como barra de retorno */}
         <GeneralTab active={isGeneralTabActive} onClick={() => onTabChange(null)} />

         {/* Tabs de tipo — solo cuando hay un tipo activo */}
         {!isGeneralTabActive && (
            <div className="grid grid-cols-2 gap-4 mt-3 animate-fade-in">
               <FolderTab
                  label="Ingresos"
                  value={formatCurrency(totalIngresos)}
                  icon={<TrendingUp size={16} />}
                  accentClass="text-accent"
                  bubbleClass="bg-accent/12"
                  iconBgClass="bg-accent/15"
                  active={activeTab === 'INGRESO'}
                  side="left"
                  onClick={() => onTabChange('INGRESO')}
               />

               <FolderTab
                  label="Egresos"
                  value={formatCurrency(totalEgresos)}
                  icon={<TrendingDown size={16} />}
                  accentClass="text-danger"
                  bubbleClass="bg-danger/12"
                  iconBgClass="bg-danger/15"
                  active={activeTab === 'EGRESO'}
                  side="right"
                  onClick={() => onTabChange('EGRESO')}
               />
            </div>
         )}

         {/* Body persistente — el bg morfea suave entre surface y el tinte del tipo */}
         <div
            className={cn(
               'p-5 transition-[border-radius] duration-300',
               isGeneralTabActive ? 'mt-0' : 'mt-4',
               bodyRadius
            )}
            style={{ backgroundColor: 'var(--folder-bg)' }}
         >
            <div
               key={activeTab ?? 'general'}
               className="flex flex-col gap-5 animate-fade-in"
            >
               <FolderBody
                  activeTab={activeTab}
                  filtered={filtered}
                  distribucion={distribucion}
                  totalIngresos={totalIngresos}
                  totalEgresos={totalEgresos}
                  onTabChange={onTabChange}
                  onEdit={onEdit}
               />
            </div>
         </div>
      </div>
   )
}
