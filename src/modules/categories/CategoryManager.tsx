import type { Categoria, TipoMovimiento } from '@/models/categoria'
import type { UpdateCategoriaArgs } from './services/putCategoria'
import { CATEGORY_LIMIT_PER_TIPO } from '@/models/categoria'
import type { PostCategoriaBody } from './services/postCategoria'
import { MovementTypeToggle, ConfirmModal, EntityManager } from '@/components'
import { CategoryIcon } from './components/CategoryIcon'
import { EmojiPicker } from './components/EmojiPicker'
import { CategoryRow } from './components/CategoryRow'
import { sortCategorias } from '@/utils'
import { Plus } from 'lucide-react'
import { useState } from 'react'

interface CategoryManagerProps {
   categorias: Categoria[]
   onClose: () => void
   onCreate: (data: PostCategoriaBody) => Promise<void> | void
   onUpdate: (args: UpdateCategoriaArgs) => Promise<void> | void
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
   const [view, setView] = useState<'list' | 'create' | 'edit'>('list')
   const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null)
   const [deletingId, setDeletingId] = useState<string | null>(null)
   const [deleteError, setDeleteError] = useState<string | null>(null)
   const [confirmCategoria, setConfirmCategoria] = useState<Categoria | null>(null)
   const [confirming, setConfirming] = useState(false)
   const [formNombre, setFormNombre] = useState('')
   const [formIcono, setFormIcono] = useState('')
   const [formTipo, setFormTipo] = useState<TipoMovimiento>('EGRESO')
   const [showPicker, setShowPicker] = useState(false)
   const [saving, setSaving] = useState(false)

   const handleStartCreate = () => {
      setFormNombre('')
      setFormIcono('')
      setFormTipo(tab)
      setShowPicker(false)
      setView('create')
   }

   const handleStartEdit = (categoria: Categoria) => {
      setEditingCategoria(categoria)
      setFormNombre(categoria.nombre)
      setFormIcono(categoria.icono)
      setFormTipo(categoria.tipo)
      setShowPicker(false)
      setView('edit')
   }

   const handleCancelForm = () => {
      setView('list')
      setEditingCategoria(null)
      setFormNombre('')
      setFormIcono('')
      setFormTipo(tab)
      setShowPicker(false)
   }

   const handleCreate = async () => {
      setSaving(true)
      try {
         await onCreate({ nombre: formNombre.trim(), tipo: formTipo, icono: formIcono })
         handleCancelForm()
      } catch {
         // El error se muestra mediante el toast de useCategories
      } finally {
         setSaving(false)
      }
   }

   const handleSaveEdit = async () => {
      if (!editingCategoria) return
      setSaving(true)
      try {
         await onUpdate({
            id: editingCategoria.id,
            data: {
               nombre: formNombre.trim(),
               icono: formIcono,
               tipo: formTipo,
            },
         })
         handleCancelForm()
      } catch {
         // El error se muestra mediante el toast de useCategories
      } finally {
         setSaving(false)
      }
   }

   const handleDeleteClick = (cat: Categoria) => {
      setDeleteError(null)
      setConfirmCategoria(cat)
   }

   const handleDelete = async (id: string) => {
      setDeletingId(id)
      setConfirming(true)
      try {
         await onDelete(id)
         setConfirmCategoria(null)
      } catch (err) {
         setDeleteError(err instanceof Error ? err.message : 'Error al eliminar')
         setConfirmCategoria(null)
      } finally {
         setDeletingId(null)
         setConfirming(false)
      }
   }

   const handleTabChange = (t: TipoMovimiento) => {
      setTab(t)
      setDeleteError(null)
   }

   const filtered = sortCategorias(categorias.filter((c) => c.tipo === tab))
   const usedEmojis = categorias.map((c) => c.icono).filter(Boolean)
   const atLimit = filtered.length >= CATEGORY_LIMIT_PER_TIPO
   const formDisabled = !formNombre.trim()
   const handleFormSubmit = view === 'create' ? handleCreate : handleSaveEdit

   const title =
      view === 'list'
         ? 'Categorías'
         : view === 'create'
           ? 'Nueva categoría'
           : 'Editar categoría'

   const primaryBtn =
      view === 'list'
         ? atLimit
            ? undefined
            : {
                 icon: Plus,
                 label: 'Nueva categoría',
                 onClick: handleStartCreate,
              }
         : {
              label: view === 'create' ? 'Crear' : 'Guardar',
              isLoading: saving,
              disabled: formDisabled,
              onClick: handleFormSubmit,
           }

   const secondaryBtn =
      view !== 'list' ? { label: 'Cancelar', onClick: handleCancelForm } : undefined

   const confirmMovs =
      confirmCategoria && confirmCategoria.userId !== null
         ? (confirmCategoria.movimientoCount ?? 0)
         : 0

   const confirmDescription = confirmCategoria
      ? confirmMovs > 0
         ? `"${confirmCategoria.nombre}" tiene ${confirmMovs} movimiento${confirmMovs !== 1 ? 's' : ''} asociado${confirmMovs !== 1 ? 's' : ''}. Se reasignarán a "${confirmCategoria.tipo === 'EGRESO' ? 'Otros gastos' : 'Otros ingresos'}". Esta acción no puede deshacerse.`
         : `Se eliminará "${confirmCategoria.nombre}" de tu lista de categorías. Esta acción no puede deshacerse.`
      : undefined

   const confirmTitle = '¿Eliminar categoría?'
   const confirmLabel = 'Eliminar'

   return (
      <>
         <EntityManager
            title={title}
            description={
               view === 'list' ? `${categorias.length} categorías en total` : undefined
            }
            onClose={onClose}
            primaryBtn={primaryBtn}
            secondaryBtn={secondaryBtn}
         >
            {view !== 'list' ? (
               <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                     <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                           Icono
                        </label>

                        <button
                           type="button"
                           onClick={() => setShowPicker((v) => !v)}
                           className="w-10 h-10 rounded-lg border-2 border-border-strong bg-surface-elevated text-xl cursor-pointer flex items-center justify-center hover:border-accent/50 transition-[border-color]"
                        >
                           <CategoryIcon icono={formIcono} size={20} />
                        </button>
                     </div>
                     <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                           Nombre
                        </label>
                        <input
                           type="text"
                           value={formNombre}
                           onChange={(e) => setFormNombre(e.target.value)}
                           placeholder="Nombre de la categoría"
                           autoFocus
                           maxLength={100}
                           onKeyDown={(e) =>
                              e.key === 'Enter' && !formDisabled && handleFormSubmit()
                           }
                        />
                     </div>
                  </div>

                  {showPicker && (
                     <EmojiPicker
                        selected={formIcono}
                        usedEmojis={
                           view === 'edit'
                              ? usedEmojis.filter((e) => e !== editingCategoria?.icono)
                              : usedEmojis
                        }
                        onSelect={(e) => {
                           setFormIcono(e)
                           setShowPicker(false)
                        }}
                     />
                  )}

                  <div className="flex flex-col gap-1.5">
                     <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                        Tipo
                     </label>

                     <MovementTypeToggle
                        variant="soft"
                        value={formTipo}
                        onChange={setFormTipo}
                     />
                  </div>
               </div>
            ) : (
               <>
                  <div className="mb-4">
                     <MovementTypeToggle
                        variant="soft"
                        value={tab}
                        onChange={handleTabChange}
                        counts={{
                           INGRESO: categorias.filter((c) => c.tipo === 'INGRESO').length,
                           EGRESO: categorias.filter((c) => c.tipo === 'EGRESO').length,
                        }}
                     />
                  </div>

                  {deleteError && (
                     <div className="px-3.5 py-2.5 rounded-md bg-danger/10 border border-danger/30 mb-3 text-[13px] text-danger">
                        {deleteError}
                     </div>
                  )}

                  {filtered.length === 0 ? (
                     <p className="text-center text-[13px] text-text-muted py-6">
                        No hay categorías de {tab === 'INGRESO' ? 'ingreso' : 'gasto'}
                     </p>
                  ) : (
                     <div className="flex flex-col gap-2">
                        {filtered.map((cat) => (
                           <CategoryRow
                              key={cat.id}
                              categoria={cat}
                              isDeleting={deletingId === cat.id}
                              onEdit={handleStartEdit}
                              onDelete={handleDeleteClick}
                           />
                        ))}
                     </div>
                  )}

                  {atLimit && (
                     <p className="text-center text-[12px] text-text-muted py-1 mt-1">
                        Límite de {CATEGORY_LIMIT_PER_TIPO} categorías de{' '}
                        {tab === 'INGRESO' ? 'ingreso' : 'gasto'} alcanzado
                     </p>
                  )}
               </>
            )}
         </EntityManager>
         <ConfirmModal
            open={confirmCategoria !== null}
            onCancel={() => setConfirmCategoria(null)}
            onConfirm={() => handleDelete(confirmCategoria!.id)}
            title={confirmTitle}
            description={confirmDescription}
            confirmLabel={confirmLabel}
            isLoading={confirming}
         />
      </>
   )
}
