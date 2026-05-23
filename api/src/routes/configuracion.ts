import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

const updateConfigSchema = z.object({
  porcentajeAhorro: z.number().min(0).max(1),
});

// GET /api/configuracion
router.get('/', async (req, res) => {
  try {
    const userId = (req as AuthRequest).user.id;
    let config = await prisma.configuracion.findUnique({ where: { userId } });

    if (!config) {
      config = await prisma.configuracion.create({
        data: { userId, porcentajeAhorro: 0.20 },
      });
    }

    res.json(config);
  } catch {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/configuracion
router.put('/', async (req, res) => {
  try {
    const userId = (req as AuthRequest).user.id;
    const data = updateConfigSchema.parse(req.body);

    const config = await prisma.configuracion.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });

    res.json(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Datos inválidos', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
