---
name: react-query-hooks
description: Cómo trabajar con react-query en este proyecto. Disparar al crear, refactorizar o revisar código que use `useQuery` o `useMutation`, al envolver services en hooks, o al ver llamadas a la API hechas directamente desde componentes o páginas sin pasar por react-query.
---

# Cómo trabajar con React Query

## Regla cero — React Query siempre dentro de un hook

**Nunca usar `useQuery` o `useMutation` directamente en un componente, página o handler.** Toda interacción con react-query vive dentro de un hook custom. Los componentes consumen el hook y usan lo que retorna.

Por qué: el componente no debería saber de cache keys, mutations, ni de la diferencia entre `data?.users` y `users`. Solo pide lo que necesita. Esto mantiene los componentes enfocados en UI y los hooks como única fuente de verdad de las operaciones de datos.

## Agrupación: por relación, no por dominio

Las queries y mutations **relacionadas entre sí** viven en el mismo hook. "Relacionadas" significa: comparten cache, comparten modelo, o se usan típicamente juntas en una misma pantalla/flujo.

Un mismo hook puede contener varias queries y mutations, y también puede tener lógica adicional que no sea de react-query. El hook se llama según la función que cumple, no según el endpoint.

```ts
// ✅ relacionadas — listar, crear, actualizar y borrar usuarios viven juntas
export const useUsers = () => { ... }

// ❌ un hook por endpoint
export const useFetchUsers = () => { ... }
export const useCreateUser = () => { ... }
```

## Forma del hook

```ts
import { getUsers, postUser, putUser, deleteUser } from '@/services/users.service'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queriesKeys } from '@/lib/react-query'
import { toast } from 'sonner'

export const useUsers = () => {
   const queryClient = useQueryClient()

   const { data, isLoading, isError } = useQuery({
      queryKey: [queriesKeys.FETCH_USERS],
      queryFn: getUsers,
      staleTime: 5 * 60_000,
      retry: false,
   })

   const { mutateAsync: createUser, isPending: isCreating } = useMutation({
      mutationFn: postUser,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [queriesKeys.FETCH_USERS] })
      },
      onError: (error) => {
         toast.error(error.message ?? 'No se pudo crear el usuario')
      },
   })

   const { mutateAsync: updateUser, isPending: isUpdating } = useMutation({
      mutationFn: putUser,
      onSuccess: ({ user }) => {
         queryClient.setQueryData([queriesKeys.FETCH_USER, user.id], { user })
         queryClient.invalidateQueries({ queryKey: [queriesKeys.FETCH_USERS] })
      },
      onError: (error) => {
         toast.error(error.message ?? 'No se pudo actualizar el usuario')
      },
   })

   const { mutateAsync: removeUser, isPending: isDeleting } = useMutation({
      mutationFn: deleteUser,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [queriesKeys.FETCH_USERS] })
      },
      onError: (error) => {
         toast.error(error.message ?? 'No se pudo eliminar el usuario')
      },
   })

   return {
      users: data?.users ?? [],
      isLoading,
      isError,
      createUser,
      isCreating,
      updateUser,
      isUpdating,
      deleteUser: removeUser,
      isDeleting,
   }
}
```

**Destructurar inline en la query, no guardarla en una constante.** El patrón:

```ts
// ✅ destructurar lo que se va a usar
const { data, isLoading, isError } = useQuery({ ... })

// ❌ guardar todo en una constante y acceder por punto
const usersQuery = useQuery({ ... })
// ... después: usersQuery.data, usersQuery.isLoading, etc.
```

Cuando hay **más de una query en el mismo hook** y los nombres chocarían, renombrar al destructurar con el nombre semántico:

```ts
const { data: movimientos, isLoading: isLoadingMovimientos } = useQuery({ ... })
const { data: resumen, isLoading: isLoadingResumen } = useQuery({ ... })
```

## Mutations: destructurar inline con nombre representativo

Al definir una `useMutation`, destructurar `mutateAsync` en el mismo statement renombrándolo a algo que describa la **acción**, no el endpoint:

```ts
const { mutateAsync: createUser, isPending: isCreating } = useMutation({
   mutationFn: postUser,
   onSuccess: () => { ... },
   onError: (error) => { ... },
})
```

El consumidor lo usa con `await`:

```ts
await createUser({ nombre, email, password })
```

**Nunca:**

```ts
// ❌ guardar la mutation en una variable y exponerla con wrapper
const userMutation = useMutation({ mutationFn: createUser, ... })
const createUser = (data) => userMutation.mutateAsync(data)

// ❌ flecha inline en el return
return { createUser: (data) => userMutation.mutateAsync(data) }
```

