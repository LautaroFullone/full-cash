# Full Cash — Architecture Conventions

## Module structure

```
src/
├── modules/<domain>/
│   ├── services/       one file per API call; types defined inline
│   ├── hooks/          business logic, consumes services + stores
│   ├── components/     visual sub-components (no direct fetch)
│   └── <Page>.tsx      root page — orchestrates hooks and composes components
├── components/         UI primitives reused across modules (CurrencyInput, DatePicker)
├── stores/             Zustand stores — state + setters ONLY, no business logic
├── models/             one file per domain model; types shared across two or more modules
│   ├── categoria.ts    Categoria, TipoMovimiento, CATEGORY_COLORS
│   └── plataforma.ts   Plataforma
├── utils/              one file per utility function
│   ├── cn.ts
│   ├── formatCurrency.ts
│   └── formatNumber.ts
├── lib/
│   └── fetchAPI.ts     base fetch with auth header
├── App.tsx             thin shell: reads authStore, calls useAuth().init(), renders LoginPage or DashboardPage
└── main.tsx            QueryClientProvider + App, no AuthProvider
```

## Rules

- **Service** = one file, one API call. Export the function + its request/response types inline. Always use `fetchAPI` from `@/shared/lib/fetchAPI`.
- **Hook** = consumes services + updates stores. Has loading/error state. Never makes `fetch` calls directly.
- **Store (Zustand)** = state + setters only. No async logic, no API calls. Business logic lives in the hook.
- **Page** = root of a module. Orchestrates hooks and assembles components. Never calls `fetchAPI` directly.
- **Component** = purely visual, receives props. No fetch, no store reads (unless unavoidable).
- Cross-module imports resolve to root-level directories: `@/models/`, `@/utils/`, `@/components/`, `@/stores/`, `@/lib/`. If two modules share something, move it there.

## Auth flow

1. `App.tsx` calls `useAuth().init()` on mount.
2. `init()` reads the token from `localStorage`, calls `getMe`, sets `authStore.user`.
3. `authStore.isLoading` starts `true`; set to `false` after init resolves.
4. `logout()` removes the token and sets `authStore.user = null`.

## Tech stack

- **React 19** + **TypeScript** strict
- **Vite** with `@vitejs/plugin-react`
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **React Query** (`@tanstack/react-query`) — `staleTime: 30s`, `retry: 1`, `refetchOnWindowFocus: false`
- **Zustand** for global state
- **Express 5** backend with Prisma + PostgreSQL
- JWT in `localStorage` (`token` key), 30-day expiry

## Backend conventions

- All routes except `POST /api/auth/login` require `authMiddleware`.
- Admin-only routes additionally require `adminMiddleware`.
- When a route handler has typed params (e.g. `Request<{id: string}>`), cast as `(req as unknown as AuthRequest)` to satisfy TypeScript with the auth extension.
- `prisma db push` (no migrations). Schema source of truth is `api/prisma/schema.prisma`.
- Global categories have `userId = null`. Per-user hidden globals are tracked in `UserCategoriaHidden`.

## Modules

| Module | Domain |
|---|---|
| `auth` | Login, logout, session init |
| `movements` | Movimientos + resumen mensual |
| `categories` | Categorías (global + personal, hide/show) |
| `platforms` | Plataformas |
| `dashboard` | Page layout, month selector, savings config |
| `admin` | User management (ADMIN only) |
