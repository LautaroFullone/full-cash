import { MovementList } from '@/modules/movements/components/MovementList'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '@/utils/formatCurrency'
import type { Movimiento } from '@/modules/movements/services/getMovimientos'
import type { TipoMovimiento } from '@/models/categoria'
import { CategoryChart } from './CategoryChart'
import { useMemo, useState } from 'react'
import { cn } from '@/utils/cn'

interface MovementsFolderProps {
   movimientos: Movimiento[]
   totalIngresos: number
   totalEgresos: number
   onDelete: (id: string) => Promise<unknown> | void
   onEdit: (mov: Movimiento) => void
}

const FOLDER_BG: Record<TipoMovimiento, string> = {
   INGRESO: 'color-mix(in srgb, var(--color-surface) 82%, var(--color-accent) 18%)',
   EGRESO: 'color-mix(in srgb, var(--color-surface) 82%, var(--color-danger) 18%)',
}

export const MovementsFolder: React.FC<MovementsFolderProps> = ({
   movimientos,
   totalIngresos,
   totalEgresos,
   onDelete,
   onEdit,
}) => {
   const [activeTab, setActiveTab] = useState<TipoMovimiento>('EGRESO')

   const filtered = useMemo(
      () => movimientos.filter((m) => m.tipo === activeTab),
      [movimientos, activeTab]
   )

   const distribucion = useMemo(() => {
      const map = new Map<string, { nombre: string; total: number }>()
      filtered.forEach((m) => {
         const cur = map.get(m.categoriaId)
         if (cur) cur.total += m.monto
         else
            map.set(m.categoriaId, {
               nombre: m.categoria?.nombre ?? '—',
               total: m.monto,
            })
      })
      const total = Array.from(map.values()).reduce((s, x) => s + x.total, 0)
      return Array.from(map.entries())
         .map(([categoriaId, data]) => ({
            categoriaId,
            categoriaNombre: data.nombre,
            total: data.total,
            porcentaje: total > 0 ? (data.total / total) * 100 : 0,
         }))
         .sort((a, b) => b.total - a.total)
   }, [filtered])

   return (
      <div
         className="animate-slide-up [animation-delay:0.1s] [animation-fill-mode:backwards]"
         style={{ '--folder-bg': FOLDER_BG[activeTab] } as React.CSSProperties}
      >
         {/* Tabs row — horizontal gap matches --radius-lg (16px) so the
             inverse-radius pseudo fits exactly within it. */}
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
               onClick={() => setActiveTab('INGRESO')}
            />
            <FolderTab
               label="Egresos"
               value={`-${formatCurrency(totalEgresos)}`}
               icon={<TrendingDown size={16} />}
               accentClass="text-danger"
               bubbleClass="bg-danger/12"
               iconBgClass="bg-danger/15"
               active={activeTab === 'EGRESO'}
               side="right"
               onClick={() => setActiveTab('EGRESO')}
            />
         </div>

         {/* Body — sits 16px below the tabs row (= --radius-lg). The active
             tab's box-shadow extends its bg through this gap; the inactive
             tab is left floating with a transparent gap. The body's corner
             opposite the active tab is rounded; the one under it stays flat
             so it merges flush with the active tab's extended bg. */}
         <div
            className={cn(
               'mt-4 p-5 flex flex-col gap-5 rounded-b-lg transition-colors duration-200',
               activeTab === 'INGRESO' ? 'rounded-tr-lg' : 'rounded-tl-lg'
            )}
            style={{ backgroundColor: 'var(--folder-bg)' }}
         >
            <CategoryChart distribucion={distribucion} tipo={activeTab} bare />
            <div className="h-px bg-white/6" />
            <MovementList
               movimientos={filtered}
               tipo={activeTab}
               onDelete={onDelete}
               onEdit={onEdit}
               actionVariant={activeTab === 'EGRESO' ? 'sheet' : 'inline'}
               bare
            />
         </div>
      </div>
   )
}

interface FolderTabProps {
   label: string
   value: string
   icon: React.ReactNode
   accentClass: string
   bubbleClass: string
   iconBgClass: string
   active: boolean
   side: 'left' | 'right'
   onClick: () => void
}

const FolderTab: React.FC<FolderTabProps> = ({
   label,
   value,
   icon,
   accentClass,
   bubbleClass,
   iconBgClass,
   active,
   side,
   onClick,
}) => (
   <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      data-active={active}
      data-side={side}
      className="folder-tab p-5"
   >
      {/* Decorative bubble — clipped by an inner wrapper that inherits the
          tab's border-radius. Kept separate from the button itself so the
          button can stay `overflow: visible` (otherwise the inverse-radius
          ::after pseudo would be clipped). */}
      <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none">
         <div
            className={cn(
               'absolute -top-2.5 -right-2.5 w-[60px] h-[60px] rounded-full',
               bubbleClass
            )}
         />
      </div>
      <div className="relative flex items-center gap-2 mb-3">
         <div
            className={cn(
               'w-8 h-8 rounded-sm flex items-center justify-center',
               iconBgClass,
               accentClass
            )}
         >
            {icon}
         </div>
         <span className="text-xs font-semibold text-text-muted uppercase tracking-[0.5px]">
            {label}
         </span>
      </div>
      <p
         className={cn(
            'relative font-heading text-[22px] font-bold tracking-[-0.5px] tabular-nums',
            accentClass
         )}
      >
         {value}
      </p>
   </button>
)
