import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import type { Plataforma } from '@/models/plataforma'
import { cn } from '@/utils/cn'

interface PlatformSelectProps {
   value: string
   onChange: (value: string) => void
   plataformas: Plataforma[]
}

const ALL_OPTIONS = (plataformas: Plataforma[]) => [
   { id: '', nombre: 'Sin plataforma' },
   ...plataformas,
]

export const PlatformSelect: React.FC<PlatformSelectProps> = ({
   value,
   onChange,
   plataformas,
}) => {
   const [open, setOpen] = useState(false)
   const options = ALL_OPTIONS(plataformas)
   const selectedLabel = options.find((p) => p.id === value)?.nombre ?? 'Sin plataforma'

   const handleSelect = (id: string) => {
      onChange(id)
      setOpen(false)
   }

   return (
      <div
         className={cn(
            'rounded-md border bg-background transition-[border-color,box-shadow] duration-200',
            open
               ? 'border-accent shadow-[0_0_0_3px_rgba(229,255,166,0.1)]'
               : 'border-border-strong'
         )}
      >
         {/* Trigger */}
         <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-full flex items-center gap-2.5 py-2.5 px-3.5 text-white text-sm font-body cursor-pointer text-left bg-transparent border-none active:scale-[0.99] transition-transform duration-100"
         >
            <span className={cn('flex-1', !value && 'text-text-muted')}>{selectedLabel}</span>
            <ChevronDown
               size={14}
               className={cn(
                  'shrink-0 transition-transform duration-200',
                  open ? 'rotate-180 text-accent' : 'text-text-muted'
               )}
            />
         </button>

         {/* Inline options — CSS grid-rows trick */}
         <div
            className={cn(
               'grid transition-[grid-template-rows] duration-300 ease-out',
               open ? '[grid-template-rows:1fr]' : '[grid-template-rows:0fr]'
            )}
         >
            <div className="overflow-hidden">
               <div>
                  <div className="h-px bg-border-strong mx-3.5" />
                  <div className="py-1.5">
                     {options.map((p) => {
                        const isSelected = value === p.id
                        return (
                           <button
                              key={p.id}
                              type="button"
                              onClick={() => handleSelect(p.id)}
                              className={cn(
                                 'w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-body cursor-pointer border-none bg-transparent text-left transition-colors duration-100 active:scale-[0.98]',
                                 isSelected
                                    ? 'text-accent'
                                    : 'text-text-secondary hover:text-white hover:bg-white/4'
                              )}
                           >
                              <span className="w-4 shrink-0 flex items-center justify-center">
                                 {isSelected && <Check size={13} className="text-accent" />}
                              </span>
                              {p.nombre}
                           </button>
                        )
                     })}
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}
