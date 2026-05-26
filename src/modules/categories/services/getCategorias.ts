import { fetchAPI } from '@/lib/fetchAPI'
import type { Categoria } from '@/models/categoria'

export function getCategorias() {
   return fetchAPI<Categoria[]>('/categorias')
}
