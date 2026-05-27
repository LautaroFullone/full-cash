import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { logError } from '../lib/logger.js'
import prisma from '../lib/prisma.js'
import { Router } from 'express'
import { z } from 'zod'

const router = Router()
router.use(authMiddleware)

const createPlataformaSchema = z.object({
   nombre: z.string().min(1, 'Nombre es requerido').max(100),
})

// GET /api/plataformas
router.get('/', async (req, res) => {
   try {
      const userId = (req as AuthRequest).user.id
      const plataformas = await prisma.plataforma.findMany({
         where: { userId },
         orderBy: { nombre: 'asc' },
         include: { _count: { select: { movimientos: true } } },
      })
      res.json(
         plataformas.map(({ _count, ...plat }) => ({
            ...plat,
            movimientoCount: _count.movimientos,
         }))
      )
   } catch (error) {
      logError('GET /api/plataformas', error)
      res.status(500).json({ error: 'Error interno del servidor' })
   }
})

// POST /api/plataformas
router.post('/', async (req, res) => {
   try {
      const userId = (req as AuthRequest).user.id
      const data = createPlataformaSchema.parse(req.body)
      const plataforma = await prisma.plataforma.create({ data: { ...data, userId } })
      res.status(201).json({ ...plataforma, movimientoCount: 0 })
   } catch (error) {
      if (error instanceof z.ZodError) {
         res.status(400).json({ error: 'Datos inválidos', details: error.errors })
         return
      }
      logError('POST /api/plataformas', error)
      res.status(500).json({ error: 'Error interno del servidor' })
   }
})

// DELETE /api/plataformas/:id
// Movements with this platform → plataformaId set to null (platform is optional)
router.delete('/:id', async (req, res) => {
   try {
      const userId = (req as unknown as AuthRequest).user.id
      const { id } = req.params

      const existing = await prisma.plataforma.findFirst({ where: { id, userId } })
      if (!existing) {
         res.status(404).json({ error: 'Plataforma no encontrada' })
         return
      }

      await prisma.movimiento.updateMany({
         where: { plataformaId: id },
         data: { plataformaId: null },
      })
      await prisma.plataforma.delete({ where: { id } })
      res.json({ success: true })
   } catch (error) {
      logError(`DELETE /api/plataformas/${req.params.id}`, error)
      res.status(500).json({ error: 'Error interno del servidor' })
   }
})

export default router
