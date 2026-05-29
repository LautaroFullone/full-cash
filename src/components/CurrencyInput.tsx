import { useRef, useState } from 'react'
import { cn } from '@/utils/cn'

interface CurrencyInputProps {
   value: number | ''
   onChange: (value: number | '') => void
   placeholder?: string
   id?: string
   variant?: 'default' | 'hero'
   color?: 'accent' | 'danger'
}

const formatDisplay = (num: number | ''): string => {
   if (num === '' || num === 0) return ''
   return num.toLocaleString('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
   })
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
   value,
   onChange,
   placeholder = '0',
   id,
   variant = 'default',
   color = 'accent',
}) => {
   const inputRef = useRef<HTMLInputElement>(null)
   const [displayValue, setDisplayValue] = useState(formatDisplay(value))

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      const cursorBefore = e.target.selectionStart ?? raw.length

      // Strip thousand-separator dots → clean input
      const clean = raw.replace(/\./g, '')

      // Only digits and at most one comma
      if (!/^[\d,]*$/.test(clean)) return
      if ((clean.match(/,/g) ?? []).length > 1) return

      const [intPart = '', decPart] = clean.split(',')

      // Re-insert thousand dots
      const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      const formatted =
         decPart !== undefined ? `${formattedInt},${decPart}` : formattedInt

      setDisplayValue(formatted)

      // Numeric value
      const numStr = intPart + (decPart !== undefined ? '.' + decPart : '')
      const num = parseFloat(numStr)
      onChange(!numStr || isNaN(num) ? '' : num)

      // Restore cursor: count non-dot chars before old cursor, map to new formatted string
      const cleanBeforeCursor = raw.slice(0, cursorBefore).replace(/\./g, '').length
      let newCursor = formatted.length
      let count = 0
      for (let i = 0; i < formatted.length; i++) {
         if (count === cleanBeforeCursor) {
            newCursor = i
            break
         }
         if (formatted[i] !== '.') count++
      }

      requestAnimationFrame(() => {
         inputRef.current?.setSelectionRange(newCursor, newCursor)
      })
   }

   const colorClass = color === 'accent' ? 'text-accent' : 'text-danger'

   if (variant === 'hero') {
      return (
         <div className="flex items-center justify-center ">
            <span
               className={cn('font-heading font-bold text-2xl leading-none', colorClass)}
            >
               $
            </span>
            <input
               ref={inputRef}
               id={id}
               type="text"
               inputMode="decimal"
               value={displayValue}
               onChange={handleChange}
               placeholder={placeholder}
               className={cn(
                  'bg-transparent border-none outline-none shadow-none font-heading font-black tracking-[-2px] text-center leading-none text-4xl min-w-[3ch] tabular-nums',
                  displayValue ? colorClass : 'text-text-muted'
               )}
               style={{
                  padding: 0,
                  width: `${Math.max((displayValue || placeholder).length + 1, 3)}ch`,
                  maxWidth: '100%',
               }}
            />
         </div>
      )
   }

   return (
      <div className="relative">
         <span
            className={cn(
               'absolute left-3.5 top-1/2 -translate-y-1/2 font-heading font-bold text-[15px] pointer-events-none select-none',
               colorClass
            )}
         >
            $
         </span>
         <input
            ref={inputRef}
            id={id}
            type="text"
            inputMode="decimal"
            value={displayValue}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full font-heading font-bold text-lg tracking-[-0.3px] pl-8"
         />
      </div>
   )
}
