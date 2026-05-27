import {
   AlertCircle,
   TrendingUp,
   TrendingDown,
   Loader2,
   Check,
   Trash2,
   X,
} from 'lucide-react'
import { CategoryIcon } from '@/modules/categories/components/CategoryIcon'
import type { Categoria, TipoMovimiento } from '@/models/categoria'
import type { PutMovimientoBody } from '../services/putMovimiento'
import type { Movimiento } from '../services/getMovimientos'
import { ConfirmModal } from '@/components'
import type { Plataforma } from '@/models/plataforma'
import { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { cn } from '@/utils/cn'
import { CurrencyInput, DatePicker, PlatformSelect, toast } from '@/components'

interface EditMovementFormProps {
   movimiento: Movimiento | null
   categorias: Categoria[]
   plataformas: Plataforma[]
   onUpdate: (id: string, data: PutMovimientoBody) => Promise<unknown> | void
   onDelete: (id: string) => Promise<unknown> | void
   onClose: () => void
}

import { FormLabel } from './FormLabel'

export const EditMovementForm: React.FC<EditMovementFormProps> = ({
   movimiento,
   categorias,
   plataformas,
   onUpdate,
   onDelete,
   onClose,
}) => {
   const [tipo, setTipo] = useState<TipoMovimiento>('EGRESO')
   const [concepto, setConcepto] = useState('')
   const [monto, setMonto] = useState<number | ''>('')
   const [categoriaId, setCategoriaId] = useState('')
   const [plataformaId, setPlataformaId] = useState('')
   const [fecha, setFecha] = useState(format(new Date(), 'yyyy-MM-dd'))
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState('')
   const [confirmDelete, setConfirmDelete] = useState(false)
   const [mounted, setMounted] = useState(false)
   const [closing, setClosing] = useState(false)
   const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

   useEffect(() => {
      if (movimiento) {
         clearTimeout(timerRef.current)
         setMounted(true)
         setClosing(false)
         setTipo(movimiento.tipo)
         setConcepto(movimiento.concepto)
         setMonto(movimiento.monto)
         setCategoriaId(movimiento.categoriaId)
         setPlataformaId(movimiento.plataformaId ?? '')
         setFecha(format(new Date(movimiento.fecha), 'yyyy-MM-dd'))
         setError('')
      }
   }, [movimiento])

   useEffect(() => () => clearTimeout(timerRef.current), [])

   const handleClose = () => {
      setClosing(true)
      timerRef.current = setTimeout(() => {
         setMounted(false)
         setClosing(false)
         onClose()
      }, 250)
   }

   const filteredCategorias = categorias.filter((c) => c.tipo === tipo)

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!movimiento) return
      if (!concepto.trim()) {
         setError('Ingresá un concepto')
         return
      }
      if (!monto || monto <= 0) {
         setError('Ingresá un monto válido')
         return
      }
      if (!categoriaId) {
         setError('Seleccioná una categoría')
         return
      }
      try {
         setLoading(true)
         setError('')
         await onUpdate(movimiento.id, {
            concepto: concepto.trim(),
            monto: Number(monto),
            tipo,
            categoriaId,
            plataformaId: plataformaId || null,
            fecha: new Date(fecha + 'T12:00:00').toISOString(),
         })
         toast.success('Movimiento actualizado')
         handleClose()
      } catch {
         setError('Error al guardar los cambios')
      } finally {
         setLoading(false)
      }
   }

   const handleDelete = async () => {
      if (!movimiento) return
      setConfirmDelete(false)
      try {
         await onDelete(movimiento.id)
         toast.success('Movimiento eliminado')
         handleClose()
      } catch {
         toast.error('Error al eliminar el movimiento')
      }
   }

   if (!mounted) return null

   return (
      <>
         <div
            className={cn(
               'modal-overlay fixed inset-0 bg-black/65 backdrop-blur-md z-50 flex justify-center',
               closing ? 'animate-overlay-out' : 'animate-overlay-in'
            )}
            onClick={handleClose}
         >
            <div
               className={cn(
                  'modal-sheet bg-surface overflow-y-auto',
                  closing ? 'animate-slide-down' : 'animate-slide-up'
               )}
               style={{
                  maxHeight: '92dvh',
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  paddingBottom: '40px',
               }}
               onClick={(e) => e.stopPropagation()}
            >
               <div className="lg:hidden w-12 h-1 rounded-full bg-border-strong mx-auto mt-3 mb-5" />

               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">Editar movimiento</h2>
                  <button
                     onClick={handleClose}
                     className="w-10 h-10 flex items-center justify-center rounded-sm bg-transparent border border-border-strong text-text-muted cursor-pointer hover:border-border hover:text-white transition-colors duration-150"
                  >
                     <X size={16} />
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
                  <div>
                     <FormLabel>Tipo</FormLabel>
                     <div className="grid grid-cols-2 rounded-md overflow-hidden border border-border-strong">
                        {(['INGRESO', 'EGRESO'] as TipoMovimiento[]).map((t) => (
                           <button
                              key={t}
                              type="button"
                              onClick={() => {
                                 setTipo(t)
                                 setCategoriaId('')
                              }}
                              className={cn(
                                 'flex items-center justify-center gap-2 py-3 border-none text-sm font-bold font-body cursor-pointer transition-colors duration-200',
                                 tipo === t
                                    ? t === 'INGRESO'
                                       ? 'bg-accent text-background-deep'
                                       : 'bg-danger text-white'
                                    : 'bg-background text-text-muted hover:text-text-secondary'
                              )}
                           >
                              {t === 'INGRESO' ? (
                                 <TrendingUp size={15} strokeWidth={2.5} />
                              ) : (
                                 <TrendingDown size={15} strokeWidth={2.5} />
                              )}
                              {t === 'INGRESO' ? 'Ingreso' : 'Gasto'}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div
                     className={cn(
                        'rounded-md px-5 py-6 border transition-colors duration-300',
                        tipo === 'INGRESO'
                           ? 'bg-accent/6 border-accent/20'
                           : 'bg-danger/6 border-danger/20'
                     )}
                  >
                     <p className="text-[10px] font-bold text-text-muted uppercase tracking-[1px] text-center mb-4">
                        Monto
                     </p>
                     <CurrencyInput
                        value={monto}
                        onChange={setMonto}
                        variant="hero"
                        color={tipo === 'INGRESO' ? 'accent' : 'danger'}
                     />
                  </div>

                  <div>
                     <FormLabel>Concepto</FormLabel>
                     <input
                        value={concepto}
                        onChange={(e) => setConcepto(e.target.value)}
                        placeholder="Ej: Sueldo, Supermercado..."
                        maxLength={100}
                        className="w-full"
                     />
                  </div>

                  <div>
                     <FormLabel>Categoría</FormLabel>
                     {filteredCategorias.length === 0 ? (
                        <p className="text-[13px] text-text-muted py-2">
                           No hay categorías de {tipo === 'INGRESO' ? 'ingreso' : 'gasto'}
                           .
                        </p>
                     ) : (
                        <div className="flex flex-wrap gap-2">
                           {filteredCategorias.map((cat) => (
                              <button
                                 key={cat.id}
                                 type="button"
                                 onClick={() => setCategoriaId(cat.id)}
                                 className={cn(
                                    'flex items-center gap-1.5 py-1.75 px-3 rounded-full border text-[13px] font-body cursor-pointer transition-colors duration-150',
                                    categoriaId === cat.id
                                       ? 'border-accent bg-accent/10 text-accent'
                                       : 'border-border-strong bg-background text-text-secondary hover:bg-white/4 hover:text-white'
                                 )}
                              >
                                 <CategoryIcon icono={cat.icono} size={14} />
                                 {cat.nombre}
                              </button>
                           ))}
                        </div>
                     )}
                  </div>

                  <div>
                     <FormLabel>Plataforma (opcional)</FormLabel>
                     <PlatformSelect
                        value={plataformaId}
                        onChange={setPlataformaId}
                        plataformas={plataformas}
                     />
                  </div>

                  <div>
                     <FormLabel>Fecha</FormLabel>
                     <DatePicker value={fecha} onChange={setFecha} />
                  </div>

                  {error && (
                     <div className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-danger/10 border border-danger/20">
                        <AlertCircle size={14} className="text-danger shrink-0" />
                        <p className="text-[13px] text-danger font-medium">{error}</p>
                     </div>
                  )}

                  <button
                     type="submit"
                     disabled={loading}
                     className="w-full h-12 rounded-md border-none flex items-center justify-center gap-2 text-sm font-bold cursor-pointer bg-accent text-background disabled:opacity-50 transition-[background-color,opacity] duration-200"
                  >
                     {loading ? (
                        <Loader2 size={16} className="animate-spin" />
                     ) : (
                        <Check size={16} />
                     )}
                     Guardar cambios
                  </button>

                  <button
                     type="button"
                     onClick={() => setConfirmDelete(true)}
                     className="w-full h-11 rounded-md border-none bg-danger/12 flex items-center justify-center gap-2 text-sm font-medium cursor-pointer text-danger hover:bg-danger/18 transition-[background-color] duration-150"
                  >
                     <Trash2 size={14} />
                     Eliminar movimiento
                  </button>
               </form>
            </div>
         </div>

         <ConfirmModal
            open={confirmDelete}
            onCancel={() => setConfirmDelete(false)}
            onConfirm={handleDelete}
            title="¿Eliminar movimiento?"
            description="Esta acción no se puede deshacer."
            confirmLabel="Eliminar"
            confirmVariant="danger"
         />
      </>
   )
}
