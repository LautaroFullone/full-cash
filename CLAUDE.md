# Full Cash — Convenciones de arquitectura

## Estructura de módulos

```
src/
├── modules/<dominio>/
│   ├── services/       un archivo por llamada a la API; tipos definidos inline
│   ├── hooks/          lógica de negocio, consume services + stores
│   ├── components/     sub-componentes visuales (sin fetch directo)
│   └── <Page>.tsx      página raíz — orquesta hooks y compone componentes
├── components/         primitivos UI reutilizados entre módulos
│   ├── CurrencyInput.tsx   input de moneda con formateo live (ver props abajo)
│   ├── DatePicker.tsx      selector de fecha inline (calendario en flujo, no dropdown)
│   ├── PlatformSelect.tsx  select custom con expansión inline
│   └── index.ts            barrel — importar siempre desde '@/components'
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
- `@/utils` y `@/components` tienen barrel files (`index.ts`) — importar siempre desde el barrel, nunca desde el path individual.

## Componentes UI (`src/components/`)

### CurrencyInput

Input de monto con formateo en tiempo real (separadores de miles al escribir, tracking de cursor).

```tsx
<CurrencyInput
  value={monto}           // number | ''
  onChange={setMonto}
  variant="default"       // 'default' | 'hero'
  color="accent"          // 'accent' | 'danger'
/>
```

- `variant="default"` — input estándar con `$` a la izquierda.
- `variant="hero"` — display centrado grande (`text-4xl`) para el campo principal del form. Usa `tabular-nums`.
- `color` — tiñe el símbolo `$` y el texto del valor. Usar `'danger'` para tipo `EGRESO`.

### DatePicker

Selector de fecha con calendario **inline** (no dropdown absoluto). El calendario se expande en el flujo del documento con animación CSS grid-rows. No usar dropdowns absolutos dentro de contenedores con `overflow-y: auto` — se cortarán.

```tsx
<DatePicker value={fecha} onChange={setFecha} /> // value: 'yyyy-MM-dd'
```

### PlatformSelect

Select custom que reemplaza `<select>` nativo. Mismo patrón de expansión inline que DatePicker.

```tsx
<PlatformSelect
  value={plataformaId}    // string ('' = sin plataforma)
  onChange={setPlataformaId}
  plataformas={plataformas}
/>
```

## Patrones UI

### Modales con animación de salida

Los modales usan estado `mounted` + `closing` para animar la entrada y salida. **No usar `{isOpen && <Modal />}`** — eso elimina la animación de salida.

```tsx
const [mounted, setMounted] = useState(false)
const [closing, setClosing] = useState(false)
const timerRef = useRef<ReturnType<typeof setTimeout>>()

useEffect(() => {
  if (isOpen) { clearTimeout(timerRef.current); setMounted(true); setClosing(false) }
}, [isOpen])
useEffect(() => () => clearTimeout(timerRef.current), [])

const handleClose = () => {
  setClosing(true)
  timerRef.current = setTimeout(() => {
    setMounted(false); setClosing(false)
    onClose?.()
  }, 250)
}

// En JSX:
{mounted && (
  <div className={closing ? 'animate-overlay-out' : 'animate-overlay-in'}>
    <div className={closing ? 'animate-slide-down' : 'animate-slide-up'}>
      ...
    </div>
  </div>
)}
```

Clases disponibles en `index.css`: `animate-slide-up`, `animate-slide-down`, `animate-overlay-in`, `animate-overlay-out`, `animate-fade-in`, `animate-scale-in`.

### Expansión inline (sin dropdowns absolutos)

Para cualquier control que expanda contenido dentro de un scroll container, usar el CSS grid-rows trick en lugar de `position: absolute`:

```tsx
<div className={cn(
  'grid transition-[grid-template-rows] duration-300 ease-out',
  open ? '[grid-template-rows:1fr]' : '[grid-template-rows:0fr]'
)}>
  <div className="overflow-hidden">
    {/* contenido */}
  </div>
</div>
```

### Hit areas mínimas

Todo elemento interactivo debe tener al menos **40×40px** de área clickeable. Los icon buttons usan `w-10 h-10`. Para botones de navegación de calendario u otros controles compactos, mínimo `w-9 h-9`.

### Transitions específicas

Nunca usar `transition-all`. Especificar siempre las propiedades exactas:
- Solo colores: `transition-colors`
- Solo transform: `transition-transform`
- Colores + transform: `transition-[background-color,opacity,transform]`
- Border + shadow: `transition-[border-color,box-shadow]`

## CSS / Design System (`src/index.css`)

### CSS Layers

Los estilos base de `input`, `select` y `textarea` están en `@layer base`. Esto permite que las utilidades de Tailwind (`pl-8`, `border-none`, `bg-transparent`, etc.) los overrideen correctamente. Si se agregan nuevos reset de elementos HTML, hacerlo dentro de `@layer base`.

### Tokens disponibles

```
--color-background / background-deep / surface / surface-elevated / surface-hover
--color-accent / accent-dim
--color-danger / danger-dim
--color-warning / warning-dim
--color-text-primary / text-secondary / text-muted
--color-border / border-strong
--radius-xs(6) / sm(8) / md(12) / lg(16) / xl(20) / full
--shadow-card / elevated / glow-accent / glow-danger
--font-heading (Montserrat) / font-body (Google Sans / Inter)
```

### Animaciones disponibles

| Clase | Uso |
|---|---|
| `animate-fade-in` | Entrada con fade + translateY(8px) |
| `animate-slide-up` | Entrada de modal/sheet desde abajo |
| `animate-slide-down` | Salida de modal/sheet hacia abajo |
| `animate-overlay-in` | Fade-in del backdrop del modal |
| `animate-overlay-out` | Fade-out del backdrop del modal |
| `animate-scale-in` | Entrada con scale(0.95) |

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
