import type { Categoria, TipoMovimiento } from '@/models/categoria'
import type { PostCategoriaBody } from './services/postCategoria'
import type { PutCategoriaBody } from './services/putCategoria'
import { Plus, Pencil, Trash2, EyeOff } from 'lucide-react'
import { CategoryIcon } from './components/CategoryIcon'
import { EntityManager } from '@/components'
import { EditRow } from './components/EditRow'
import { NewRow } from './components/NewRow'
import { useState } from 'react'
import { cn } from '@/utils/cn'

interface CategoryManagerProps {
   categorias: Categoria[]
   onClose: () => void
   onCreate: (data: PostCategoriaBody) => Promise<void> | void
   onUpdate: (id: string, data: PutCategoriaBody) => Promise<void> | void
   onDelete: (id: string) => Promise<void> | void
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
   categorias,
   onClose,
   onCreate,
   onUpdate,
   onDelete,
}) => {
   const [tab, setTab] = useState<TipoMovimiento>('EGRESO')
   const [editingId, setEditingId] = useState<string | null>(null)
   const [addingNew, setAddingNew] = useState(false)
   const [deletingId, setDeletingId] = useState<string | null>(null)
   const [deleteError, setDeleteError] = useState<string | null>(null)

   const usedEmojis = categorias.map((c) => c.icono).filter(Boolean)
   const filtered = categorias.filter((c) => c.tipo === tab)
   const userCategorias = categorias.filter((c) => c.userId !== null)
   const atLimit = userCategorias.length >= 20

   const handleDelete = async (id: string) => {
      setDeleteError(null)
      setDeletingId(id)
      try {
         await onDelete(id)
      } catch (err) {
         setDeleteError(err instanceof Error ? err.message : 'Error al eliminar')
      } finally {
         setDeletingId(null)
      }
   }

   return (
      <EntityManager
         title="Categorías"
         description={`${categorias.length} categorías en total`}
         onClose={onClose}
         primaryBtn={
            !addingNew && !editingId && !atLimit
               ? {
                    icon: Plus,
                    label: `Nueva categoría de ${tab === 'INGRESO' ? 'ingreso' : 'gasto'}`,
                    onClick: () => setAddingNew(true),
                 }
               : undefined
         }
      >
         <div className="flex gap-0.5 bg-background rounded-full p-0.75 mb-4">
            {(['EGRESO', 'INGRESO'] as TipoMovimiento[]).map((t) => (
               <button
                  key={t}
                  onClick={() => {
                     setTab(t)
                     setAddingNew(false)
                     setEditingId(null)
                  }}
                  className={cn(
                     'flex-1 py-2 rounded-full border-none text-[13px] font-semibold font-body cursor-pointer transition-all duration-200',
                     tab === t
                        ? t === 'EGRESO'
                           ? 'bg-danger/15 text-danger'
                           : 'bg-accent/12 text-accent'
                        : 'bg-transparent text-text-muted'
                  )}
               >
                  {t === 'INGRESO' ? '↑ Ingresos' : '↓ Gastos'} (
                  {categorias.filter((c) => c.tipo === t).length})
               </button>
            ))}
         </div>

         {deleteError && (
            <div className="px-3.5 py-2.5 rounded-md bg-danger/10 border border-danger/30 mb-3 text-[13px] text-danger">
               {deleteError}
            </div>
         )}

         <div className="flex flex-col gap-1.5">
            {filtered.map((cat) =>
               editingId === cat.id ? (
                  <EditRow
                     key={cat.id}
                     categoria={cat}
                     usedEmojis={usedEmojis}
                     onSave={async (data) => {
                        await onUpdate(cat.id, data)
                        setEditingId(null)
                     }}
                     onCancel={() => setEditingId(null)}
                  />
               ) : (
                  <div
                     key={cat.id}
                     className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-md border border-transparent transition-all duration-150 hover:bg-white/3 hover:border-border',
                        deletingId === cat.id && 'opacity-40'
                     )}
                  >
                     <div className="w-9.5 h-9.5 rounded-sm bg-white/5 flex items-center justify-center shrink-0">
                        <CategoryIcon icono={cat.icono} size={20} />
                     </div>
                     <span className="flex-1 text-sm font-medium text-white">
                        {cat.nombre}
                     </span>

                     {cat.userId === null ? (
                        <button
                           onClick={() => handleDelete(cat.id)}
                           disabled={!!deletingId}
                           title="Ocultar de mi lista"
                           className="w-7.5 h-7.5 rounded-xs border-none bg-transparent text-text-muted flex items-center justify-center cursor-pointer hover:bg-white/8 hover:text-text-secondary transition-all duration-150"
                        >
                           <EyeOff size={13} />
                        </button>
                     ) : (
                        <div className="flex gap-1">
                           <button
                              onClick={() => {
                                 setEditingId(cat.id)
                                 setAddingNew(false)
                              }}
                              className="w-7.5 h-7.5 rounded-xs border-none bg-transparent text-text-muted flex items-center justify-center cursor-pointer hover:bg-white/8 hover:text-white transition-all duration-150"
                           >
                              <Pencil size={13} />
                           </button>
                           <button
                              onClick={() => handleDelete(cat.id)}
                              disabled={!!deletingId}
                              className="w-7.5 h-7.5 rounded-xs border-none bg-transparent text-text-muted flex items-center justify-center cursor-pointer hover:bg-danger/10 hover:text-danger transition-all duration-150"
                           >
                              <Trash2 size={13} />
                           </button>
                        </div>
                     )}
                  </div>
               )
            )}

            {addingNew && !editingId && (
               <NewRow
                  tipo={tab}
                  usedEmojis={usedEmojis}
                  onSave={async (data) => {
                     await onCreate(data)
                     setAddingNew(false)
                  }}
                  onCancel={() => setAddingNew(false)}
               />
            )}
         </div>

         {atLimit && !addingNew && !editingId && (
            <p className="text-center text-[12px] text-text-muted py-1 mt-1">
               Límite de 20 categorías propias alcanzado
            </p>
         )}
      </EntityManager>
   )
}
