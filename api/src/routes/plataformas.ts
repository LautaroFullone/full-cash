import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

const createPlataformaSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido'),
});

// GET /api/plataformas
router.get('/', async (req, res) => {
  try {
    const userId = (req as AuthRequest).user.id;
    const plataformas = await prisma.plataforma.findMany({
      where: { userId },
      orderBy: { nombre: 'asc' },
    });
    res.json(plataformas);
  } catch {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/plataformas
router.post('/', async (req, res) => {
  try {
    const userId = (req as AuthRequest).user.id;
    const data = createPlataformaSchema.parse(req.body);
    const plataforma = await prisma.plataforma.create({ data: { ...data, userId } });
    res.status(201).json(plataforma);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Datos inválidos', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/plataformas/:id
router.delete('/:id', async (req, res) => {
  try {
    const userId = (req as unknown as AuthRequest).user.id;
    const { id } = req.params;

    const existing = await prisma.plataforma.findFirst({ where: { id, userId } });
    if (!existing) { res.status(404).json({ error: 'Plataforma no encontrada' }); return; }

    const count = await prisma.movimiento.count({ where: { plataformaId: id } });
    if (count > 0) {
      res.status(400).json({
        error: `No se puede eliminar: la plataforma tiene ${count} movimiento(s) asociado(s)`,
      });
      return;
    }
    await prisma.plataforma.delete({ where: { id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
