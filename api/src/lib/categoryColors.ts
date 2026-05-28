import prisma from './prisma.js'

const COLOR_COUNT = 20
const TIPOS = ['INGRESO', 'EGRESO'] as const
type Tipo = (typeof TIPOS)[number]

const pickAvailableColor = (usados: Set<number>) => {
   const disponibles: number[] = []
   for (let i = 0; i < COLOR_COUNT; i++) if (!usados.has(i)) disponibles.push(i)
   if (disponibles.length === 0) return null
   return disponibles[Math.floor(Math.random() * disponibles.length)]
}

// Asigna colorIndex a las categorías visibles del usuario que tengan null,
// evitando colisiones por tipo (incluye globales con/sin hidden y propias del usuario).
// Devuelve un Map<categoriaId, colorIndex> con los slots usados/asignados.
export const backfillColorIndices = async (userId: string) => {
   const visibles = await prisma.categoria.findMany({
      where: { OR: [{ userId }, { userId: null }] },
      select: { id: true, tipo: true, colorIndex: true },
   })

   const sinColor = visibles.filter((c) => c.colorIndex === null)
   if (sinColor.length === 0) return new Map(visibles.map((c) => [c.id, c.colorIndex]))

   for (const tipo of TIPOS) {
      const tipoSinColor = sinColor.filter((c) => c.tipo === tipo)
      if (tipoSinColor.length === 0) continue

      const usados = new Set(
         visibles
            .filter((c) => c.tipo === tipo && c.colorIndex !== null)
            .map((c) => c.colorIndex as number)
      )

      for (const cat of tipoSinColor) {
         const pick = pickAvailableColor(usados)
         if (pick === null) break
         usados.add(pick)
         cat.colorIndex = pick
         await prisma.categoria.update({
            where: { id: cat.id },
            data: { colorIndex: pick },
         })
      }
   }

   return new Map(visibles.map((c) => [c.id, c.colorIndex]))
}

export { COLOR_COUNT, pickAvailableColor }
