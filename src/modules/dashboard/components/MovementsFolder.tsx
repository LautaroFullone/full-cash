import type { Movimiento } from '@/modules/movements/services/getMovimientos'
import { MovementList } from '@/modules/movements/components/MovementList'
import { FOLDER_BG, FOLDER_ACCENT } from '../utils/folderColors'
import type { TipoMovimiento } from '@/models/categoria'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { MovementTimeline } from './MovementTimeline'
import { CategoryChart } from './CategoryChart'
import { TodoControl } from './TodoControl'
import { formatCurrency } from '@/utils'
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
   const isTodos = activeTab === null

   const filtered = useMemo(
      () => (isTodos ? movimientos : movimientos.filter((m) => m.tipo === activeTab)),
      [movimientos, activeTab, isTodos]
   )

   const distribucion = useMemo(() => {
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

   return (
      <div
         className="animate-slide-up [animation-delay:0.1s] [animation-fill-mode:backwards]"
         style={
            {
               '--folder-bg': isTodos ? 'var(--color-surface)' : FOLDER_BG[activeTab],
               '--folder-accent': isTodos ? 'transparent' : FOLDER_ACCENT[activeTab],
            } as React.CSSProperties
         }
      >
         <div className="mb-3">
            <TodoControl active={isTodos} onClick={() => onTabChange(null)} />
         </div>

         <div className="grid grid-cols-2 gap-4">
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

         <div
            className={cn(
               'mt-4 p-5 flex flex-col gap-5 transition-colors duration-200',
               isTodos
                  ? 'rounded-lg'
                  : activeTab === 'INGRESO'
                    ? 'rounded-b-lg rounded-tr-lg'
                    : 'rounded-b-lg rounded-tl-lg'
            )}
            style={{ backgroundColor: 'var(--folder-bg)' }}
         >
            {isTodos ? (
               <MovementTimeline movimientos={filtered} onEdit={onEdit} />
            ) : (
               <>
                  <CategoryChart distribucion={distribucion} tipo={activeTab} bare />

                  <div className="h-px bg-white/6" />

                  <MovementList
                     movimientos={filtered}
                     tipo={activeTab}
                     onEdit={onEdit}
                     bare
                  />
               </>
            )}
         </div>
      </div>
   )
}
