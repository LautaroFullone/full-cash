import type { Categoria, TipoMovimiento } from '@/models/categoria'
import type { PostCategoriaBody } from './services/postCategoria'
import type { PutCategoriaBody } from './services/putCategoria'
import { ConfirmModal, EntityManager } from '@/components'
import { EmojiPicker } from './components/EmojiPicker'
import { CategoryRow } from './components/CategoryRow'
import { Plus } from 'lucide-react'
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
   const [formError, setFormError] = useState('')

   const handleStartCreate = () => {
      setFormNombre('')
      setFormIcono('')
      setFormTipo(tab)
      setShowPicker(false)
      setFormError('')
      setView('create')
   }

   const handleStartEdit = (categoria: Categoria) => {
      setEditingCategoria(categoria)
      setFormNombre(categoria.nombre)
      setFormIcono(categoria.icono)
      setFormTipo(categoria.tipo)
      setShowPicker(false)
      setFormError('')
      setView('edit')
   }

   const handleCancelForm = () => {
      setView('list')
      setEditingCategoria(null)
      setFormNombre('')
      setFormIcono('')
      setFormTipo(tab)
      setShowPicker(false)
      setFormError('')
   }

   const handleCreate = async () => {
      setFormError('')
      setSaving(true)
      try {
         await onCreate({ nombre: formNombre.trim(), tipo: formTipo, icono: formIcono })
         handleCancelForm()
      } catch (err) {
         setFormError(err instanceof Error ? err.message : 'Error al crear categoría')
      } finally {
         setSaving(false)
      }
   }

   const handleSaveEdit = async () => {
      if (!editingCategoria) return
      setFormError('')
      setSaving(true)
      try {
         await onUpdate(editingCategoria.id, {
            nombre: formNombre.trim(),
            icono: formIcono,
            tipo: formTipo,
         })
         handleCancelForm()
      } catch (err) {
         setFormError(
            err instanceof Error ? err.message : 'Error al actualizar categoría'
         )
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

   const filtered = categorias.filter((c) => c.tipo === tab)
   const usedEmojis = categorias.map((c) => c.icono).filter(Boolean)
   const atLimit = categorias.filter((c) => c.userId !== null).length >= 20
   const formDisabled = !formNombre.trim() || !formIcono
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
              loading: saving,
              disabled: formDisabled,
              onClick: handleFormSubmit,
           }

   const secondaryBtn =
      view !== 'list' ? { label: 'Cancelar', onClick: handleCancelForm } : undefined

   const confirmTitle = confirmCategoria
      ? confirmCategoria.userId === null
         ? '¿Ocultar categoría?'
         : '¿Eliminar categoría?'
      : ''

   const confirmDescription = confirmCategoria
      ? confirmCategoria.userId === null
         ? 'Esta categoría dejará de aparecer en tu lista.'
         : (confirmCategoria.movimientoCount ?? 0) > 0
           ? `Tiene ${confirmCategoria.movimientoCount} movimiento${confirmCategoria.movimientoCount !== 1 ? 's' : ''}. Se reasignarán a "${confirmCategoria.tipo === 'EGRESO' ? 'Otros gastos' : 'Otros ingresos'}".`
           : 'Esta acción no puede deshacerse.'
      : undefined

   const confirmLabel = confirmCategoria?.userId === null ? 'Ocultar' : 'Eliminar'

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
                           {formIcono || '❓'}
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
                     <div className="flex gap-0.5 bg-background rounded-full p-0.75">
                        {(['EGRESO', 'INGRESO'] as TipoMovimiento[]).map((t) => (
                           <button
                              key={t}
                              type="button"
                              onClick={() => setFormTipo(t)}
                              className={cn(
                                 'flex-1 py-2 rounded-full border-none text-[13px] font-semibold font-body cursor-pointer transition-all duration-200',
                                 formTipo === t
                                    ? t === 'EGRESO'
                                       ? 'bg-danger/15 text-danger'
                                       : 'bg-accent/12 text-accent'
                                    : 'bg-transparent text-text-muted'
                              )}
                           >
                              {t === 'INGRESO' ? '↑ Ingreso' : '↓ Gasto'}
                           </button>
                        ))}
                     </div>
                  </div>
                  {formError && <p className="text-danger text-[13px]">{formError}</p>}
               </div>
            ) : (
               <>
                  <div className="flex gap-0.5 bg-background rounded-full p-0.75 mb-4">
                     {(['EGRESO', 'INGRESO'] as TipoMovimiento[]).map((t) => (
                        <button
                           key={t}
                           onClick={() => handleTabChange(t)}
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
                        Límite de 20 categorías propias alcanzado
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
            loading={confirming}
         />
      </>
   )
}
