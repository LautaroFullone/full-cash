// Asigna colorIndex random/único a TODA categoría con colorIndex null.
// Globales (userId=null) → uno por tipo, único entre globales.
// Propias → uno por usuario+tipo, único respecto a globales + otras propias del mismo user/tipo.
//
// Correr: cd api && npx tsx scripts/backfillColorIndex.ts
import prisma from '../src/lib/prisma.js'

const COLOR_COUNT = 20
const TIPOS = ['INGRESO', 'EGRESO'] as const

const pickRandom = (usados: Set<number>) => {
   const disponibles: number[] = []
   for (let i = 0; i < COLOR_COUNT; i++) if (!usados.has(i)) disponibles.push(i)
   if (disponibles.length === 0) return null
   return disponibles[Math.floor(Math.random() * disponibles.length)]
}

const main = async () => {
   // 1. Globales primero — colorIndex compartido entre todos los usuarios
   for (const tipo of TIPOS) {
      const globales = await prisma.categoria.findMany({
         where: { userId: null, tipo },
         orderBy: { createdAt: 'asc' },
      })
      const usados = new Set(
         globales.map((c) => c.colorIndex).filter((v): v is number => v !== null)
      )
      const sinColor = globales.filter((c) => c.colorIndex === null)

      for (const cat of sinColor) {
         const pick = pickRandom(usados)
         if (pick === null) {
            console.warn(`⚠️  Sin colores libres para global ${cat.nombre} (${tipo})`)
            break
         }
         usados.add(pick)
         await prisma.categoria.update({
            where: { id: cat.id },
            data: { colorIndex: pick },
         })
         console.log(`  global ${tipo} "${cat.nombre}" → colorIndex ${pick}`)
      }
   }

   // 2. Propias por usuario+tipo — únicos respecto a globales + otras propias
   const users = await prisma.user.findMany({ select: { id: true } })
   for (const { id: userId } of users) {
      for (const tipo of TIPOS) {
         const sameTipo = await prisma.categoria.findMany({
            where: { tipo, OR: [{ userId }, { userId: null }] },
         })
         const usados = new Set(
            sameTipo.map((c) => c.colorIndex).filter((v): v is number => v !== null)
         )
         const sinColor = sameTipo.filter(
            (c) => c.colorIndex === null && c.userId === userId
         )

         for (const cat of sinColor) {
            const pick = pickRandom(usados)
            if (pick === null) {
               console.warn(
                  `⚠️  Sin colores libres para "${cat.nombre}" (user ${userId}, ${tipo})`
               )
               break
            }
            usados.add(pick)
            await prisma.categoria.update({
               where: { id: cat.id },
               data: { colorIndex: pick },
            })
            console.log(
               `  user ${userId.slice(0, 6)} ${tipo} "${cat.nombre}" → colorIndex ${pick}`
            )
         }
      }
   }

   console.log('✓ Backfill completo')
}

main()
   .catch((err) => {
      console.error(err)
      process.exit(1)
   })
   .finally(() => prisma.$disconnect())
