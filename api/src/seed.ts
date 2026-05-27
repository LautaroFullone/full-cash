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

const d = (year: number, month: number, day: number) => new Date(year, month - 1, day)

const buildMovements = (
   userId: string,
   cats: Record<string, string>,
   plats: Record<string, string>
) => {
   const mp = plats['Mercado Pago']
   const san = plats['Santander']
   const ef = plats['Efectivo']

   // ------------------------------------------------------------------
   // ABRIL 2026 — mes anterior
   // ------------------------------------------------------------------
   const abril: Parameters<typeof prisma.movimiento.create>[0]['data'][] = [
      // Ingresos
      {
         userId,
         concepto: 'Sueldo abril',
         monto: 1850000,
         tipo: 'INGRESO',
         categoriaId: cats['Sueldo'],
         plataformaId: san,
         fecha: d(2026, 4, 3),
      },
      {
         userId,
         concepto: 'Proyecto freelance landing page',
         monto: 320000,
         tipo: 'INGRESO',
         categoriaId: cats['Emprendimiento'],
         plataformaId: mp,
         fecha: d(2026, 4, 11),
      },
      {
         userId,
         concepto: 'Deuda Martín',
         monto: 85000,
         tipo: 'INGRESO',
         categoriaId: cats['Deudas cobradas'],
         plataformaId: ef,
         fecha: d(2026, 4, 18),
      },
      // Egresos fijos
      {
         userId,
         concepto: 'Alquiler',
         monto: 480000,
         tipo: 'EGRESO',
         categoriaId: cats['Vivienda'],
         plataformaId: san,
         fecha: d(2026, 4, 2),
      },
      {
         userId,
         concepto: 'Expensas',
         monto: 62000,
         tipo: 'EGRESO',
         categoriaId: cats['Vivienda'],
         plataformaId: san,
         fecha: d(2026, 4, 5),
      },
      {
         userId,
         concepto: 'Cuota préstamo personal',
         monto: 145000,
         tipo: 'EGRESO',
         categoriaId: cats['Deudas'],
         plataformaId: san,
         fecha: d(2026, 4, 10),
      },
      // Servicios
      {
         userId,
         concepto: 'Internet Fibertel',
         monto: 28500,
         tipo: 'EGRESO',
         categoriaId: cats['Servicios'],
         plataformaId: mp,
         fecha: d(2026, 4, 8),
      },
      {
         userId,
         concepto: 'Luz (EDESUR)',
         monto: 41200,
         tipo: 'EGRESO',
         categoriaId: cats['Servicios'],
         plataformaId: mp,
         fecha: d(2026, 4, 15),
      },
      {
         userId,
         concepto: 'Gas natural',
         monto: 22800,
         tipo: 'EGRESO',
         categoriaId: cats['Servicios'],
         plataformaId: mp,
         fecha: d(2026, 4, 15),
      },
      {
         userId,
         concepto: 'Línea celular',
         monto: 18500,
         tipo: 'EGRESO',
         categoriaId: cats['Servicios'],
         plataformaId: mp,
         fecha: d(2026, 4, 20),
      },
      // Supermercado
      {
         userId,
         concepto: 'Supermercado Carrefour',
         monto: 97400,
         tipo: 'EGRESO',
         categoriaId: cats['Supermercado'],
         plataformaId: san,
         fecha: d(2026, 4, 5),
      },
      {
         userId,
         concepto: 'Verdulería y almacén',
         monto: 34600,
         tipo: 'EGRESO',
         categoriaId: cats['Supermercado'],
         plataformaId: ef,
         fecha: d(2026, 4, 9),
      },
      {
         userId,
         concepto: 'Supermercado Día',
         monto: 58900,
         tipo: 'EGRESO',
         categoriaId: cats['Supermercado'],
         plataformaId: san,
         fecha: d(2026, 4, 17),
      },
      {
         userId,
         concepto: 'Verdulería semanal',
         monto: 28700,
         tipo: 'EGRESO',
         categoriaId: cats['Supermercado'],
         plataformaId: ef,
         fecha: d(2026, 4, 22),
      },
      {
         userId,
         concepto: 'Supermercado Jumbo',
         monto: 112300,
         tipo: 'EGRESO',
         categoriaId: cats['Supermercado'],
         plataformaId: san,
         fecha: d(2026, 4, 28),
      },
      // Comida
      {
         userId,
         concepto: 'PedidosYa — pizza con amigos',
         monto: 24800,
         tipo: 'EGRESO',
         categoriaId: cats['Comida'],
         plataformaId: mp,
         fecha: d(2026, 4, 6),
      },
      {
         userId,
         concepto: 'Almuerzo de trabajo',
         monto: 18500,
         tipo: 'EGRESO',
         categoriaId: cats['Comida'],
         plataformaId: ef,
         fecha: d(2026, 4, 14),
      },
      {
         userId,
         concepto: 'Cena cumpleaños restaurante',
         monto: 68000,
         tipo: 'EGRESO',
         categoriaId: cats['Comida'],
         plataformaId: san,
         fecha: d(2026, 4, 19),
      },
      {
         userId,
         concepto: 'Café y medialunas oficina',
         monto: 9200,
         tipo: 'EGRESO',
         categoriaId: cats['Comida'],
         plataformaId: ef,
         fecha: d(2026, 4, 23),
      },
      // Transporte
      {
         userId,
         concepto: 'Carga SUBE',
         monto: 15000,
         tipo: 'EGRESO',
         categoriaId: cats['Transporte'],
         plataformaId: mp,
         fecha: d(2026, 4, 1),
      },
      {
         userId,
         concepto: 'Nafta YPF',
         monto: 52000,
         tipo: 'EGRESO',
         categoriaId: cats['Transporte'],
         plataformaId: ef,
         fecha: d(2026, 4, 12),
      },
      {
         userId,
         concepto: 'Peaje autopista',
         monto: 4800,
         tipo: 'EGRESO',
         categoriaId: cats['Transporte'],
         plataformaId: ef,
         fecha: d(2026, 4, 20),
      },
      // Entretenimiento
      {
         userId,
         concepto: 'Netflix',
         monto: 8900,
         tipo: 'EGRESO',
         categoriaId: cats['Entretenimiento'],
         plataformaId: mp,
         fecha: d(2026, 4, 7),
      },
      {
         userId,
         concepto: 'Spotify',
         monto: 4200,
         tipo: 'EGRESO',
         categoriaId: cats['Entretenimiento'],
         plataformaId: mp,
         fecha: d(2026, 4, 7),
      },
      {
         userId,
         concepto: 'Entradas cine',
         monto: 22400,
         tipo: 'EGRESO',
         categoriaId: cats['Entretenimiento'],
         plataformaId: san,
         fecha: d(2026, 4, 13),
      },
      {
         userId,
         concepto: 'Salida nocturna — bar',
         monto: 45000,
         tipo: 'EGRESO',
         categoriaId: cats['Entretenimiento'],
         plataformaId: ef,
         fecha: d(2026, 4, 26),
      },
      // Salud
      {
         userId,
         concepto: 'Prepaga OSDE',
         monto: 89000,
         tipo: 'EGRESO',
         categoriaId: cats['Salud'],
         plataformaId: san,
         fecha: d(2026, 4, 4),
      },
      {
         userId,
         concepto: 'Farmacia — medicamentos',
         monto: 14600,
         tipo: 'EGRESO',
         categoriaId: cats['Salud'],
         plataformaId: ef,
         fecha: d(2026, 4, 21),
      },
      // Mascotas
      {
         userId,
         concepto: 'Veterinaria — vacunación Toro',
         monto: 38500,
         tipo: 'EGRESO',
         categoriaId: cats['Mascotas'],
         plataformaId: mp,
         fecha: d(2026, 4, 16),
      },
      {
         userId,
         concepto: 'Alimento Purina Pro Plan',
         monto: 21800,
         tipo: 'EGRESO',
         categoriaId: cats['Mascotas'],
         plataformaId: san,
         fecha: d(2026, 4, 24),
      },
   ]

   // ------------------------------------------------------------------
   // MAYO 2026 — mes actual
   // ------------------------------------------------------------------
   const mayo: Parameters<typeof prisma.movimiento.create>[0]['data'][] = [
      // Ingresos
      {
         userId,
         concepto: 'Sueldo mayo',
         monto: 1850000,
         tipo: 'INGRESO',
         categoriaId: cats['Sueldo'],
         plataformaId: san,
         fecha: d(2026, 5, 5),
      },
      {
         userId,
         concepto: 'Bono productividad Q1',
         monto: 250000,
         tipo: 'INGRESO',
         categoriaId: cats['Bono'],
         plataformaId: san,
         fecha: d(2026, 5, 8),
      },
      {
         userId,
         concepto: 'Venta notebook usada',
         monto: 580000,
         tipo: 'INGRESO',
         categoriaId: cats['Otros ingresos'],
         plataformaId: mp,
         fecha: d(2026, 5, 14),
      },
      // Egresos fijos
      {
         userId,
         concepto: 'Alquiler',
         monto: 480000,
         tipo: 'EGRESO',
         categoriaId: cats['Vivienda'],
         plataformaId: san,
         fecha: d(2026, 5, 2),
      },
      {
         userId,
         concepto: 'Expensas',
         monto: 62000,
         tipo: 'EGRESO',
         categoriaId: cats['Vivienda'],
         plataformaId: san,
         fecha: d(2026, 5, 5),
      },
      {
         userId,
         concepto: 'Cuota préstamo personal',
         monto: 145000,
         tipo: 'EGRESO',
         categoriaId: cats['Deudas'],
         plataformaId: san,
         fecha: d(2026, 5, 10),
      },
      // Servicios
      {
         userId,
         concepto: 'Internet Fibertel',
         monto: 28500,
         tipo: 'EGRESO',
         categoriaId: cats['Servicios'],
         plataformaId: mp,
         fecha: d(2026, 5, 8),
      },
      {
         userId,
         concepto: 'Luz (EDESUR)',
         monto: 53800,
         tipo: 'EGRESO',
         categoriaId: cats['Servicios'],
         plataformaId: mp,
         fecha: d(2026, 5, 15),
      },
      {
         userId,
         concepto: 'Gas natural',
         monto: 31400,
         tipo: 'EGRESO',
         categoriaId: cats['Servicios'],
         plataformaId: mp,
         fecha: d(2026, 5, 15),
      },
      {
         userId,
         concepto: 'Línea celular',
         monto: 18500,
         tipo: 'EGRESO',
         categoriaId: cats['Servicios'],
         plataformaId: mp,
         fecha: d(2026, 5, 20),
      },
      // Supermercado
      {
         userId,
         concepto: 'Supermercado Carrefour',
         monto: 104200,
         tipo: 'EGRESO',
         categoriaId: cats['Supermercado'],
         plataformaId: san,
         fecha: d(2026, 5, 3),
      },
      {
         userId,
         concepto: 'Verdulería y almacén',
         monto: 31500,
         tipo: 'EGRESO',
         categoriaId: cats['Supermercado'],
         plataformaId: ef,
         fecha: d(2026, 5, 7),
      },
      {
         userId,
         concepto: 'Supermercado Día',
         monto: 67800,
         tipo: 'EGRESO',
         categoriaId: cats['Supermercado'],
         plataformaId: san,
         fecha: d(2026, 5, 12),
      },
      {
         userId,
         concepto: 'Verdulería semanal',
         monto: 29400,
         tipo: 'EGRESO',
         categoriaId: cats['Supermercado'],
         plataformaId: ef,
         fecha: d(2026, 5, 19),
      },
      {
         userId,
         concepto: 'Supermercado Jumbo — compra grande',
         monto: 138700,
         tipo: 'EGRESO',
         categoriaId: cats['Supermercado'],
         plataformaId: san,
         fecha: d(2026, 5, 24),
      },
      // Comida
      {
         userId,
         concepto: 'Rappi — sushi',
         monto: 32400,
         tipo: 'EGRESO',
         categoriaId: cats['Comida'],
         plataformaId: mp,
         fecha: d(2026, 5, 4),
      },
      {
         userId,
         concepto: 'Almuerzo reunión trabajo',
         monto: 21800,
         tipo: 'EGRESO',
         categoriaId: cats['Comida'],
         plataformaId: ef,
         fecha: d(2026, 5, 9),
      },
      {
         userId,
         concepto: 'Asado del fin de semana',
         monto: 54000,
         tipo: 'EGRESO',
         categoriaId: cats['Comida'],
         plataformaId: ef,
         fecha: d(2026, 5, 17),
      },
      {
         userId,
         concepto: 'Café y snacks',
         monto: 11600,
         tipo: 'EGRESO',
         categoriaId: cats['Comida'],
         plataformaId: ef,
         fecha: d(2026, 5, 22),
      },
      // Transporte
      {
         userId,
         concepto: 'Carga SUBE',
         monto: 15000,
         tipo: 'EGRESO',
         categoriaId: cats['Transporte'],
         plataformaId: mp,
         fecha: d(2026, 5, 1),
      },
      {
         userId,
         concepto: 'Nafta YPF',
         monto: 55000,
         tipo: 'EGRESO',
         categoriaId: cats['Transporte'],
         plataformaId: ef,
         fecha: d(2026, 5, 11),
      },
      {
         userId,
         concepto: 'Taxi / Uber noche',
         monto: 18200,
         tipo: 'EGRESO',
         categoriaId: cats['Transporte'],
         plataformaId: mp,
         fecha: d(2026, 5, 16),
      },
      // Entretenimiento
      {
         userId,
         concepto: 'Netflix',
         monto: 8900,
         tipo: 'EGRESO',
         categoriaId: cats['Entretenimiento'],
         plataformaId: mp,
         fecha: d(2026, 5, 7),
      },
      {
         userId,
         concepto: 'Spotify',
         monto: 4200,
         tipo: 'EGRESO',
         categoriaId: cats['Entretenimiento'],
         plataformaId: mp,
         fecha: d(2026, 5, 7),
      },
      {
         userId,
         concepto: 'Disney+ anual',
         monto: 28000,
         tipo: 'EGRESO',
         categoriaId: cats['Entretenimiento'],
         plataformaId: mp,
         fecha: d(2026, 5, 13),
      },
      {
         userId,
         concepto: 'Salida — bar y bowling',
         monto: 76000,
         tipo: 'EGRESO',
         categoriaId: cats['Entretenimiento'],
         plataformaId: ef,
         fecha: d(2026, 5, 23),
      },
      // Salud
      {
         userId,
         concepto: 'Prepaga OSDE',
         monto: 89000,
         tipo: 'EGRESO',
         categoriaId: cats['Salud'],
         plataformaId: san,
         fecha: d(2026, 5, 4),
      },
      // Ropa
      {
         userId,
         concepto: 'Zapatillas Nike — Falabella',
         monto: 148000,
         tipo: 'EGRESO',
         categoriaId: cats['Ropa'],
         plataformaId: san,
         fecha: d(2026, 5, 18),
      },
      // Mascotas
      {
         userId,
         concepto: 'Alimento Purina y snacks',
         monto: 24600,
         tipo: 'EGRESO',
         categoriaId: cats['Mascotas'],
         plataformaId: san,
         fecha: d(2026, 5, 6),
      },
      // Educación
      {
         userId,
         concepto: 'Curso React avanzado — Udemy',
         monto: 12500,
         tipo: 'EGRESO',
         categoriaId: cats['Educación'],
         plataformaId: mp,
         fecha: d(2026, 5, 20),
      },
   ]

   // ------------------------------------------------------------------
   // JUNIO 2026 — mes siguiente
   // ------------------------------------------------------------------
   const junio: Parameters<typeof prisma.movimiento.create>[0]['data'][] = [
      // Ingresos
      {
         userId,
         concepto: 'Sueldo junio',
         monto: 1920000,
         tipo: 'INGRESO',
         categoriaId: cats['Sueldo'],
         plataformaId: san,
         fecha: d(2026, 6, 4),
      },
      {
         userId,
         concepto: 'Proyecto freelance — e-commerce',
         monto: 450000,
         tipo: 'INGRESO',
         categoriaId: cats['Emprendimiento'],
         plataformaId: mp,
         fecha: d(2026, 6, 15),
      },
      // Egresos fijos
      {
         userId,
         concepto: 'Alquiler',
         monto: 510000,
         tipo: 'EGRESO',
         categoriaId: cats['Vivienda'],
         plataformaId: san,
         fecha: d(2026, 6, 2),
      },
      {
         userId,
         concepto: 'Expensas',
         monto: 65000,
         tipo: 'EGRESO',
         categoriaId: cats['Vivienda'],
         plataformaId: san,
         fecha: d(2026, 6, 5),
      },
      {
         userId,
         concepto: 'Cuota préstamo personal',
         monto: 145000,
         tipo: 'EGRESO',
         categoriaId: cats['Deudas'],
         plataformaId: san,
         fecha: d(2026, 6, 10),
      },
      // Servicios
      {
         userId,
         concepto: 'Internet Fibertel',
         monto: 28500,
         tipo: 'EGRESO',
         categoriaId: cats['Servicios'],
         plataformaId: mp,
         fecha: d(2026, 6, 8),
      },
      {
         userId,
         concepto: 'Luz (EDESUR)',
         monto: 47600,
         tipo: 'EGRESO',
         categoriaId: cats['Servicios'],
         plataformaId: mp,
         fecha: d(2026, 6, 15),
      },
      {
         userId,
         concepto: 'Gas natural',
         monto: 68900,
         tipo: 'EGRESO',
         categoriaId: cats['Servicios'],
         plataformaId: mp,
         fecha: d(2026, 6, 15),
      },
      {
         userId,
         concepto: 'Línea celular',
         monto: 18500,
         tipo: 'EGRESO',
         categoriaId: cats['Servicios'],
         plataformaId: mp,
         fecha: d(2026, 6, 20),
      },
      // Supermercado
      {
         userId,
         concepto: 'Supermercado Carrefour',
         monto: 92100,
         tipo: 'EGRESO',
         categoriaId: cats['Supermercado'],
         plataformaId: san,
         fecha: d(2026, 6, 7),
      },
      {
         userId,
         concepto: 'Verdulería y almacén',
         monto: 33800,
         tipo: 'EGRESO',
         categoriaId: cats['Supermercado'],
         plataformaId: ef,
         fecha: d(2026, 6, 11),
      },
      {
         userId,
         concepto: 'Supermercado Día',
         monto: 71400,
         tipo: 'EGRESO',
         categoriaId: cats['Supermercado'],
         plataformaId: san,
         fecha: d(2026, 6, 18),
      },
      {
         userId,
         concepto: 'Verdulería semanal',
         monto: 27600,
         tipo: 'EGRESO',
         categoriaId: cats['Supermercado'],
         plataformaId: ef,
         fecha: d(2026, 6, 25),
      },
      // Comida
      {
         userId,
         concepto: 'PedidosYa — hamburguesas',
         monto: 28900,
         tipo: 'EGRESO',
         categoriaId: cats['Comida'],
         plataformaId: mp,
         fecha: d(2026, 6, 6),
      },
      {
         userId,
         concepto: 'Cena aniversario restaurante',
         monto: 92000,
         tipo: 'EGRESO',
         categoriaId: cats['Comida'],
         plataformaId: san,
         fecha: d(2026, 6, 14),
      },
      {
         userId,
         concepto: 'Almuerzo con compañeros',
         monto: 24500,
         tipo: 'EGRESO',
         categoriaId: cats['Comida'],
         plataformaId: ef,
         fecha: d(2026, 6, 19),
      },
      {
         userId,
         concepto: 'Asado familia',
         monto: 68000,
         tipo: 'EGRESO',
         categoriaId: cats['Comida'],
         plataformaId: ef,
         fecha: d(2026, 6, 28),
      },
      // Transporte
      {
         userId,
         concepto: 'Carga SUBE',
         monto: 15000,
         tipo: 'EGRESO',
         categoriaId: cats['Transporte'],
         plataformaId: mp,
         fecha: d(2026, 6, 1),
      },
      {
         userId,
         concepto: 'Nafta YPF',
         monto: 58000,
         tipo: 'EGRESO',
         categoriaId: cats['Transporte'],
         plataformaId: ef,
         fecha: d(2026, 6, 9),
      },
      {
         userId,
         concepto: 'Service auto — Cambio aceite',
         monto: 85000,
         tipo: 'EGRESO',
         categoriaId: cats['Transporte'],
         plataformaId: san,
         fecha: d(2026, 6, 22),
      },
      // Entretenimiento
      {
         userId,
         concepto: 'Netflix',
         monto: 8900,
         tipo: 'EGRESO',
         categoriaId: cats['Entretenimiento'],
         plataformaId: mp,
         fecha: d(2026, 6, 7),
      },
      {
         userId,
         concepto: 'Spotify',
         monto: 4200,
         tipo: 'EGRESO',
         categoriaId: cats['Entretenimiento'],
         plataformaId: mp,
         fecha: d(2026, 6, 7),
      },
      {
         userId,
         concepto: 'Entradas teatro — musical',
         monto: 58000,
         tipo: 'EGRESO',
         categoriaId: cats['Entretenimiento'],
         plataformaId: san,
         fecha: d(2026, 6, 21),
      },
      // Salud
      {
         userId,
         concepto: 'Prepaga OSDE',
         monto: 89000,
         tipo: 'EGRESO',
         categoriaId: cats['Salud'],
         plataformaId: san,
         fecha: d(2026, 6, 4),
      },
      {
         userId,
         concepto: 'Dentista — limpieza',
         monto: 45000,
         tipo: 'EGRESO',
         categoriaId: cats['Salud'],
         plataformaId: ef,
         fecha: d(2026, 6, 17),
      },
      // Ropa
      {
         userId,
         concepto: 'Ropa invierno — Zara',
         monto: 215000,
         tipo: 'EGRESO',
         categoriaId: cats['Ropa'],
         plataformaId: san,
         fecha: d(2026, 6, 13),
      },
      // Mascotas
      {
         userId,
         concepto: 'Alimento mensual Toro',
         monto: 22400,
         tipo: 'EGRESO',
         categoriaId: cats['Mascotas'],
         plataformaId: san,
         fecha: d(2026, 6, 5),
      },
      // Educación
      {
         userId,
         concepto: 'Suscripción Platzi anual',
         monto: 89000,
         tipo: 'EGRESO',
         categoriaId: cats['Educación'],
         plataformaId: mp,
         fecha: d(2026, 6, 3),
      },
   ]

   return [...abril, ...mayo, ...junio]
}

const seed = async () => {
   console.log('🌱 Seeding database...')

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

   // Fetch category and platform IDs
   const categorias = await prisma.categoria.findMany({ where: { userId: null } })
   const plataformas = await prisma.plataforma.findMany({ where: { userId: admin.id } })

   const cats = Object.fromEntries(categorias.map((c) => [c.nombre, c.id]))
   const plats = Object.fromEntries(plataformas.map((p) => [p.nombre, p.id]))

   // Delete existing movements for these 3 months to make seed idempotent
   await prisma.movimiento.deleteMany({
      where: {
         userId: admin.id,
         fecha: {
            gte: new Date(2026, 3, 1), // April 1
            lt: new Date(2026, 6, 1), // July 1
         },
      },
   })
   console.log('🗑️  Cleared existing movements for Apr–Jun 2026')

   const movements = buildMovements(admin.id, cats, plats)

   for (const mov of movements) {
      await prisma.movimiento.create({ data: mov })
   }

   console.log(`✅ Created ${movements.length} movements across Apr–Jun 2026`)
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
