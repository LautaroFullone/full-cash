import { authMiddleware, AuthRequest } from '../middleware/auth.js'
import { logError } from '../lib/logger.js'
import prisma from '../lib/prisma.js'
import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const router = Router()

const loginSchema = z.object({
   email: z.string().email(),
   password: z.string().min(1),
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
   try {
      const { email, password } = loginSchema.parse(req.body)

      const user = await prisma.user.findUnique({ where: { email } })
      if (!user || !(await bcrypt.compare(password, user.password))) {
         res.status(401).json({ error: 'Credenciales inválidas' })
         return
      }

      const token = jwt.sign(
         { id: user.id, email: user.email, role: user.role },
         process.env.JWT_SECRET!,
         { expiresIn: '30d' }
      )

      res.json({
         token,
         user: { id: user.id, email: user.email, nombre: user.nombre, role: user.role },
      })
   } catch (error) {
      if (error instanceof z.ZodError) {
         res.status(400).json({ error: 'Email y contraseña son requeridos' })
         return
      }
      logError('POST /api/auth/login', error)
      res.status(500).json({ error: 'Error interno del servidor' })
   }
})

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
   try {
      const user = await prisma.user.findUnique({
         where: { id: (req as AuthRequest).user.id },
         select: { id: true, email: true, nombre: true, role: true },
      })
      if (!user) {
         res.status(404).json({ error: 'Usuario no encontrado' })
         return
      }
      res.json(user)
   } catch (error) {
      logError('GET /api/auth/me', error)
      res.status(500).json({ error: 'Error interno del servidor' })
   }
})

export default router
