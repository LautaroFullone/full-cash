import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import {
   backfillColorIndices,
   COLOR_COUNT,
   pickAvailableColor,
} from '../lib/categoryColors.js'
import { logError } from '../lib/logger.js'
import prisma from '../lib/prisma.js'
import { Router } from 'express'
import { z } from 'zod'

const router = Router()
router.use(authMiddleware)

const isUniqueConstraintError = (error: unknown) =>
   typeof error === 'object' &&
   error !== null &&
   'code' in error &&
   (error as { code?: unknown }).code === 'P2002'

const createCategoriaSchema = z.object({
   nombre: z.string().min(1, 'Nombre es requerido').max(100),
   tipo: z.enum(['INGRESO', 'EGRESO']),
   icono: z.string().max(10).default('💰'),
})

// GET /api/categorias
router.get('/', async (req, res) => {
   try {
      const userId = (req as AuthRequest).user.id

      const colorMap = await backfillColorIndices(userId)

      const hidden = await prisma.userCategoriaHidden.findMany({
         where: { userId },
         select: { categoriaId: true },
      })
      const hiddenIds = hidden.map((h) => h.categoriaId)

      const categorias = await prisma.categoria.findMany({
         where: {
            OR: [
               { userId },
               { userId: null, isDefault: true },
               {
                  userId: null,
                  isDefault: false,
                  ...(hiddenIds.length > 0 ? { id: { notIn: hiddenIds } } : {}),
               },
            ],
         },
         orderBy: { nombre: 'asc' },
         include: { _count: { select: { movimientos: true } } },
      })

      res.json(
         categorias.map(({ _count, ...cat }) => ({
            ...cat,
            colorIndex: colorMap.get(cat.id) ?? cat.colorIndex,
            movimientoCount: _count.movimientos,
         }))
      )
   } catch (error) {
      logError('GET /api/categorias', error)
      res.status(500).json({ error: 'Error interno del servidor' })
   }
})

// POST /api/categorias
router.post('/', async (req, res) => {
   try {
      const userId = (req as AuthRequest).user.id
      const data = createCategoriaSchema.parse(req.body)

      const sameTipo = await prisma.categoria.findMany({
         where: { tipo: data.tipo, OR: [{ userId }, { userId: null }] },
         select: { colorIndex: true },
      })
      const usados = new Set(
         sameTipo.map((c) => c.colorIndex).filter((v): v is number => v !== null)
      )

      if (usados.size >= COLOR_COUNT) {
         res.status(400).json({
            error: `Límite de ${COLOR_COUNT} categorías alcanzado para este tipo`,
         })
         return
      }

      const colorIndex = pickAvailableColor(usados)
      if (colorIndex === null) {
         res.status(400).json({ error: 'No hay colores disponibles' })
         return
      }

      const categoria = await prisma.categoria.create({
         data: { ...data, userId, colorIndex },
      })
      res.status(201).json({ ...categoria, movimientoCount: 0 })
   } catch (error) {
      if (error instanceof z.ZodError) {
         res.status(400).json({ error: 'Datos inválidos', details: error.errors })
         return
      }
      if (isUniqueConstraintError(error)) {
         res.status(409).json({ error: 'Ya existe una categoría con ese nombre' })
         return
      }
      logError('POST /api/categorias', error)
      res.status(500).json({ error: 'Error interno del servidor' })
   }
})

// PUT /api/categorias/:id — only user's own categories
router.put('/:id', async (req, res) => {
   try {
      const userId = (req as unknown as AuthRequest).user.id
      const { id } = req.params
      const data = createCategoriaSchema.partial().parse(req.body)

      const existing = await prisma.categoria.findFirst({ where: { id, userId } })
      if (!existing) {
         res.status(404).json({ error: 'Categoría no encontrada o no editable' })
         return
      }

      const categoria = await prisma.categoria.update({ where: { id }, data })
      const movimientoCount = await prisma.movimiento.count({
         where: { categoriaId: id },
      })
      res.json({ ...categoria, movimientoCount })
   } catch (error) {
      if (error instanceof z.ZodError) {
         res.status(400).json({ error: 'Datos inválidos', details: error.errors })
         return
      }
      if (isUniqueConstraintError(error)) {
         res.status(409).json({ error: 'Ya existe una categoría con ese nombre' })
         return
      }
      logError(`PUT /api/categorias/${req.params.id}`, error)
      res.status(500).json({ error: 'Error interno del servidor' })
   }
})

// DELETE /api/categorias/:id
// Default categories → blocked
// Global (userId=null) → hide for this user
// User's own → reassign movements to default, then delete
router.delete('/:id', async (req, res) => {
   try {
      const userId = (req as unknown as AuthRequest).user.id
      const { id } = req.params

      const existing = await prisma.categoria.findFirst({
         where: { id, OR: [{ userId }, { userId: null }] },
      })
      if (!existing) {
         res.status(404).json({ error: 'Categoría no encontrada' })
         return
      }
      if (existing.isDefault) {
         res.status(400).json({ error: 'Esta categoría no se puede eliminar' })
         return
      }

      if (existing.userId === null) {
         await prisma.userCategoriaHidden.upsert({
            where: { userId_categoriaId: { userId, categoriaId: id } },
            update: {},
            create: { userId, categoriaId: id },
         })
         res.json({ success: true, hidden: true })
         return
      }

      const defaultCat = await prisma.categoria.findFirst({
         where: { userId: null, isDefault: true, tipo: existing.tipo },
      })
      if (!defaultCat) {
         res.status(500).json({ error: 'Categoría por defecto no encontrada' })
         return
      }

      await prisma.movimiento.updateMany({
         where: { categoriaId: id, userId },
         data: { categoriaId: defaultCat.id },
      })
      await prisma.categoria.delete({ where: { id } })
      res.json({ success: true, hidden: false })
   } catch (error) {
      logError(`DELETE /api/categorias/${req.params.id}`, error)
      res.status(500).json({ error: 'Error interno del servidor' })
   }
})

export default router
