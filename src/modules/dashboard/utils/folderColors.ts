import type { TipoMovimiento } from '@/models/categoria'

export const FOLDER_BG: Record<TipoMovimiento, string> = {
   INGRESO: 'color-mix(in srgb, var(--color-surface) 82%, var(--color-accent) 18%)',
   EGRESO: 'color-mix(in srgb, var(--color-surface) 82%, var(--color-danger) 18%)',
}
