import bcrypt from 'bcryptjs'
import prisma from './lib/prisma.js'

const ADMIN_EMAIL = 'lautarofullone.dev@gmail.com'
const ADMIN_PASSWORD = 'admin123'
const ADMIN_NOMBRE = 'Lautaro'

const CATEGORIAS_INGRESO = [
   { nombre: 'Sueldo', icono: '💼' },
   { nombre: 'Emprendimiento', icono: '🚀' },
   { nombre: 'Bono', icono: '🎁' },
   { nombre: 'Negocio', icono: '🏢' },
   { nombre: 'Deudas cobradas', icono: '🤝' },
   { nombre: 'Otros ingresos', icono: '💰' },
]

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
]

const PLATAFORMAS = ['Mercado Pago', 'Santander', 'Efectivo']

async function seed() {
   console.log('🌱 Seeding database...')

   // Create or update admin user
   const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)
   const admin = await prisma.user.upsert({
      where: { email: ADMIN_EMAIL },
      update: { role: 'ADMIN' },
      create: {
         email: ADMIN_EMAIL,
         password: hashedPassword,
         nombre: ADMIN_NOMBRE,
         role: 'ADMIN',
      },
   })
   console.log(`✅ Admin user: ${admin.email}`)

   // Global categories (userId = null) — visible to all users
   for (const cat of CATEGORIAS_INGRESO) {
      const exists = await prisma.categoria.findFirst({
         where: { nombre: cat.nombre, userId: null },
      })
      if (exists)
         await prisma.categoria.update({
            where: { id: exists.id },
            data: { icono: cat.icono },
         })
      else await prisma.categoria.create({ data: { ...cat, tipo: 'INGRESO' } })
   }

   for (const cat of CATEGORIAS_EGRESO) {
      const exists = await prisma.categoria.findFirst({
         where: { nombre: cat.nombre, userId: null },
      })
      if (exists)
         await prisma.categoria.update({
            where: { id: exists.id },
            data: { icono: cat.icono },
         })
      else await prisma.categoria.create({ data: { ...cat, tipo: 'EGRESO' } })
   }

   for (const nombre of PLATAFORMAS) {
      await prisma.plataforma.upsert({
         where: { nombre_userId: { nombre, userId: admin.id } },
         update: {},
         create: { nombre, userId: admin.id },
      })
   }

   await prisma.configuracion.upsert({
      where: { userId: admin.id },
      update: {},
      create: { userId: admin.id, porcentajeAhorro: 0.2 },
   })

   console.log('✅ Seed completed!')
   console.log(
      `\n🔑 Admin credentials:\n   Email: ${ADMIN_EMAIL}\n   Password: ${ADMIN_PASSWORD}\n`
   )
}

seed()
   .catch((e) => {
      console.error('❌ Seed failed:', e)
      process.exit(1)
   })
   .finally(async () => {
      await prisma.$disconnect()
   })
