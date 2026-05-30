import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { MESES } from '../utils/meses'
import { MonthCell } from './MonthCell'

interface MonthYearPickerProps {
   mes: number
   anio: number
   monthName: string
   onSelect: (mes: number, anio: number) => void
}

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
   mes,
   anio,
   monthName,
   onSelect,
}) => {
   const now = new Date()
   const currentMes = now.getMonth() + 1
   const currentAnio = now.getFullYear()

   const [open, setOpen] = useState(false)
   const [viewAnio, setViewAnio] = useState(anio)
   const [popupPos, setPopupPos] = useState({ top: 0, left: 0 })
   const triggerRef = useRef<HTMLButtonElement>(null)

   const updatePosition = () => {
      if (!triggerRef.current) return
      const rect = triggerRef.current.getBoundingClientRect()
      const idealLeft = rect.left + rect.width / 2 - 208 / 2 // 208 = ancho del popup (w-52)
      const left = Math.max(8, Math.min(idealLeft, window.innerWidth - 208 - 8))
      // Flip arriba si no entra abajo (280 = alto aprox. del popup)
      const spaceBelow = window.innerHeight - rect.bottom
      const top = spaceBelow < 280 + 8 ? Math.max(8, rect.top - 280 - 8) : rect.bottom + 8
      setPopupPos({ top, left })
   }

   useEffect(() => {
      if (!open) return
      setViewAnio(anio)
      updatePosition()
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Escape') setOpen(false)
      }
      const handleScroll = () => setOpen(false)
      document.addEventListener('keydown', handleKeyDown)
      window.addEventListener('scroll', handleScroll, true)
      return () => {
         document.removeEventListener('keydown', handleKeyDown)
         window.removeEventListener('scroll', handleScroll, true)
      }
   }, [open, anio])

   const handleSelect = (m: number) => {
      onSelect(m, viewAnio)
      setOpen(false)
   }

   return (
      <>
         <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex-1 flex items-center justify-center font-heading text-base font-semibold capitalize text-white cursor-pointer border-none bg-transparent hover:text-accent transition-colors duration-200"
         >
            {monthName} {anio}
         </button>

         {open &&
            createPortal(
               <>
                  {/* Backdrop */}
                  <div
                     className="fixed inset-0 bg-black/25 animate-overlay-in"
                     style={{ zIndex: 9998 }}
                     onClick={() => setOpen(false)}
                  />

                  {/* Popup — left is pre-calculated so no transform needed (avoids conflict with scaleIn animation) */}
                  <div
                     className="w-52 bg-surface-elevated border border-border rounded-lg p-3 animate-scale-in"
                     style={{
                        position: 'fixed',
                        top: popupPos.top,
                        left: popupPos.left,
                        zIndex: 9999,
                        boxShadow: 'var(--shadow-elevated)',
                     }}
                  >
                     {/* Year navigation */}
                     <div className="flex items-center justify-between mb-3">
                        <button
                           type="button"
                           onClick={() => setViewAnio((y) => y - 1)}
                           className="w-9 h-9 rounded-sm border border-border-strong bg-transparent text-text-muted flex items-center justify-center cursor-pointer hover:text-white transition-colors active:scale-[0.96]"
                        >
                           <ChevronLeft size={14} />
                        </button>

                        <span className="font-heading font-bold text-sm text-white">
                           {viewAnio}
                        </span>

                        <button
                           type="button"
                           onClick={() => setViewAnio((y) => y + 1)}
                           className="w-9 h-9 rounded-sm border border-border-strong bg-transparent text-text-muted flex items-center justify-center cursor-pointer hover:text-white transition-colors active:scale-[0.96]"
                        >
                           <ChevronRight size={14} />
                        </button>
                     </div>

                     {/* Month grid */}
                     <div className="grid grid-cols-3 gap-1">
                        {MESES.map((nombre, i) => {
                           const m = i + 1
                           return (
                              <MonthCell
                                 key={m}
                                 label={nombre}
                                 selected={m === mes && viewAnio === anio}
                                 onClick={() => handleSelect(m)}
                              />
                           )
                        })}
                     </div>

                     {(mes !== currentMes || anio !== currentAnio) && (
                        <>
                           <div className="h-px bg-border-strong my-2.5" />
                           <button
                              type="button"
                              onClick={() => {
                                 onSelect(currentMes, currentAnio)
                                 setOpen(false)
                              }}
                              className="w-full h-8 rounded-sm border border-border-strong text-[12px] font-semibold text-text-secondary bg-transparent cursor-pointer hover:border-accent hover:text-accent transition-colors duration-150 active:scale-[0.98]"
                           >
                              Mes actual
                           </button>
                        </>
                     )}
                  </div>
               </>,
               document.body
            )}
      </>
   )
}
