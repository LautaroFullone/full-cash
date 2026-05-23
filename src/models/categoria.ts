export type TipoMovimiento = 'INGRESO' | 'EGRESO'

export interface Categoria {
   id: string
   nombre: string
   tipo: TipoMovimiento
   icono: string
   createdAt: string
   userId: string | null
}

export const CATEGORY_COLORS = [
   '#e5ffa6',
   '#006e8b',
   '#ff4b5a',
   '#ffc63f',
   '#0090b3',
   '#c8e68a',
   '#e8434f',
   '#e5b035',
   '#00b894',
   '#6c5ce7',
   '#fd79a8',
   '#74b9ff',
   '#a29bfe',
   '#00cec9',
   '#fab1a0',
] as const
