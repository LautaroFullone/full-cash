import express, { NextFunction, Request, Response } from 'express'
import configuracionRouter from './routes/configuracion.js'
import movimientosRouter from './routes/movimientos.js'
import plataformasRouter from './routes/plataformas.js'
import categoriasRouter from './routes/categorias.js'
import { logError, logInfo } from './lib/logger.js'
import adminRouter from './routes/admin.js'
import authRouter from './routes/auth.js'
import prisma from './lib/prisma.js'
import { fileURLToPath } from 'url'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import cors from 'cors'

dotenv.config()

process.on('uncaughtException', (error) => {
   logError('uncaughtException', error)
   process.exit(1)
})

process.on('unhandledRejection', (reason) => {
   logError('unhandledRejection', reason)
})

const app = express()
const PORT = process.env.PORT || 3001
const isDev = process.env.NODE_ENV !== 'production'

app.use(cors())
app.use(express.json())
app.use(morgan(isDev ? 'dev' : 'combined'))

// Routes
app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)
app.use('/api/movimientos', movimientosRouter)
app.use('/api/categorias', categoriasRouter)
app.use('/api/plataformas', plataformasRouter)
app.use('/api/configuracion', configuracionRouter)

// Health check
app.get('/api/health', (_req, res) => {
   res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Serve frontend static assets in production
if (process.env.NODE_ENV === 'production') {
   const __filename = fileURLToPath(import.meta.url)
   const __dirname = path.dirname(__filename)
   const frontendDistPath = path.resolve(__dirname, '../../dist')

   app.use(express.static(frontendDistPath))

   app.use((req, res, next) => {
      if (req.method === 'GET' && !req.path.startsWith('/api')) {
         res.sendFile(path.join(frontendDistPath, 'index.html'))
      } else {
         next()
      }
   })
}

// Global error handler — catches any error passed via next(error)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, _next: NextFunction) => {
   logError(`${req.method} ${req.path}`, error)
   res.status(500).json({ error: 'Error interno del servidor' })
})

const DEFAULT_CATEGORIES = [
   { nombre: 'Otros gastos', tipo: 'EGRESO' as const, icono: '📦' },
   { nombre: 'Otros ingresos', tipo: 'INGRESO' as const, icono: '📦' },
]

async function seedDefaultCategories() {
   for (const cat of DEFAULT_CATEGORIES) {
      const existing = await prisma.categoria.findFirst({
         where: { nombre: cat.nombre, userId: null },
      })
      if (!existing) {
         await prisma.categoria.create({
            data: { ...cat, userId: null, isDefault: true },
         })
      } else if (!existing.isDefault) {
         await prisma.categoria.update({
            where: { id: existing.id },
            data: { isDefault: true },
         })
      }
   }
}

app.listen(PORT, async () => {
   logInfo(`Full Cash API running on http://localhost:${PORT}`)
   try {
      await prisma.$connect()
      logInfo('Conexión a la base de datos establecida con éxito.')
      await seedDefaultCategories()
   } catch (error) {
      logError('startup — prisma.$connect', error)
   }
})
