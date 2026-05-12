import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';

const router = Router();

// Validation schemas
const createMovimientoSchema = z.object({
  concepto: z.string().min(1, 'Concepto es requerido'),
  monto: z.number().positive('Monto debe ser positivo'),
  tipo: z.enum(['INGRESO', 'EGRESO']),
  categoriaId: z.string().min(1, 'Categoría es requerida'),
  plataformaId: z.string().optional().nullable(),
  fecha: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
});

const updateMovimientoSchema = createMovimientoSchema.partial();

// GET /api/movimientos?mes=5&anio=2026
router.get('/', async (req, res) => {
  try {
    const mes = parseInt(req.query.mes as string);
    const anio = parseInt(req.query.anio as string);

    if (isNaN(mes) || isNaN(anio)) {
      res.status(400).json({ error: 'Parámetros mes y anio son requeridos' });
      return;
    }

    const startDate = new Date(anio, mes - 1, 1);
    const endDate = new Date(anio, mes, 1);

    const movimientos = await prisma.movimiento.findMany({
      where: {
        fecha: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        categoria: true,
        plataforma: true,
      },
      orderBy: { fecha: 'desc' },
    });

    res.json(movimientos);
  } catch (error) {
    console.error('Error fetching movimientos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/movimientos/resumen?mes=5&anio=2026
router.get('/resumen', async (req, res) => {
  try {
    const mes = parseInt(req.query.mes as string);
    const anio = parseInt(req.query.anio as string);

    if (isNaN(mes) || isNaN(anio)) {
      res.status(400).json({ error: 'Parámetros mes y anio son requeridos' });
      return;
    }

    const startDate = new Date(anio, mes - 1, 1);
    const endDate = new Date(anio, mes, 1);

    const movimientos = await prisma.movimiento.findMany({
      where: {
        fecha: { gte: startDate, lt: endDate },
      },
      include: { categoria: true },
    });

    const totalIngresos = movimientos
      .filter(m => m.tipo === 'INGRESO')
      .reduce((sum, m) => sum + m.monto, 0);

    const totalEgresos = movimientos
      .filter(m => m.tipo === 'EGRESO')
      .reduce((sum, m) => sum + m.monto, 0);

    // Distribución de egresos por categoría
    const categoriaMap = new Map<string, { nombre: string; total: number }>();
    movimientos
      .filter(m => m.tipo === 'EGRESO')
      .forEach(m => {
        const key = m.categoriaId;
        const existing = categoriaMap.get(key);
        if (existing) {
          existing.total += m.monto;
        } else {
          categoriaMap.set(key, {
            nombre: m.categoria.nombre,
            total: m.monto,
          });
        }
      });

    const distribucionCategorias = Array.from(categoriaMap.entries()).map(
      ([categoriaId, data]) => ({
        categoriaId,
        categoriaNombre: data.nombre,
        total: data.total,
        porcentaje: totalEgresos > 0 ? (data.total / totalEgresos) * 100 : 0,
      })
    );

    distribucionCategorias.sort((a, b) => b.total - a.total);

    res.json({
      totalIngresos,
      totalEgresos,
      saldo: totalIngresos - totalEgresos,
      distribucionCategorias,
    });
  } catch (error) {
    console.error('Error fetching resumen:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/movimientos
router.post('/', async (req, res) => {
  try {
    const data = createMovimientoSchema.parse(req.body);

    const movimiento = await prisma.movimiento.create({
      data: {
        concepto: data.concepto,
        monto: data.monto,
        tipo: data.tipo,
        categoriaId: data.categoriaId,
        plataformaId: data.plataformaId || null,
        fecha: new Date(data.fecha),
      },
      include: {
        categoria: true,
        plataforma: true,
      },
    });

    res.status(201).json(movimiento);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Datos inválidos', details: error.errors });
      return;
    }
    console.error('Error creating movimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/movimientos/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = updateMovimientoSchema.parse(req.body);

    const updateData: Record<string, unknown> = { ...data };
    if (data.fecha) {
      updateData.fecha = new Date(data.fecha);
    }

    const movimiento = await prisma.movimiento.update({
      where: { id },
      data: updateData,
      include: {
        categoria: true,
        plataforma: true,
      },
    });

    res.json(movimiento);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Datos inválidos', details: error.errors });
      return;
    }
    console.error('Error updating movimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/movimientos/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.movimiento.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting movimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
