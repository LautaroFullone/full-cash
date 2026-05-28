export type TipoMovimiento = 'INGRESO' | 'EGRESO'

export interface Categoria {
   id: string
   nombre: string
   tipo: TipoMovimiento
   icono: string
   isDefault: boolean
   createdAt: string
   userId: string | null
   colorIndex: number
   movimientoCount?: number
}

// 20 colores cohesivos en estilo flat-UI. Dos tiers (saturado / pastel) de 10 c/u,
// ambos visibles sobre el fondo verde-petróleo y distintos de los colores del sistema
// (--color-accent #e5ffa6, --color-warning #ffc63f, --color-danger #ff4b5a).
export const CATEGORY_COLORS = [
   // Saturados
   '#e74c3c', // rojo            ~3°
   '#e67e22', // naranja         ~28°
   '#6ab04c', // verde bosque    ~101°
   '#20bf6b', // esmeralda       ~145°
   '#16a085', // verde mar       ~168°
   '#2980b9', // azul océano     ~205°
   '#4834d4', // azul violeta    ~244°
   '#8e44ad', // morado          ~282°
   '#c0289e', // fucsia          ~314°
   '#c44569', // wine            ~341°

   // Pastel
   '#fab1a0', // melocotón       ~10°
   '#ffb88c', // durazno         ~22°
   '#a3cb38', // verde lima      ~75°
   '#55efc4', // menta           ~160°
   '#81ecec', // turquesa claro  ~180°
   '#74b9ff', // azul cielo      ~213°
   '#a29bfe', // lavanda         ~248°
   '#d6a2e8', // malva claro     ~285°
   '#ff9ff3', // fucsia claro    ~305°
   '#ff80b3', // rosa coral      ~333°
] as const

export const CATEGORY_LIMIT_PER_TIPO = CATEGORY_COLORS.length

export const getCategoryColor = (colorIndex: number | null | undefined) => {
   const safe =
      typeof colorIndex === 'number' && Number.isFinite(colorIndex) ? colorIndex : 0
   const idx =
      ((safe % CATEGORY_COLORS.length) + CATEGORY_COLORS.length) % CATEGORY_COLORS.length
   return CATEGORY_COLORS[idx]
}