`mutateAsync` ya es función pública. Cualquier envoltura agrega indirección y duplica firmas.

### Campos útiles de `useMutation`

Destructurar lo que el consumidor vaya a necesitar:

| Campo         | Para qué                                                                           |
| ------------- | ---------------------------------------------------------------------------------- |
| `mutateAsync` | La acción. Renombrar a `createUser`, `loginUser`, etc. Usar con `await`.           |
| `isPending`   | `true` durante la mutación. Renombrar a `isCreating`, `isUpdating`, `isDeleting`.  |
| `isError`     | `true` si la última falló. Útil para mostrar mensaje inline.                       |
| `error`       | El error. Si la UI muestra el mensaje sin toast.                                   |
| `data`        | La última respuesta. Si el consumidor necesita el resultado después del éxito.     |
| `variables`   | Los args con que se llamó. Útil para `deletingId = isDeleting ? variables : null`. |
| `reset`       | Limpiar el estado de la mutación.                                                  |

### Services con un solo argumento

`mutationFn` siempre recibe el service **como referencia directa** (`mutationFn: putUser`). Para que eso funcione, el service tiene que aceptar **un único argumento** — un objeto si necesita múltiples campos. No rearmes la firma adentro del hook.

```ts
// ✅ service diseñado con un solo argumento
export interface UpdateUserParams {
   id: string
   data: PutUserBody
}
export const putUser = ({ id, data }: UpdateUserParams) =>
   fetchAPI<{ user: User }>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
   })

// hook — el service va por referencia, sin envoltura
const { mutateAsync: updateUser, isPending: isUpdating } = useMutation({
   mutationFn: putUser,
   onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [queriesKeys.FETCH_USERS] }),
   onError: (error) => toast.error(error.message ?? 'No se pudo actualizar'),
})

// consumidor — pone los datos al momento de llamar
await updateUser({ id: user.id, data: { nombre: 'Nuevo' } })
```

Exportar el tipo del argumento (`UpdateUserParams`) para que los consumidores tipen sus props (ej. `onUpdate: (args: UpdateUserParams) => Promise<void>`).

**Nunca rearmar la firma del service adentro de mutationFn:**

```ts
// ❌ wrapper que solo redefine los parámetros sin agregar nada
mutationFn: ({ id, data }: UpdateUserParams) => putUser(id, data)

// ❌ idem — el service ya recibe ese tipo
mutationFn: (data: PostUserBody) => postUser(data)
```

Si un service hoy recibe múltiples args posicionales (`putUser(id, body)`), refactorizarlo al patrón de un solo argumento **antes** de envolverlo con react-query.

