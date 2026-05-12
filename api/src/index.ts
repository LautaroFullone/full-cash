import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import movimientosRouter from './routes/movimientos.js';
import categoriasRouter from './routes/categorias.js';
import plataformasRouter from './routes/plataformas.js';
import configuracionRouter from './routes/configuracion.js';

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

app.listen(PORT, () => {
  console.log(`🚀 Full Cash API running on http://localhost:${PORT}`);
});
