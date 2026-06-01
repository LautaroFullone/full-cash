import bcrypt from 'bcryptjs'
import readline from 'node:readline'
import prisma from './lib/prisma.js'

// Modo interactivo — te va pidiendo los datos
// cd api
// npm run create-user

//  Modo directo con argumentos
// npm run create-user -- --email admin@tudominio.com --nombre Lautaro --password MiClaveSegura --role ADMIN

// ── Types ────────────────────────────────────────────────────────────
interface UserInput {
   email: string
   nombre: string
   password: string
   role: 'ADMIN' | 'USER'
}

// ── CLI argument parser ──────────────────────────────────────────────
const parseArgs = (): Partial<UserInput> => {
   const args = process.argv.slice(2)
   const parsed: Record<string, string> = {}

   for (let i = 0; i < args.length; i++) {
      const match = args[i].match(/^--(\w+)$/)
      if (match && args[i + 1]) {
         parsed[match[1]] = args[++i]
      }
   }

   return {
      email: parsed.email,
      nombre: parsed.nombre,
      password: parsed.password,
      role: parsed.role as UserInput['role'] | undefined,
   }
}

// ── Interactive prompt ───────────────────────────────────────────────
const prompt = (question: string): Promise<string> => {
   const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
   return new Promise((resolve) => {
      rl.question(question, (answer) => {
         rl.close()
         resolve(answer.trim())
      })
   })
}

const collectInput = async (partial: Partial<UserInput>): Promise<UserInput> => {
   const email = partial.email || (await prompt('📧 Email: '))
   const nombre = partial.nombre || (await prompt('👤 Nombre: '))
   const password = partial.password || (await prompt('🔑 Password: '))

   let role = partial.role
   if (!role) {
      const roleInput = (await prompt('🛡️  Role (ADMIN / USER) [USER]: ')) || 'USER'
      role = roleInput.toUpperCase() as UserInput['role']
   }

   return { email, nombre, password, role }
}

// ── Validation ───────────────────────────────────────────────────────
const validate = (input: UserInput): string[] => {
   const errors: string[] = []

   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
      errors.push('Email inválido')
   }
   if (input.nombre.length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres')
   }
   if (input.password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres')
   }
   if (!['ADMIN', 'USER'].includes(input.role)) {
      errors.push('Role debe ser ADMIN o USER')
   }

   return errors
}

// ── Main ─────────────────────────────────────────────────────────────
const main = async () => {
   console.log('\n🚀 Full Cash — Crear usuario\n')

   const partialInput = parseArgs()
   const input = await collectInput(partialInput)

   const errors = validate(input)
   if (errors.length > 0) {
      console.error('❌ Errores de validación:')
      errors.forEach((e) => console.error(`   • ${e}`))
      process.exit(1)
   }

   const hashedPassword = await bcrypt.hash(input.password, 10)

   const user = await prisma.user.upsert({
      where: { email: input.email },
      update: {
         nombre: input.nombre,
         password: hashedPassword,
         role: input.role,
      },
      create: {
         email: input.email,
         nombre: input.nombre,
         password: hashedPassword,
         role: input.role,
      },
   })

   // Crear configuración por defecto si no existe
   await prisma.configuracion.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, porcentajeAhorro: 0.2 },
   })

   console.log('\n✅ Usuario creado/actualizado:')
   console.log(`   ID:     ${user.id}`)
   console.log(`   Email:  ${user.email}`)
   console.log(`   Nombre: ${user.nombre}`)
   console.log(`   Role:   ${user.role}`)
   console.log()
}

main()
   .catch((e) => {
      console.error('❌ Error:', e.message)
      process.exit(1)
   })
   .finally(async () => {
      await prisma.$disconnect()
   })