La única excepción válida a `mutationFn: serviceName` es el [Patrón A de Zustand](#patrón-a--usar-datos-del-store-en-mutationfn): cuando el hook necesita inyectar datos del store que el consumidor no tiene. Ahí el wrapper suma valor real (mete contexto), no rearma la firma.

### El hook no importa tipos del service salvo que sea necesario

Cuando `mutationFn: serviceName` se usa directo, TypeScript infiere todo: el tipo de entrada de `mutateAsync`, el tipo de `data` en `onSuccess`, el tipo de `variables`. **No importes los `PostXBody`, `PutXBody`, `UpdateXParams` ni similares al hook.** Esos tipos viven en el service y los consumen las páginas/componentes que llaman al hook, no el hook mismo.

```ts
// ✅ el hook no importa tipos del service — TS los infiere
import { postUser, putUser, deleteUser } from '@/services/users.service'

const { mutateAsync: createUser } = useMutation({
   mutationFn: postUser,
   ...
})

// ❌ import innecesario — el tipo solo aparece para repetir lo que ya infiere TS
import type { PostUserBody, UpdateUserParams } from '@/services/users.service'
import { postUser, putUser } from '@/services/users.service'

const { mutateAsync: createUser } = useMutation({
   mutationFn: (body: PostUserBody) => postUser(body),
   ...
})
```

La única razón para que el hook importe un tipo del service es si **realmente** lo necesita en el cuerpo: por ejemplo, para tipar el wrapper del [Patrón A de Zustand](#patrón-a--usar-datos-del-store-en-mutationfn) donde se transforma o se completa el payload antes de llamar al service.

## Integración con Zustand

React Query y Zustand son complementarios y se cruzan dentro del hook: React Query maneja el estado del servidor (lo que vive en la API), Zustand maneja el estado del cliente (sesión actual, filtros UI, selección activa). El hook es el lugar natural donde uno alimenta al otro.

### Patrón A — usar datos del store en `mutationFn`

A veces el componente no tiene todos los datos que el service necesita (el `userId` actual, el mes seleccionado, los filtros activos). En vez de pedírselos al componente, el hook los lee del store y los inyecta dentro de `mutationFn`:

```ts
export const useMovimientos = () => {
   const { mes, anio } = useFiltrosStore()
   const queryClient = useQueryClient()

   const { mutateAsync: createMovimiento, isPending: isCreating } = useMutation({
      mutationFn: (data: PostMovimientoBody) => postMovimiento({ ...data, mes, anio }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: [queriesKeys.FETCH_MOVIMIENTOS] })
      },
      onError: (error) => {
         toast.error(error.message ?? 'No se pudo crear el movimiento')
      },
   })

   return { createMovimiento, isCreating }
}
```

El componente llama `createMovimiento(data)` sin preocuparse de mes/año; el hook se encarga de inyectarlos.

> Acá el `import` del tipo `PostMovimientoBody` **sí es necesario** y no contradice la regla de no importar tipos del service: el wrapper transforma el payload antes de pasarlo y necesita declarar qué shape recibe del consumidor. Esa es la excepción acotada al [Patrón A](#patrón-a--usar-datos-del-store-en-mutationfn).

### Patrón B — setear el store en `onSuccess`

Cuando el resultado de una mutation debe propagarse al estado global, el `onSuccess` es el lugar correcto. Centraliza la regla "cuando esto se completa, el store queda así" — si tres componentes disparan la misma mutation, ninguno tiene que recordar actualizar el store por su lado.

```ts
export const useAuth = () => {
   const authStoreActions = useAuthStore((s) => s.actions)

   const { mutateAsync: loginUser, isPending: isLoginPending } = useMutation({
      mutationFn: postLogin,
      onSuccess: ({ user, token }) => {
         localStorage.setItem('token', token)
         authStoreActions.setUser(user)
      },
      onError: (error) => {
         toast.error(error.message ?? 'No se pudo iniciar sesión')
      },
   })

   const { mutateAsync: logoutUser, isPending: isLogoutPending } = useMutation({
      mutationFn: postLogout,
      onSuccess: () => {
         localStorage.removeItem('token')
         authStoreActions.resetStore()
      },
      onError: (error) => {
         toast.error(error.message ?? 'No se pudo cerrar sesión')
      },
   })

   return { loginUser, isLoginPending, logoutUser, isLogoutPending }
}
```

El mismo principio vale para queries: si una query tiene que reflejar su `data` en el store, hacerlo dentro del hook (vía `useEffect` sobre `data`, o disparando la primera carga con `queryClient.fetchQuery` y seteando el store en el `.then`), nunca desde el componente.

## Toast en `onError`

Toda mutación incluye `onError` con un toast informativo. El usuario debe enterarse cuando algo falla.

```ts
onError: (error) => {
   toast.error(error.message ?? 'Mensaje de fallback acorde a la acción')
}
```

Si el proyecto tiene un helper tipo `extractErrorData` para normalizar errores de la API, usarlo:

```ts
onError: (error) => {
   const { message } = extractErrorData(error)
   toast.error(message, { id: `error-${queriesKeys.CREATE_USER}` })
}
```

El `id` evita toasts duplicados cuando el usuario reintenta.

## Query keys centralizadas

Todas las keys viven en `lib/react-query.ts` como constantes:

```ts
export const queriesKeys = {
   FETCH_USERS: 'users',
   FETCH_USER: 'user',
   CREATE_USER: 'create_user',
   UPDATE_USER: 'update_user',
   DELETE_USER: 'delete_user',
   // ...
} as const
```

En el hook se usan dentro del array: `[queriesKeys.FETCH_USERS]`, `[queriesKeys.FETCH_USER, userId]`.

Esto evita typos, permite buscar referencias, y da un inventario explícito de las queries del proyecto.

## Cache: `invalidateQueries` vs `setQueryData`

Esta decisión es la que más impacta la performance percibida. **No extraer helpers de invalidación** — el `queryClient.invalidateQueries(...)` va directo en cada `onSuccess`, así queda explícito qué afecta cada mutación.

### `invalidateQueries` — default

Cuando el response **no trae** el objeto actualizado, o la mutación afecta datos derivados (listas, agregados, conteos):

```ts
onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: [queriesKeys.FETCH_USERS] })
}
```

Si afecta varias queries, listarlas todas:

```ts
onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: [queriesKeys.FETCH_MOVIMIENTOS] })
   queryClient.invalidateQueries({ queryKey: [queriesKeys.FETCH_RESUMEN] })
}
```

### `setQueryData` — cuando el response trae el dato

Cuando la mutation devuelve el objeto actualizado completo, actualizar la cache directamente para evitar refetch:

```ts
onSuccess: ({ user }) => {
   queryClient.setQueryData([queriesKeys.FETCH_USER, user.id], { user })
   queryClient.invalidateQueries({ queryKey: [queriesKeys.FETCH_USERS] })
}
```

Combinar ambos es normal: `setQueryData` para el detalle que sí tenés, `invalidateQueries` para listas o agregados que no querés reconstruir manualmente.

Eliminar items con `setQueryData`:

```ts
onSuccess: ({ post }) => {
   queryClient.setQueryData(
      [queriesKeys.FETCH_POSTS],
      (old: Awaited<ReturnType<typeof getPosts>> | undefined) => {
         if (!old) return old
         return { ...old, posts: old.posts.filter((p) => p.id !== post.id) }
      }
   )
}
```

## `staleTime` — guía rápida

`staleTime` define cuánto tiempo react-query considera "fresca" la data antes de refetchear. Default sugerido por tipo de query:

- **`5 * 60_000` (5 min)** — listas estables que rara vez cambian entre vistas (categorías globales, plataformas, posts publicados).
- **`2 * 60_000` (2 min)** — detalles que pueden mutar más seguido (un post puntual, el detalle de un usuario, configuración).
- **`0`** — datos que deben revalidarse cada vez que la query se monta (resúmenes de dashboard, contadores en vivo).
- **Omitir** — toma el default global del `QueryClientProvider` (en este proyecto: 30s). Útil cuando no hay un criterio especial.

No copiar valores sin pensar — elegir el que refleja qué tan rápido cambia ese recurso en la realidad.

## Queries condicionales — `enabled`

Si el parámetro puede ser `undefined`:

```ts
export const useUser = (userId: string | undefined) => {
   const { data, isLoading, isError } = useQuery({
      queryKey: [queriesKeys.FETCH_USER, userId],
      queryFn: () => getUser(userId!),
      enabled: !!userId,
      staleTime: 2 * 60_000,
   })

   return {
      user: data?.user,
      isLoading,
      isError,
   }
}
```

## Llamadas imperativas — `fetchQuery`

Para bootstrap, prefetch, o cualquier flujo que necesita una **promesa** y no una suscripción reactiva, usar `queryClient.fetchQuery` en vez de `useQuery + useEffect`:

```ts
const init = () => {
   const token = localStorage.getItem('token')
   if (!token) return

   queryClient
      .fetchQuery({ queryKey: [queriesKeys.VERIFY_AUTH], queryFn: getMe })
      .then((user) => authStoreActions.setUser(user))
      .catch(() => {
         localStorage.removeItem('token')
         authStoreActions.setUser(null)
      })
}
```

`fetchQuery` devuelve `Promise<TData>`, respeta `staleTime`, deduplica requests concurrentes, y deja la cache poblada para futuras `useQuery` con la misma key.

## Lo que el hook no debe hacer

- **No exponer la mutation entera** (`return { createMutation }`). Solo los campos que el consumidor necesita (renombrados con nombre semántico).
- **No mezclar operaciones no relacionadas** en el mismo hook. Si dos pantallas distintas usan dos sets de operaciones distintas, son dos hooks distintos.

## Lo que el hook sí puede hacer

- **Tocar `localStorage`** cuando es parte del flujo (persistir token al login, limpiarlo al logout).
- **Navegar** vía `useNavigate` u otro mecanismo del router si el flujo lo requiere (ej. mandar al login tras un logout).
- **Leer y escribir Zustand stores** según los patrones de [Integración con Zustand](#integración-con-zustand).
- **Tener lógica adicional no-react-query** (estado local, helpers del flujo, derivaciones) — el hook se llama por la funcionalidad que cumple, no es exclusivo de queries/mutations.

## Para casos no cubiertos acá

Esta skill cubre el ~80% de lo que se necesita día a día: queries simples, mutations con cache management, integración con Zustand, llamadas imperativas. Para escenarios más avanzados — **optimistic updates** (`onMutate` + rollback), **`useSuspenseQuery`**, **infinite queries**, **estrategias de retry**, **`refetchOnWindowFocus`** custom — consultar la [documentación oficial de TanStack Query](https://tanstack.com/query/latest/docs). No improvisar; esos APIs tienen contratos sutiles que conviene leer antes de usar.
