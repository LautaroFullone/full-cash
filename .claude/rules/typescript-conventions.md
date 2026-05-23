# Convenciones de TypeScript

## Funciones

Siempre usar arrow functions con `const`. Nunca usar la keyword `function`.

```ts
// ✅ correcto
const formatAmount = (amount: number) => {
  return amount * 100
}

// ❌ incorrecto
function formatAmount(amount: number) {
  return amount * 100
}
```

## Componentes

Usar `const` + `React.FC`. Si recibe props, tipar con `React.FC<NombreProps>`.

```ts
// ✅ sin props
const Button: React.FC = () => {
  return <button>Click</button>
}

// ✅ con props
interface ButtonProps {
  label: string
  onClick: () => void
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>
}

// ❌ incorrecto
function Button({ label }: ButtonProps) {
  return <button>{label}</button>
}
```

## Tipos de retorno

No anotar el tipo de retorno explícitamente. Dejar que TypeScript lo infiera.

```ts
// ✅ correcto
const getUser = (id: string) => {
  return fetchAPI<User>(`/users/${id}`)
}

// ❌ incorrecto
const getUser = (id: string): Promise<User> => {
  return fetchAPI<User>(`/users/${id}`)
}
```
