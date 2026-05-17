interface CategoryIconProps {
  icono: string; // emoji string o fallback
  size?: number;
  className?: string;
}

/**
 * Renders a category icon — now emoji-based.
 * If `icono` looks like a Lucide icon name (old data), shows a fallback.
 */
export function CategoryIcon({ icono, size = 20, className = '' }: CategoryIconProps) {
  // Detect if it's an emoji (not a PascalCase Lucide name)
  const isEmoji = icono && !/^[A-Z]/.test(icono);
  const display = isEmoji ? icono : '💰';

  return (
    <span
      className={className}
      style={{ fontSize: size, lineHeight: 1, display: 'inline-flex', alignItems: 'center' }}
      role="img"
      aria-label="category icon"
    >
      {display}
    </span>
  );
}
