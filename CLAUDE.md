# Full Cash — Convenciones de arquitectura

## Estructura de módulos

```
src/
├── modules/<dominio>/
│   ├── services/       un archivo por llamada a la API; tipos definidos inline
│   ├── hooks/          lógica de negocio, consume services + stores
│   ├── components/     sub-componentes visuales (sin fetch directo)
│   └── <Page>.tsx      página raíz — orquesta hooks y compone componentes
├── components/         primitivos UI reutilizados entre módulos (CurrencyInput, DatePicker)
├── stores/             stores Zustand — estado + setters ÚNICAMENTE, sin lógica de negocio
├── models/             un archivo por modelo de dominio; tipos compartidos entre dos o más módulos
│   ├── categoria.ts    Categoria, TipoMovimiento, CATEGORY_COLORS
│   └── plataforma.ts   Plataforma
├── utils/              un archivo por función utilitaria
│   ├── cn.ts
│   ├── formatCurrency.ts
│   └── formatNumber.ts
├── lib/
│   └── fetchAPI.ts     fetch base con header de autenticación
├── App.tsx             shell delgado: lee authStore, llama useAuth().init(), renderiza LoginPage o DashboardPage
└── main.tsx            QueryClientProvider + App, sin AuthProvider
```

## Reglas

- **Service** = un archivo, una llamada a la API. Exporta la función + sus tipos de request/response inline. Siempre usar `fetchAPI` de `@/lib/fetchAPI`.
- **Hook** = consume services + actualiza stores. Tiene estado de loading/error. Nunca hace llamadas `fetch` directamente.
- **Store (Zustand)** = estado + setters únicamente. Sin lógica async, sin llamadas a la API. La lógica de negocio vive en el hook.
- **Page** = raíz de un módulo. Orquesta hooks y ensambla componentes. Nunca llama `fetchAPI` directamente.
- **Component** = puramente visual, recibe props. Sin fetch, sin lectura de stores (salvo que sea inevitable).
- Los imports entre módulos se resuelven hacia los directorios raíz: `@/models/`, `@/utils/`, `@/components/`, `@/stores/`, `@/lib/`. Si dos módulos comparten algo, moverlo ahí.
- `@/utils` y `@/components` tienen barrel files (`index.ts`) — preferir importar desde el barrel antes que desde el path individual.

## Flujo de autenticación

1. `App.tsx` llama `useAuth().init()` al montar.
2. `init()` lee el token de `localStorage`, llama `getMe`, setea `authStore.user`.
3. `authStore.isLoading` arranca en `true`; se setea a `false` cuando init resuelve.
4. `logout()` elimina el token y setea `authStore.user = null`.

## Stack tecnológico

- **React 19** + **TypeScript** strict
- **Vite** con `@vitejs/plugin-react`
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **React Query** (`@tanstack/react-query`) — `staleTime: 30s`, `retry: 1`, `refetchOnWindowFocus: false`
- **Zustand** para estado global
- **Express 5** backend con Prisma + PostgreSQL + **Morgan** HTTP logger (formato `dev` en desarrollo, `combined` en producción)
- JWT en `localStorage` (clave `token`), expiración 30 días

## Convenciones de backend

- Todas las rutas excepto `POST /api/auth/login` requieren `authMiddleware`.
- Las rutas solo-admin requieren además `adminMiddleware`.
- Cuando un handler tiene params tipados (ej. `Request<{id: string}>`), castear como `(req as unknown as AuthRequest)` para satisfacer TypeScript con la extensión de auth.
- `prisma db push` (sin migrations). El schema es la fuente de verdad en `api/prisma/schema.prisma`.
- Las categorías globales tienen `userId = null`. Las globales ocultas por usuario se trackean en `UserCategoriaHidden`.

## Módulos

| Módulo | Dominio |
|---|---|
| `auth` | Login, logout, inicio de sesión |
| `movements` | Movimientos + resumen mensual |
| `categories` | Categorías (global + personal, ocultar/mostrar) |
| `platforms` | Plataformas |
| `dashboard` | Layout principal, selector de mes, config de ahorro |
| `admin` | Gestión de usuarios (solo ADMIN) |
