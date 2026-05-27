import { TrendingUp, TrendingDown, AlertCircle, Plus, X, Loader2 } from 'lucide-react'
import { CategoryIcon } from '@/modules/categories/components/CategoryIcon'
import type { PostMovimientoBody } from '../services/postMovimiento'
import type { Categoria, TipoMovimiento } from '@/models/categoria'
import {
   CurrencyInput,
   DatePicker,
   PlatformSelect,
   PrimaryButton,
   toast,
} from '@/components'
import type { Plataforma } from '@/models/plataforma'
import { format } from 'date-fns'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/utils/cn'

interface MovementFormProps {
   categorias: Categoria[]
   plataformas: Plataforma[]
   onSubmit: (data: PostMovimientoBody) => Promise<void> | void
   isOpen?: boolean
   onClose?: () => void
   onOpen?: () => void
}

import { FormLabel } from './FormLabel'

export const MovementForm: React.FC<MovementFormProps> = ({
   categorias,
   plataformas,
   onSubmit,
   isOpen: controlledOpen,
   onClose: controlledClose,
   onOpen: controlledOnOpen,
}) => {
   const [internalOpen, setInternalOpen] = useState(false)
   const [tipo, setTipo] = useState<TipoMovimiento>('EGRESO')
   const [concepto, setConcepto] = useState('')
   const [monto, setMonto] = useState<number | ''>('')
   const [categoriaId, setCategoriaId] = useState('')
   const [plataformaId, setPlataformaId] = useState('')
   const [fecha, setFecha] = useState(format(new Date(), 'yyyy-MM-dd'))
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState('')

   // Exit animation state
   const [mounted, setMounted] = useState(false)
   const [closing, setClosing] = useState(false)
   const timerRef = useRef<ReturnType<typeof setTimeout>>()

   const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

   useEffect(() => {
      if (isOpen) {
         clearTimeout(timerRef.current)
         setMounted(true)
         setClosing(false)
      }
   }, [isOpen])

   // Cleanup on unmount
   useEffect(() => () => clearTimeout(timerRef.current), [])

   const handleOpen = () => {
      if (controlledOnOpen) controlledOnOpen()
      else setInternalOpen(true)
   }

   const handleClose = () => {
      setClosing(true)
      timerRef.current = setTimeout(() => {
         setMounted(false)
         setClosing(false)
         if (controlledClose) controlledClose()
         else setInternalOpen(false)
      }, 250)
   }

   const filteredCategorias = categorias.filter((c) => c.tipo === tipo)

   const resetForm = () => {
      setConcepto('')
      setMonto('')
      setCategoriaId('')
      setPlataformaId('')
      setFecha(format(new Date(), 'yyyy-MM-dd'))
      setError('')
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
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
         await onSubmit({
            concepto: concepto.trim(),
            monto: Number(monto),
            tipo,
            categoriaId,
            plataformaId: plataformaId || undefined,
            fecha: new Date(fecha + 'T12:00:00').toISOString(),
         })
         toast.success('Movimiento guardado')
         resetForm()
         handleClose()
      } catch {
         setError('Error al guardar el movimiento')
      } finally {
         setLoading(false)
      }
   }

   return (
      <>
         {/* FAB — solo mobile */}
         <button
            className="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full border-none flex items-center justify-center z-40 cursor-pointer transition-transform duration-200 hover:scale-[1.06] active:scale-[0.96]"
            style={{
               background:
                  'linear-gradient(135deg, var(--color-accent), var(--color-accent-dim))',
               boxShadow: '0 4px 20px rgba(229,255,166,0.3)',
            }}
            onClick={handleOpen}
            aria-label="Nuevo movimiento"
         >
            <Plus size={24} color="#003a34" strokeWidth={2.5} />
         </button>

         {mounted && (
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
                  {/* Drag handle — solo mobile */}
                  <div className="lg:hidden w-12 h-1 rounded-full bg-border-strong mx-auto mt-3 mb-5" />

                  {/* Header del modal */}
                  <div className="flex items-center justify-between mb-6">
                     <h2 className="text-lg font-bold text-wrap-balance">
                        Nuevo movimiento
                     </h2>
                     {/* w-10 h-10 = 40×40px hit area mínimo */}
                     <button
                        onClick={handleClose}
                        className="w-10 h-10 flex items-center justify-center rounded-sm bg-transparent border border-border-strong text-text-muted cursor-pointer hover:border-border hover:text-white transition-colors duration-150"
                     >
                        <X size={16} />
                     </button>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
                     {/* Tipo */}
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
                                    'flex items-center justify-center gap-2 py-3 border-none text-sm font-bold font-body cursor-pointer transition-colors duration-200 active:scale-[0.96]',
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

                     {/* Monto — misma jerarquía visual que Tipo */}
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

                     {/* Concepto */}
                     <div>
                        <FormLabel>Concepto</FormLabel>
                        <input
                           value={concepto}
                           onChange={(e) => setConcepto(e.target.value)}
                           placeholder="Ej: Sueldo, Supermercado..."
                           className="w-full"
                        />
                     </div>

                     {/* Categoría */}
                     <div>
                        <FormLabel>Categoría</FormLabel>
                        {filteredCategorias.length === 0 ? (
                           <p className="text-[13px] text-text-muted py-2">
                              No hay categorías de{' '}
                              {tipo === 'INGRESO' ? 'ingreso' : 'gasto'}.
                           </p>
                        ) : (
                           <div className="flex flex-wrap gap-2">
                              {filteredCategorias.map((cat) => (
                                 <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategoriaId(cat.id)}
                                    className={cn(
                                       'flex items-center gap-1.5 py-1.75 px-3 rounded-full border text-[13px] font-body cursor-pointer transition-colors duration-150 active:scale-[0.96]',
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

                     {/* Plataforma */}
                     <div>
                        <FormLabel>Plataforma (opcional)</FormLabel>
                        <PlatformSelect
                           value={plataformaId}
                           onChange={setPlataformaId}
                           plataformas={plataformas}
                        />
                     </div>

                     {/* Fecha */}
                     <div>
                        <FormLabel>Fecha</FormLabel>
                        <DatePicker value={fecha} onChange={setFecha} />
                     </div>

                     {/* Error */}
                     {error && (
                        <div className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-danger/10 border border-danger/20">
                           <AlertCircle size={14} className="text-danger shrink-0" />
                           <p className="text-[13px] text-danger font-medium">{error}</p>
                        </div>
                     )}

                     {/* Submit */}
                     <PrimaryButton
                        size="lg"
                        fullWidth
                        loading={loading}
                        icon={<Plus size={18} />}
                        type="submit"
                        className="mt-1 active:scale-[0.98] transition-[background-color,opacity,transform] duration-200"
                     >
                        Guardar movimiento
                     </PrimaryButton>
                  </form>
               </div>
            </div>
         )}
      </>
   )
}
