import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';

const router = Router();

const updateConfigSchema = z.object({
  porcentajeAhorro: z.number().min(0).max(1),
});

// GET /api/configuracion
router.get('/', async (_req, res) => {
  try {
    let config = await prisma.configuracion.findUnique({
      where: { id: 'default' },
    });

    if (!config) {
      config = await prisma.configuracion.create({
        data: { id: 'default', porcentajeAhorro: 0.20 },
      });
    }

    res.json(config);
  } catch (error) {
    console.error('Error fetching configuracion:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/configuracion
router.put('/', async (req, res) => {
  try {
    const data = updateConfigSchema.parse(req.body);

    const config = await prisma.configuracion.upsert({
      where: { id: 'default' },
      update: data,
      create: { id: 'default', ...data },
    });

    res.json(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Datos inválidos', details: error.errors });
      return;
    }
    console.error('Error updating configuracion:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
