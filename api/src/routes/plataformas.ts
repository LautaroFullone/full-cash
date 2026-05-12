import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';

const router = Router();

const createPlataformaSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido'),
});

// GET /api/plataformas
router.get('/', async (_req, res) => {
  try {
    const plataformas = await prisma.plataforma.findMany({
      orderBy: { nombre: 'asc' },
    });
    res.json(plataformas);
  } catch (error) {
    console.error('Error fetching plataformas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/plataformas
router.post('/', async (req, res) => {
  try {
    const data = createPlataformaSchema.parse(req.body);
    const plataforma = await prisma.plataforma.create({ data });
    res.status(201).json(plataforma);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Datos inválidos', details: error.errors });
      return;
    }
    console.error('Error creating plataforma:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/plataformas/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const count = await prisma.movimiento.count({ where: { plataformaId: id } });
    if (count > 0) {
      res.status(400).json({
        error: `No se puede eliminar: la plataforma tiene ${count} movimiento(s) asociado(s)`,
      });
      return;
    }
    await prisma.plataforma.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting plataforma:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
