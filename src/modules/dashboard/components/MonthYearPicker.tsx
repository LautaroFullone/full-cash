import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { MESES } from '../utils/meses'
import { cn } from '@/utils/cn'

const POPUP_WIDTH = 208 // w-52
const POPUP_MAX_HEIGHT = 280 // approx altura del popup con month grid + footer
const VIEWPORT_MARGIN = 8

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
      const idealLeft = rect.left + rect.width / 2 - POPUP_WIDTH / 2
      const left = Math.max(
         VIEWPORT_MARGIN,
         Math.min(idealLeft, window.innerWidth - POPUP_WIDTH - VIEWPORT_MARGIN)
      )
      // Flip arriba si no entra abajo
      const spaceBelow = window.innerHeight - rect.bottom
      const top =
         spaceBelow < POPUP_MAX_HEIGHT + VIEWPORT_MARGIN
            ? Math.max(VIEWPORT_MARGIN, rect.top - POPUP_MAX_HEIGHT - 8)
            : rect.bottom + 8
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
                           className="w-8 h-8 rounded-sm border border-border-strong bg-transparent text-text-muted flex items-center justify-center cursor-pointer hover:text-white transition-colors active:scale-[0.96]"
                        >
                           <ChevronLeft size={14} />
                        </button>

                        <span className="font-heading font-bold text-sm text-white">
                           {viewAnio}
                        </span>

                        <button
                           type="button"
                           onClick={() => setViewAnio((y) => y + 1)}
                           className="w-8 h-8 rounded-sm border border-border-strong bg-transparent text-text-muted flex items-center justify-center cursor-pointer hover:text-white transition-colors active:scale-[0.96]"
                        >
                           <ChevronRight size={14} />
                        </button>
                     </div>

                     {/* Month grid */}
                     <div className="grid grid-cols-3 gap-1">
                        {MESES.map((nombre, i) => {
                           const m = i + 1
                           const isSelected = m === mes && viewAnio === anio
                           return (
                              <button
                                 key={m}
                                 type="button"
                                 onClick={() => handleSelect(m)}
                                 className={cn(
                                    'h-9 rounded-sm border text-[13px] font-body cursor-pointer transition-colors duration-150 active:scale-[0.96]',
                                    isSelected
                                       ? 'bg-accent text-[#003a34] border-transparent font-bold'
                                       : 'border-border-strong text-text-secondary bg-transparent hover:bg-white/6 hover:text-white'
                                 )}
                              >
                                 {nombre}
                              </button>
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
