import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';

const router = Router();

const createCategoriaSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido'),
  tipo: z.enum(['INGRESO', 'EGRESO']),
  icono: z.string().default('CircleDollarSign'),
});

// GET /api/categorias
router.get('/', async (_req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { nombre: 'asc' },
    });
    res.json(categorias);
  } catch (error) {
    console.error('Error fetching categorias:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/categorias
router.post('/', async (req, res) => {
  try {
    const data = createCategoriaSchema.parse(req.body);
    const categoria = await prisma.categoria.create({ data });
    res.status(201).json(categoria);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Datos inválidos', details: error.errors });
      return;
    }
    console.error('Error creating categoria:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/categorias/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category is in use
    const count = await prisma.movimiento.count({ where: { categoriaId: id } });
    if (count > 0) {
      res.status(400).json({
        error: `No se puede eliminar: la categoría tiene ${count} movimiento(s) asociado(s)`,
      });
      return;
    }

    await prisma.categoria.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting categoria:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
