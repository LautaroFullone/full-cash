import { useState, useRef } from 'react';

interface CurrencyInputProps {
  value: number | ''; // valor numérico real
  onChange: (value: number | '') => void;
  placeholder?: string;
  id?: string;
  style?: React.CSSProperties;
}

/**
 * Input de monto en pesos argentinos con formato visual en tiempo real.
 * Internamente mantiene el valor numérico real (sin formato),
 * y muestra el string formateado mientras el usuario escribe.
 *
 * Reglas:
 * - Solo permite dígitos y una coma decimal
 * - Formatea con separador de miles (punto) al salir del campo
 * - Prefijo "$" siempre visible
 */
export function CurrencyInput({ value, onChange, placeholder = '0', id, style }: CurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Convierte número a string formateado para mostrar mientras se edita
  const toDisplayValue = (num: number | ''): string => {
    if (num === '' || num === 0) return '';
    return num.toLocaleString('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const [displayValue, setDisplayValue] = useState(toDisplayValue(value));
  const [isFocused, setIsFocused] = useState(false);

  // Convierte el string que escribe el usuario a número
  const parseInput = (raw: string): number | '' => {
    // Eliminar separadores de miles (puntos) y reemplazar coma decimal
    const cleaned = raw.replace(/\./g, '').replace(',', '.');
    if (cleaned === '' || cleaned === '.') return '';
    const num = parseFloat(cleaned);
    return isNaN(num) ? '' : num;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // Permitir solo: dígitos, punto (miles), coma (decimal)
    // Máximo una coma
    const isValid = /^[\d.,]*$/.test(raw) && (raw.match(/,/g) || []).length <= 1;
    if (!isValid) return;

    setDisplayValue(raw);
    onChange(parseInput(raw));
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Al enfocar, mostramos el número sin formato para facilitar la edición
    if (value !== '') {
      // Usar coma como decimal (formato argentino)
      setDisplayValue(String(value).replace('.', ','));
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Al salir, formateamos con separador de miles
    if (value !== '' && value > 0) {
      setDisplayValue(toDisplayValue(value));
    } else {
      setDisplayValue('');
    }
  };

  return (
    <div style={{ position: 'relative', ...style }}>
      {/* Prefijo $ */}
      <span
        style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: isFocused ? 'var(--color-accent)' : 'var(--color-text-muted)',
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: '15px',
          pointerEvents: 'none',
          transition: 'color 0.2s ease',
          userSelect: 'none',
        }}
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
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        style={{
          width: '100%',
          paddingLeft: '30px', // espacio para el $
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: '18px',
          letterSpacing: '-0.3px',
        }}
      />
    </div>
  );
}
