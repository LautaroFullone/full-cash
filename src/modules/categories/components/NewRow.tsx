import type { PostCategoriaBody } from '../services/postCategoria'
import type { TipoMovimiento } from '@/models/categoria'
import { EmojiPicker } from './EmojiPicker'
import { X, ArrowRight, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/utils/cn'

interface NewRowProps {
   tipo: TipoMovimiento
   usedEmojis: string[]
   onSave: (data: PostCategoriaBody) => Promise<void>
   onCancel: () => void
}

export const NewRow: React.FC<NewRowProps> = ({ tipo, usedEmojis, onSave, onCancel }) => {
   const [nombre, setNombre] = useState('')
   const [icono, setIcono] = useState('')
   const [step, setStep] = useState<'name' | 'emoji'>('name')
   const [saving, setSaving] = useState(false)

   const canAdvance = nombre.trim().length > 0

   const handleAdvance = () => {
      if (canAdvance) setStep('emoji')
   }

   const handleSelectEmoji = async (emoji: string) => {
      setIcono(emoji)
      setSaving(true)
      await onSave({ nombre: nombre.trim(), tipo, icono: emoji })
      setSaving(false)
   }

   return (
      <div className="flex flex-col gap-2 p-3 bg-accent/4 rounded-md border border-accent/20">
         {step === 'name' ? (
            <div className="flex gap-2 items-center">
               <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="flex-1 text-sm"
                  placeholder={`Nueva categoría de ${tipo === 'INGRESO' ? 'ingreso' : 'gasto'}...`}
                  onKeyDown={(e) => {
                     if (e.key === 'Enter') handleAdvance()
                     if (e.key === 'Escape') onCancel()
                  }}
                  autoFocus
               />
               <button
                  type="button"
                  onClick={handleAdvance}
                  disabled={!canAdvance}
                  className={cn(
                     'h-9 px-3 rounded-sm text-[12px] font-semibold flex items-center gap-1.5 shrink-0 transition-all duration-150',
                     canAdvance
                        ? 'bg-accent text-background cursor-pointer active:scale-[0.96]'
                        : 'bg-white/5 text-text-muted cursor-not-allowed opacity-40'
                  )}
               >
                  Emoji
                  <ArrowRight size={12} />
               </button>
               <button
                  type="button"
                  onClick={onCancel}
                  className="w-9 h-9 rounded-sm border border-border-strong bg-transparent text-text-muted flex items-center justify-center cursor-pointer"
               >
                  <X size={14} />
               </button>
            </div>
         ) : (
            <>
               <div className="flex gap-2 items-center">
                  <div className="w-10 h-10 rounded-sm bg-background shrink-0 flex items-center justify-center text-xl border border-border">
                     {icono || '❓'}
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-sm font-medium text-white truncate">{nombre}</p>
                     <p className="text-[11px] text-text-muted leading-none mt-0.5">
                        Elegí un emoji
                     </p>
                  </div>
                  {saving && (
                     <Loader2 size={15} className="animate-spin text-accent shrink-0" />
                  )}
                  <button
                     type="button"
                     onClick={onCancel}
                     className="w-9 h-9 rounded-sm border border-border-strong bg-transparent text-text-muted flex items-center justify-center cursor-pointer"
                  >
                     <X size={14} />
                  </button>
               </div>
               <div className="animate-fade-in">
                  <EmojiPicker
                     selected={icono}
                     usedEmojis={usedEmojis}
                     onSelect={handleSelectEmoji}
                  />
               </div>
            </>
         )}
      </div>
   )
}
