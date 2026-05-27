import type { PutCategoriaBody } from '../services/putCategoria'
import type { Categoria } from '@/models/categoria'
import { EmojiPicker } from './EmojiPicker'
import { X, Check, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface EditRowProps {
   categoria: Categoria
   usedEmojis: string[]
   onSave: (data: PutCategoriaBody) => Promise<void>
   onCancel: () => void
}

export const EditRow: React.FC<EditRowProps> = ({
   categoria,
   usedEmojis,
   onSave,
   onCancel,
}) => {
   const [nombre, setNombre] = useState(categoria.nombre)
   const [icono, setIcono] = useState(categoria.icono)
   const [showPicker, setShowPicker] = useState(false)
   const [saving, setSaving] = useState(false)

   const handleSave = async () => {
      if (!nombre.trim()) return
      setSaving(true)
      await onSave({ nombre: nombre.trim(), icono })
      setSaving(false)
   }

   return (
      <div className="flex flex-col gap-2 p-3 bg-accent/4 rounded-md border border-accent/15">
         <div className="flex gap-2 items-center">
            <button
               type="button"
               onClick={() => setShowPicker((v) => !v)}
               className="w-10 h-10 rounded-sm border border-border-strong bg-background text-xl cursor-pointer shrink-0 flex items-center justify-center"
            >
               {icono || '❓'}
            </button>
            <input
               value={nombre}
               onChange={(e) => setNombre(e.target.value)}
               className="flex-1 text-sm"
               placeholder="Nombre de categoría..."
               onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave()
                  if (e.key === 'Escape') onCancel()
               }}
               autoFocus
            />
            <button
               type="button"
               onClick={handleSave}
               disabled={saving || !nombre.trim()}
               className="w-9 h-9 rounded-sm border-none bg-accent text-background flex items-center justify-center disabled:opacity-50"
            >
               {saving ? (
                  <Loader2 size={14} className="animate-spin" />
               ) : (
                  <Check size={14} />
               )}
            </button>
            <button
               type="button"
               onClick={onCancel}
               className="w-9 h-9 rounded-sm border border-border-strong bg-transparent text-text-muted flex items-center justify-center"
            >
               <X size={14} />
            </button>
         </div>
         {showPicker && (
            <EmojiPicker
               selected={icono}
               usedEmojis={usedEmojis.filter((e) => e !== categoria.icono)}
               autoFocusSearch
               onSelect={(e) => {
                  setIcono(e)
                  setShowPicker(false)
               }}
            />
         )}
      </div>
   )
}
