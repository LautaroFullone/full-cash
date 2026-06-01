# ==========================================
# 1. Builder Stage
# ==========================================
FROM node:22-alpine AS builder
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY api/package*.json ./api/

# Instalar dependencias de frontend y backend
RUN npm ci
RUN npm ci --prefix api

# Copiar todo el código fuente
COPY . .

# Generar cliente de Prisma usando la versión local de la API
RUN cd api && npx prisma generate

# Compilar frontend (Vite)
RUN npm run build

# Compilar backend (TypeScript)
RUN npm run build --prefix api

# Limpiar dependencias de desarrollo de la API para aligerar la imagen final
# (Esto mantiene intacto el cliente Prisma ya generado en node_modules)
RUN npm prune --omit=dev --prefix api

# ==========================================
# 2. Production Stage
# ==========================================
FROM node:22-alpine
WORKDIR /app

# Copiar dependencias de producción y código compilado de la API
COPY --from=builder /app/api/package*.json ./api/
COPY --from=builder /app/api/node_modules ./api/node_modules
COPY --from=builder /app/api/dist ./api/dist
COPY --from=builder /app/api/src ./api/src
COPY --from=builder /app/api/prisma ./api/prisma

# Copiar los archivos estáticos compilados del frontend
COPY --from=builder /app/dist ./dist

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Ejecutar el servidor Express unificado
CMD ["node", "api/dist/index.js"]
