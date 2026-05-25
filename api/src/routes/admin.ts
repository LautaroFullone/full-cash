import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth.js';
import { logError } from '../lib/logger.js';
import prisma from '../lib/prisma.js';
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombre: z.string().min(1, 'Nombre es requerido'),
});

const updateUserSchema = z.object({
  nombre: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
});

// GET /api/admin/users
router.get('/users', async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, nombre: true, role: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    res.json(users);
  } catch (error) {
    logError('GET /api/admin/users', error)
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/admin/users
router.post('/users', async (req, res) => {
  try {
    const data = createUserSchema.parse(req.body);
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) {
      res.status(400).json({ error: 'Ya existe un usuario con ese email' });
      return;
    }
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { email: data.email, password: hashed, nombre: data.nombre, role: 'USER' },
      select: { id: true, email: true, nombre: true, role: true, createdAt: true },
    });
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logError('POST /api/admin/users', error)
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/admin/users/:id
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = updateUserSchema.parse(req.body);
    const updateData: Record<string, unknown> = {};
    if (data.nombre) updateData.nombre = data.nombre;
    if (data.password) updateData.password = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, nombre: true, role: true, createdAt: true },
    });
    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logError(`PUT /api/admin/users/${req.params.id}`, error)
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const requestingUser = (req as unknown as AuthRequest).user;
    if (id === requestingUser.id) {
      res.status(400).json({ error: 'No podés eliminarte a vos mismo' });
      return;
    }
    await prisma.user.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    logError(`DELETE /api/admin/users/${req.params.id}`, error)
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
