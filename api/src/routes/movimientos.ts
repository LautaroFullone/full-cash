import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

const createMovimientoSchema = z.object({
  concepto: z.string().min(1),
  monto: z.number().positive(),
  tipo: z.enum(['INGRESO', 'EGRESO']),
  categoriaId: z.string().min(1),
  plataformaId: z.string().optional().nullable(),
  fecha: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
});

const updateMovimientoSchema = createMovimientoSchema.partial();

// GET /api/movimientos?mes=5&anio=2026
router.get('/', async (req, res) => {
  try {
    const userId = (req as AuthRequest).user.id;
    const mes = parseInt(req.query.mes as string);
    const anio = parseInt(req.query.anio as string);

    if (isNaN(mes) || isNaN(anio)) {
      res.status(400).json({ error: 'Parámetros mes y anio son requeridos' });
      return;
    }

    const startDate = new Date(anio, mes - 1, 1);
    const endDate = new Date(anio, mes, 1);

    const movimientos = await prisma.movimiento.findMany({
      where: { userId, fecha: { gte: startDate, lt: endDate } },
      include: { categoria: true, plataforma: true },
      orderBy: { fecha: 'desc' },
    });

    res.json(movimientos);
  } catch {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/movimientos/resumen?mes=5&anio=2026
router.get('/resumen', async (req, res) => {
  try {
    const userId = (req as AuthRequest).user.id;
    const mes = parseInt(req.query.mes as string);
    const anio = parseInt(req.query.anio as string);

    if (isNaN(mes) || isNaN(anio)) {
      res.status(400).json({ error: 'Parámetros mes y anio son requeridos' });
      return;
    }

    const startDate = new Date(anio, mes - 1, 1);
    const endDate = new Date(anio, mes, 1);

    const movimientos = await prisma.movimiento.findMany({
      where: { userId, fecha: { gte: startDate, lt: endDate } },
      include: { categoria: true },
    });

    const totalIngresos = movimientos.filter(m => m.tipo === 'INGRESO').reduce((s, m) => s + m.monto, 0);
    const totalEgresos = movimientos.filter(m => m.tipo === 'EGRESO').reduce((s, m) => s + m.monto, 0);

    const categoriaMap = new Map<string, { nombre: string; total: number }>();
    movimientos
      .filter(m => m.tipo === 'EGRESO')
      .forEach(m => {
        const existing = categoriaMap.get(m.categoriaId);
        if (existing) existing.total += m.monto;
        else categoriaMap.set(m.categoriaId, { nombre: m.categoria.nombre, total: m.monto });
      });

    const distribucionCategorias = Array.from(categoriaMap.entries())
      .map(([categoriaId, data]) => ({
        categoriaId,
        categoriaNombre: data.nombre,
        total: data.total,
        porcentaje: totalEgresos > 0 ? (data.total / totalEgresos) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total);

    res.json({ totalIngresos, totalEgresos, saldo: totalIngresos - totalEgresos, distribucionCategorias });
  } catch {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/movimientos
router.post('/', async (req, res) => {
  try {
    const userId = (req as AuthRequest).user.id;
    const data = createMovimientoSchema.parse(req.body);
    const movimiento = await prisma.movimiento.create({
      data: {
        userId,
        concepto: data.concepto,
        monto: data.monto,
        tipo: data.tipo,
        categoriaId: data.categoriaId,
        plataformaId: data.plataformaId || null,
        fecha: new Date(data.fecha),
      },
      include: { categoria: true, plataforma: true },
    });
    res.status(201).json(movimiento);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Datos inválidos', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/movimientos/:id
router.put('/:id', async (req, res) => {
  try {
    const userId = (req as unknown as AuthRequest).user.id;
    const { id } = req.params;
    const data = updateMovimientoSchema.parse(req.body);

    const existing = await prisma.movimiento.findFirst({ where: { id, userId } });
    if (!existing) { res.status(404).json({ error: 'Movimiento no encontrado' }); return; }

    const updateData: Record<string, unknown> = { ...data };
    if (data.fecha) updateData.fecha = new Date(data.fecha);

    const movimiento = await prisma.movimiento.update({
      where: { id },
      data: updateData,
      include: { categoria: true, plataforma: true },
    });
    res.json(movimiento);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Datos inválidos', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/movimientos/:id
router.delete('/:id', async (req, res) => {
  try {
    const userId = (req as unknown as AuthRequest).user.id;
    const { id } = req.params;
    const existing = await prisma.movimiento.findFirst({ where: { id, userId } });
    if (!existing) { res.status(404).json({ error: 'Movimiento no encontrado' }); return; }
    await prisma.movimiento.delete({ where: { id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
