import configuracionRouter from './routes/configuracion.js';
import movimientosRouter from './routes/movimientos.js';
import plataformasRouter from './routes/plataformas.js';
import categoriasRouter from './routes/categorias.js';
import prisma from './lib/prisma.js';
import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/movimientos', movimientosRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/plataformas', plataformasRouter);
app.use('/api/configuracion', configuracionRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend static assets in production
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const frontendDistPath = path.resolve(__dirname, '../../dist');
  
  app.use(express.static(frontendDistPath));
  
  // Serve the SPA client for any non-API route
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    }
  });
}

try {
  await prisma.$connect();
  console.log('✅ Conexión a la base de datos establecida con éxito.');
} catch (error) {
  console.error('❌ Error al conectar con la base de datos:', error);
}

app.listen(PORT, () => {
  console.log(`🚀 Full Cash API running on http://localhost:${PORT}`);
});
