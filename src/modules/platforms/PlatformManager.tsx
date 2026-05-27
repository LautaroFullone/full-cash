import { X, Plus, Trash2, Loader2, CreditCard } from 'lucide-react'
import type { Plataforma } from '@/models/plataforma'
import { PrimaryButton } from '@/components'
import { useState } from 'react'
import { cn } from '@/utils/cn'

interface PlatformManagerProps {
   plataformas: Plataforma[]
   onClose: () => void
   onCreate: (nombre: string) => Promise<unknown>
   onDelete: (id: string) => Promise<unknown>
}

export const PlatformManager: React.FC<PlatformManagerProps> = ({
   plataformas,
   onClose,
   onCreate,
   onDelete,
}) => {
   const [addingNew, setAddingNew] = useState(false)
   const [nombre, setNombre] = useState('')
   const [saving, setSaving] = useState(false)
   const [deletingId, setDeletingId] = useState<string | null>(null)
   const [deleteError, setDeleteError] = useState<string | null>(null)

   const handleCreate = async () => {
      if (!nombre.trim()) return
      setSaving(true)
      await onCreate(nombre.trim())
      setNombre('')
      setAddingNew(false)
      setSaving(false)
   }

   const handleDelete = async (id: string) => {
      setDeleteError(null)
      setDeletingId(id)
      try {
         await onDelete(id)
      } catch (err) {
         setDeleteError(
            err instanceof Error
               ? err.message
               : 'No se puede eliminar: tiene movimientos asociados'
         )
      } finally {
         setDeletingId(null)
      }
   }

   return (
      <div
         className="modal-overlay fixed inset-0 bg-black/70 backdrop-blur-lg z-60 flex justify-center"
         onClick={onClose}
      >
         <div
            className="modal-sheet animate-slide-up bg-surface overflow-y-auto"
            style={{
               maxHeight: '88dvh',
               paddingLeft: '20px',
               paddingRight: '20px',
               paddingBottom: '40px',
            }}
            onClick={(e) => e.stopPropagation()}
         >
            <div className="lg:hidden w-10 h-1 rounded-full bg-border-strong mx-auto mt-3 mb-5" />

            <div className="flex items-center justify-between mb-5">
               <div>
                  <h2 className="text-lg font-bold">Plataformas</h2>
                  <p className="text-[13px] text-text-muted mt-0.5">
                     {plataformas.length}{' '}
                     {plataformas.length === 1 ? 'plataforma' : 'plataformas'}
                  </p>
               </div>
               <button
                  onClick={onClose}
                  className="bg-transparent border-none text-text-muted p-1 cursor-pointer hover:text-white transition-colors"
               >
                  <X size={20} />
               </button>
            </div>

            {deleteError && (
               <div className="px-3.5 py-2.5 rounded-md bg-danger/10 border border-danger/30 mb-3 text-[13px] text-danger">
                  {deleteError}
               </div>
            )}

            <div className="flex flex-col gap-1.5">
               {plataformas.map((plat) => (
                  <div
                     key={plat.id}
                     className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-md border border-transparent transition-all duration-150 hover:bg-white/3 hover:border-border',
                        deletingId === plat.id && 'opacity-40'
                     )}
                  >
                     <div className="w-9 h-9 rounded-sm bg-white/5 flex items-center justify-center shrink-0">
                        <CreditCard size={16} className="text-text-muted" />
                     </div>
                     <span className="flex-1 text-sm font-medium text-white">
                        {plat.nombre}
                     </span>
                     <button
                        onClick={() => handleDelete(plat.id)}
                        disabled={!!deletingId}
                        className="w-7.5 h-7.5 rounded-xs border-none bg-transparent text-text-muted flex items-center justify-center cursor-pointer hover:bg-danger/10 hover:text-danger transition-all duration-150"
                     >
                        {deletingId === plat.id ? (
                           <Loader2 size={13} className="animate-spin" />
                        ) : (
                           <Trash2 size={13} />
                        )}
                     </button>
                  </div>
               ))}

               {addingNew ? (
                  <div className="flex gap-2 items-center p-3 bg-accent/4 rounded-md border border-accent/20">
                     <input
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="flex-1 text-sm"
                        placeholder="Nombre de la plataforma..."
                        onKeyDown={(e) => {
                           if (e.key === 'Enter') handleCreate()
                           if (e.key === 'Escape') {
                              setAddingNew(false)
                              setNombre('')
                           }
                        }}
                        autoFocus
                     />
                     <button
                        type="button"
                        onClick={handleCreate}
                        disabled={saving || !nombre.trim()}
                        className="w-9 h-9 rounded-sm border-none bg-accent text-background flex items-center justify-center disabled:opacity-50 cursor-pointer"
                     >
                        {saving ? (
                           <Loader2 size={14} className="animate-spin" />
                        ) : (
                           <Plus size={14} />
                        )}
                     </button>
                     <button
                        type="button"
                        onClick={() => {
                           setAddingNew(false)
                           setNombre('')
                        }}
                        className="w-9 h-9 rounded-sm border border-border-strong bg-transparent text-text-muted flex items-center justify-center cursor-pointer"
                     >
                        <X size={14} />
                     </button>
                  </div>
               ) : (
                  <PrimaryButton
                     size="md"
                     fullWidth
                     icon={<Plus size={15} strokeWidth={2.5} />}
                     onClick={() => setAddingNew(true)}
                  >
                     Nueva plataforma
                  </PrimaryButton>
               )}
            </div>
         </div>
      </div>
   )
}
