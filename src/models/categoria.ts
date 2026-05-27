export type TipoMovimiento = 'INGRESO' | 'EGRESO'

export interface Categoria {
   id: string
   nombre: string
   tipo: TipoMovimiento
   icono: string
   isDefault: boolean
   createdAt: string
   userId: string | null
   movimientoCount?: number
}

export const CATEGORY_COLORS = [
   '#e17055', // terracota     ~14°
   '#f0932b', // ámbar         ~33°
   '#6ab04c', // verde bosque  ~101°
   '#00b894', // menta         ~162°
   '#00cec9', // turquesa      ~178°
   '#3498db', // azul océano   ~204°
   '#74b9ff', // azul cielo    ~213°
   '#6c5ce7', // índigo        ~248°
   '#9b59b6', // malva         ~282°
   '#e84393', // magenta       ~326°
   '#fd79a8', // rosa suave    ~339°
] as const

export const getCategoryColor = (categoriaId: string): string => {
   let hash = 0
   for (let i = 0; i < categoriaId.length; i++) {
      hash = (hash * 31 + categoriaId.charCodeAt(i)) >>> 0
   }
   return CATEGORY_COLORS[hash % CATEGORY_COLORS.length]
}
