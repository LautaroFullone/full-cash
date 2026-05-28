import { ConfirmModal, EntityManager } from '@/components'
import { PlatformRow } from './components/PlatformRow'
import type { Plataforma } from '@/models/plataforma'
import { Plus } from 'lucide-react'
import { useState } from 'react'

interface PlatformManagerProps {
   plataformas: Plataforma[]
   onClose: () => void
   onCreate: (nombre: string) => Promise<void> | void
   onDelete: (id: string) => Promise<void> | void
}

export const PlatformManager: React.FC<PlatformManagerProps> = ({
   plataformas,
   onClose,
   onCreate,
   onDelete,
}) => {
   const [view, setView] = useState<'list' | 'create'>('list')
   const [nombre, setNombre] = useState('')
   const [saving, setSaving] = useState(false)
   const [formError, setFormError] = useState('')
   const [deletingId, setDeletingId] = useState<string | null>(null)
   const [deleteError, setDeleteError] = useState<string | null>(null)
   const [confirmPlataforma, setConfirmPlataforma] = useState<Plataforma | null>(null)
   const [confirming, setConfirming] = useState(false)

   const handleStartCreate = () => {
      setNombre('')
      setFormError('')
      setView('create')
   }

   const handleCancelForm = () => {
      setView('list')
      setNombre('')
      setFormError('')
   }

   const handleCreate = async () => {
      const trimmed = nombre.trim()
      const duplicate = plataformas.some(
         (p) => p.nombre.toLowerCase() === trimmed.toLowerCase()
      )
      if (duplicate) {
         setFormError('Ya existe una plataforma con ese nombre')
         return
      }
      setFormError('')
      setSaving(true)
      try {
         await onCreate(trimmed)
         handleCancelForm()
      } catch (err) {
         setFormError(err instanceof Error ? err.message : 'Error al crear plataforma')
      } finally {
         setSaving(false)
      }
   }

   const handleDeleteClick = (plat: Plataforma) => {
      setDeleteError(null)
      setConfirmPlataforma(plat)
   }

   const handleDelete = async (id: string) => {
      setDeletingId(id)
      setConfirming(true)
      try {
         await onDelete(id)
         setConfirmPlataforma(null)
      } catch (err) {
         setDeleteError(err instanceof Error ? err.message : 'Error al eliminar')
         setConfirmPlataforma(null)
      } finally {
         setDeletingId(null)
         setConfirming(false)
      }
   }

   const formDisabled = !nombre.trim()

   const primaryBtn =
      view === 'list'
         ? { icon: Plus, label: 'Nueva plataforma', onClick: handleStartCreate }
         : {
              label: 'Crear',
              isLoading: saving,
              disabled: formDisabled,
              onClick: handleCreate,
           }

   const secondaryBtn =
      view === 'create' ? { label: 'Cancelar', onClick: handleCancelForm } : undefined

   const confirmCount = confirmPlataforma?.movimientoCount ?? 0
   const confirmDescription =
      confirmCount > 0
         ? `Tiene ${confirmCount} movimiento${confirmCount !== 1 ? 's' : ''} asociado${confirmCount !== 1 ? 's' : ''}. Los movimientos no se eliminarán pero quedarán sin plataforma asignada. Esta acción no puede deshacerse.`
         : 'Se eliminará esta plataforma de tu lista. Los movimientos existentes no se verán afectados. Esta acción no puede deshacerse.'

   return (
      <>
         <EntityManager
            title={view === 'list' ? 'Plataformas' : 'Nueva plataforma'}
            description={
               view === 'list'
                  ? `${plataformas.length} ${plataformas.length === 1 ? 'plataforma' : 'plataformas'}`
                  : undefined
            }
            onClose={onClose}
            primaryBtn={primaryBtn}
            secondaryBtn={secondaryBtn}
         >
            {view === 'create' ? (
               <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                     <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                        Nombre
                     </label>
                     <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Nombre de la plataforma"
                        autoFocus
                        maxLength={100}
                        onKeyDown={(e) =>
                           e.key === 'Enter' && !formDisabled && handleCreate()
                        }
                     />
                  </div>
                  {formError && <p className="text-danger text-[13px]">{formError}</p>}
               </div>
            ) : (
               <>
                  {deleteError && (
                     <div className="px-3.5 py-2.5 rounded-md bg-danger/10 border border-danger/30 mb-3 text-[13px] text-danger">
                        {deleteError}
                     </div>
                  )}

                  {plataformas.length === 0 ? (
                     <p className="text-center text-[13px] text-text-muted py-6">
                        No tenés plataformas creadas
                     </p>
                  ) : (
                     <div className="flex flex-col gap-2">
                        {plataformas.map((plat) => (
                           <PlatformRow
                              key={plat.id}
                              plataforma={plat}
                              isDeleting={deletingId === plat.id}
                              onDelete={handleDeleteClick}
                           />
                        ))}
                     </div>
                  )}
               </>
            )}
         </EntityManager>
         <ConfirmModal
            open={confirmPlataforma !== null}
            onCancel={() => setConfirmPlataforma(null)}
            onConfirm={() => handleDelete(confirmPlataforma!.id)}
            title="¿Eliminar plataforma?"
            description={confirmDescription}
            confirmLabel="Eliminar"
            isLoading={confirming}
         />
      </>
   )
}
