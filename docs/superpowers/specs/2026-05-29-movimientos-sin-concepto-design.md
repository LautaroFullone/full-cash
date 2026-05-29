# Movimientos sin concepto — Diseño

## Contexto y problema

Hoy el campo `concepto` de un movimiento es **obligatorio**. Al mostrar la app a usuarios reales, varios encontraron molesto tener que escribir un concepto en cada movimiento.

Hay dos perfiles de uso legítimos:

- **Categorías generales + concepto por movimiento** (uso actual del autor): la categoría es amplia y el concepto refina cada movimiento.
- **Categorías específicas, sin concepto**: la categoría ya describe el movimiento, así que el concepto sobra.

La app debe soportar ambos. El objetivo es **permitir movimientos sin concepto** y que esa ausencia se lea como una **opción válida y deliberada**, no como un olvido.

## Alcance

- `concepto` pasa a ser **opcional** en todo el stack (DB, API, tipos, formulario).
- En la lista agrupada por categoría, una fila sin concepto muestra un **guión `—` atenuado** en el lugar del título.
- No se introducen casos especiales adicionales (ver "Decisiones").

Fuera de alcance: resumen mensual, distribución por categoría, totales y agrupación — ninguno usa `concepto`, no se modifican. No existe búsqueda por concepto.

## Diseño

### 1. Modelo de datos (backend)

- `api/prisma/schema.prisma`: `concepto String` → `concepto String?`. Aplicar con `prisma db push` (sin migrations, según convención del proyecto).
- `api/src/routes/movimientos.ts`: el schema Zod de creación pasa de
  `concepto: z.string().min(1).max(100)` a `concepto: z.string().max(100).optional().nullable()`.
- Normalizar antes de persistir: un `concepto` que llega como `''` o solo espacios se guarda como `null`, no como string vacío. Así no conviven dos representaciones de "sin concepto".

### 2. Tipos y services (frontend)

- `src/modules/movements/services/getMovimientos.ts`: `concepto: string` → `concepto: string | null`.
- `src/modules/movements/services/postMovimiento.ts` y `putMovimiento.ts`: `concepto` pasa a opcional / `string | null`.

### 3. Formulario (`src/modules/movements/components/MovementForm.tsx`)

- Eliminar la validación bloqueante `if (!concepto.trim()) { setError('Ingresá un concepto'); return }` (líneas ~125-128).
- Cambiar el label `Concepto` → `Concepto (opcional)`.
- Al enviar (create y update), mandar `concepto: concepto.trim() || null` en lugar de `concepto.trim()`.
- El orden y resto de campos no cambian; el concepto simplemente deja de ser obligatorio.

### 4. Fila en el dropdown (`src/modules/movements/components/MovementRow.tsx`)

Punto central del cambio. Hoy la línea principal de la fila es `{mov.concepto}`.

Cuando `concepto` está vacío o `null`, en el lugar del título se muestra un **guión `—` en gris atenuado** (`text-text-muted`, sin `font-medium text-white`). El resto del layout no cambia: chip de plataforma debajo, monto a la derecha, fecha pequeña abajo a la derecha, botón editar.

```
●─ Carrefour                -$45.000
│  Mercado Pago
│
●─ —                        -$33.000      ← guión gris, neutro
   Mercado Pago                29 may
```

Ventaja de este enfoque: el monto y la fecha quedan **exactamente en la misma posición** que en las filas con concepto, manteniendo la alineación consistente dentro del grupo. El guión es la convención típica de tablas/apps de finanzas para "sin valor, a propósito" y no connota un olvido.

## Decisiones

- **Guión `—` atenuado** elegido sobre "Sin concepto" (suena a error) y sobre punto medio `·` (demasiado sutil), y sobre promover la fecha al título (rompería levemente dónde aparece la fecha entre filas).
- **No** se agrega tratamiento especial para filas sin concepto **y** sin plataforma. Quedan con guión + monto + fecha, lo cual es aceptable y consistente. Evitar casos especiales (YAGNI).
- Se persiste `null` (no string vacío) para tener una única representación de "sin concepto".

## Archivos afectados

| Archivo                                             | Cambio                                               |
| --------------------------------------------------- | ---------------------------------------------------- |
| `api/prisma/schema.prisma`                          | `concepto` → nullable                                |
| `api/src/routes/movimientos.ts`                     | Zod opcional/nullable + normalizar `''` → `null`     |
| `src/modules/movements/services/getMovimientos.ts`  | tipo `concepto: string \| null`                      |
| `src/modules/movements/services/postMovimiento.ts`  | `concepto` opcional                                  |
| `src/modules/movements/services/putMovimiento.ts`   | `concepto` opcional                                  |
| `src/modules/movements/components/MovementForm.tsx` | quitar validación, label "(opcional)", enviar `null` |
| `src/modules/movements/components/MovementRow.tsx`  | fallback guión `—` atenuado                          |
