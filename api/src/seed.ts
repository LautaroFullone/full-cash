import prisma from './lib/prisma.js';

const CATEGORIAS_INGRESO = [
  { nombre: 'Sueldo', icono: 'Briefcase' },
  { nombre: 'Emprendimiento', icono: 'Rocket' },
  { nombre: 'Bono', icono: 'Gift' },
  { nombre: 'Negocio', icono: 'Building2' },
  { nombre: 'Deudas cobradas', icono: 'HandCoins' },
  { nombre: 'Otros ingresos', icono: 'CircleDollarSign' },
];

const CATEGORIAS_EGRESO = [
  { nombre: 'Vivienda', icono: 'Home' },
  { nombre: 'Comida', icono: 'UtensilsCrossed' },
  { nombre: 'Servicios', icono: 'Wifi' },
  { nombre: 'Entretenimiento', icono: 'Gamepad2' },
  { nombre: 'Transporte', icono: 'Car' },
  { nombre: 'Salud', icono: 'Heart' },
  { nombre: 'Educación', icono: 'GraduationCap' },
  { nombre: 'Ropa', icono: 'Shirt' },
  { nombre: 'Deudas', icono: 'CreditCard' },
  { nombre: 'Mascotas', icono: 'PawPrint' },
  { nombre: 'Otros gastos', icono: 'MoreHorizontal' },
];

const PLATAFORMAS = ['Mercado Pago', 'Santander', 'Efectivo'];

async function seed() {
  console.log('🌱 Seeding database...');

  // Seed categorías
  for (const cat of CATEGORIAS_INGRESO) {
    await prisma.categoria.upsert({
      where: { nombre: cat.nombre },
      update: {},
      create: { ...cat, tipo: 'INGRESO' },
    });
  }

  for (const cat of CATEGORIAS_EGRESO) {
    await prisma.categoria.upsert({
      where: { nombre: cat.nombre },
      update: {},
      create: { ...cat, tipo: 'EGRESO' },
    });
  }

  // Seed plataformas
  for (const nombre of PLATAFORMAS) {
    await prisma.plataforma.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }

  // Seed configuración default
  await prisma.configuracion.upsert({
    where: { id: 'default' },
    update: {},
    create: { id: 'default', porcentajeAhorro: 0.20 },
  });

  console.log('✅ Seed completed!');
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
