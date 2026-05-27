# Estructura de Componentes

## Checklist — aplicar en cada componente

- [ ] Un componente por archivo (salvo excepciones explícitas abajo)
- [ ] `.map()` con lógica → extraer a componente propio
- [ ] Solo la interfaz de props inline; el resto a `models/`
- [ ] Skeleton propio → al final del mismo archivo
- [ ] Constantes estáticas → `utils/` del módulo

---

## Un componente por archivo

Cada componente React debe vivir en su propio archivo `.tsx`, nombrado igual que el componente (PascalCase).

```
modules/categories/
├── CategoryManager.tsx
└── components/
    ├── EditRow.tsx        ← no en CategoryManager.tsx
    ├── NewRow.tsx         ← no en CategoryManager.tsx
    └── EmojiPicker.tsx
```

## Excepción: helpers de display simples

Un sub-componente puede quedarse en el mismo archivo únicamente si cumple TODOS estos criterios:

- Menos de ~20 líneas de JSX
- Sin estado (`useState`, `useEffect`, ni otros hooks)
- Solo recibe props y retorna JSX (puramente visual)
- No tiene lógica de negocio ni callbacks complejos
- Solo se usa en ese único archivo

```tsx
// ✅ Puede quedarse — sin estado, puramente visual, solo se usa aquí
const FormLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
   <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
      {children}
   </label>
)

// ❌ Debe ir a su propio archivo — tiene estado propio
const EditRow: React.FC<EditRowProps> = ({ categoria, onSave, onCancel }) => {
   const [nombre, setNombre] = useState(categoria.nombre)
   const [saving, setSaving] = useState(false)
   // ...
}
```

## Helper simple duplicado → extraer

Si un helper simple aparece definido en más de un archivo, se extrae:

- Compartido solo dentro del mismo módulo → va a `components/` del módulo
- Compartido entre módulos distintos → va a `src/components/`

```
// FormLabel definido igual en MovementForm.tsx y EditMovementForm.tsx:
modules/movements/
└── components/
    ├── FormLabel.tsx      ← extraído porque estaba duplicado
    ├── MovementForm.tsx
    └── EditMovementForm.tsx
```

## Excepción: Skeleton propio de una page o componente

Un componente puede definir su propio skeleton dentro del mismo archivo. Este skeleton debe ir al final del archivo, después del componente principal.

```tsx
export const DashboardPage: React.FC = () => {
   if (isLoading) return <DashboardSkeleton />
   // ...
}

// ✅ Skeleton inline — excepción explícita, va al final del archivo
const DashboardSkeleton: React.FC = () => <div className="...">...</div>
```

## Listas mapeadas

Siempre que un `.map()` renderice algo con lógica (condicionales, variables locales, más de un elemento raíz, clases dinámicas), ese ítem debe ser un componente en su propio archivo.

```tsx
// ❌ Demasiada lógica inline para quedar en el map
{
   options.map((p) => {
      const isSelected = value === p.id
      return (
         <button
            onClick={() => handleSelect(p.id)}
            className={cn('...', isSelected ? 'text-accent' : 'text-text-secondary')}
         >
            {isSelected && <Check size={12} />}
            {p.name}
         </button>
      )
   })
}

// ✅ Extraer a su propio componente
{
   options.map((p) => (
      <PlatformOption
         key={p.id}
         platform={p}
         isSelected={value === p.id}
         onSelect={handleSelect}
      />
   ))
}
```

Puede quedarse inline solo si es trivial — un `<span>`, un `<li>` con texto plano, sin lógica ni condicionales.

## Tipos en archivos de componentes

El único tipo que puede estar definido dentro de un archivo de componente es la interfaz de sus props. Todo lo demás va a `models/`:

- Usado solo dentro del módulo → `modules/<dominio>/models/`
- Usado en más de un módulo → `src/models/`

```tsx
// ✅ Solo la interfaz de props — permitido inline
interface MovementRowProps {
   mov: Movimiento
   isLast: boolean
   onEditClick: (mov: Movimiento) => void
}

// ❌ Tipo de dominio — debe ir en models/
type Grupo = {
   categoriaId: string
   movimientos: Movimiento[]
}
// → modules/movements/models/grupo.ts
```

## Orden del contenido dentro de un componente

El cuerpo de un componente sigue este orden:

1. **Stores** — lecturas de Zustand (`useAuthStore`, etc.)
2. **State** — `useState` locales del componente
3. **Hooks** — (`useMovimientos`, `useQuery`, etc.)
4. **Effects** — `useEffect`, si los hay
5. **Funciones** — lógica propia del componente. Las que se llaman desde el JSX se nombran con prefijo `handle`
6. **Constantes derivadas** — variables calculadas a partir del estado/props, usadas solo en el retorno. Si una constante se necesita antes (como input de otro hook), va donde corresponda

```tsx
export const MovementForm: React.FC<MovementFormProps> = ({ onClose }) => {
   const { plataformas } = usePlatformStore()

   const [monto, setMonto] = useState<number | ''>('')
   const [fecha, setFecha] = useState(today())

   const { createMovimiento, isLoading } = useMovimientos()

   useEffect(() => {
      resetForm()
   }, [])

   const handleSubmit = async () => {
      await createMovimiento({ monto, fecha })
      onClose()
   }

   const isDisabled = monto === '' || isLoading

   return (...)
}
```

## Constantes estáticas de módulo

Las constantes estáticas definidas fuera de la función del componente (arrays de datos, mapas de configuración, etc.) van al `utils/` del propio módulo.

```tsx
// ❌ No en el mismo archivo del componente
const EMOJI_GROUPS = [...]

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => { ... }

// ✅ En modules/categories/utils/emojiGroups.ts
import { EMOJI_GROUPS } from '../utils/emojiGroups'
```

Si la constante se usa en más de un módulo, va a `src/utils/`.

## Ubicación de sub-componentes extraídos

Los componentes extraídos van en `components/` dentro del mismo módulo. Si no existe la carpeta, se crea.

```
modules/movements/
├── MovementList.tsx
└── components/
    ├── MovementRow.tsx
    └── CategoryGroupRow.tsx
```
