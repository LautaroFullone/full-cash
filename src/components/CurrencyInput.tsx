import { useState, useRef } from 'react'

interface CurrencyInputProps {
  value: number | ''
  onChange: (value: number | '') => void
  placeholder?: string
  id?: string
}

export function CurrencyInput({ value, onChange, placeholder = '0', id }: CurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const toDisplayValue = (num: number | ''): string => {
    if (num === '' || num === 0) return ''
    return num.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
  }

  const [displayValue, setDisplayValue] = useState(toDisplayValue(value))
  const [isFocused, setIsFocused] = useState(false)

  const parseInput = (raw: string): number | '' => {
    const cleaned = raw.replace(/\./g, '').replace(',', '.')
    if (cleaned === '' || cleaned === '.') return ''
    const num = parseFloat(cleaned)
    return isNaN(num) ? '' : num
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const isValid = /^[\d.,]*$/.test(raw) && (raw.match(/,/g) || []).length <= 1
    if (!isValid) return
    setDisplayValue(raw)
    onChange(parseInput(raw))
  }

  const handleFocus = () => {
    setIsFocused(true)
    if (value !== '') setDisplayValue(String(value).replace('.', ','))
  }

  const handleBlur = () => {
    setIsFocused(false)
    if (value !== '' && value > 0) setDisplayValue(toDisplayValue(value))
    else setDisplayValue('')
  }

  return (
    <div className="relative">
      <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 font-heading font-bold text-[15px] pointer-events-none select-none transition-colors duration-200 ${isFocused ? 'text-accent' : 'text-text-muted'}`}>
        $
      </span>
      <input
        ref={inputRef}
        id={id}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="w-full font-heading font-bold text-lg tracking-[-0.3px] pl-[30px]"
      />
    </div>
  )
}
