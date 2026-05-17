import prisma from './lib/prisma.js';

const CATEGORIAS_INGRESO = [
  { nombre: 'Sueldo', icono: '💼' },
  { nombre: 'Emprendimiento', icono: '🚀' },
  { nombre: 'Bono', icono: '🎁' },
  { nombre: 'Negocio', icono: '🏢' },
  { nombre: 'Deudas cobradas', icono: '🤝' },
  { nombre: 'Otros ingresos', icono: '💰' },
];

const CATEGORIAS_EGRESO = [
  { nombre: 'Vivienda', icono: '🏠' },
  { nombre: 'Comida', icono: '🍕' },
  { nombre: 'Servicios', icono: '💡' },
  { nombre: 'Entretenimiento', icono: '🎮' },
  { nombre: 'Transporte', icono: '🚗' },
  { nombre: 'Salud', icono: '💊' },
  { nombre: 'Educación', icono: '🎓' },
  { nombre: 'Ropa', icono: '👕' },
  { nombre: 'Deudas', icono: '💳' },
  { nombre: 'Mascotas', icono: '🐕' },
  { nombre: 'Supermercado', icono: '🛒' },
  { nombre: 'Otros gastos', icono: '📌' },
];

const PLATAFORMAS = ['Mercado Pago', 'Santander', 'Efectivo'];

async function seed() {
  console.log('🌱 Seeding database...');

  for (const cat of CATEGORIAS_INGRESO) {
    await prisma.categoria.upsert({
      where: { nombre: cat.nombre },
      update: { icono: cat.icono },
      create: { ...cat, tipo: 'INGRESO' },
    });
  }

  for (const cat of CATEGORIAS_EGRESO) {
    await prisma.categoria.upsert({
      where: { nombre: cat.nombre },
      update: { icono: cat.icono },
      create: { ...cat, tipo: 'EGRESO' },
    });
  }

  for (const nombre of PLATAFORMAS) {
    await prisma.plataforma.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }

  await prisma.configuracion.upsert({
    where: { id: 'default' },
    update: {},
    create: { id: 'default', porcentajeAhorro: 0.20 },
  });

  console.log('✅ Seed completed!');
}

seed()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
