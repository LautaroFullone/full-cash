import { fetchAPI } from '@/lib/fetchAPI'
import type { Categoria } from '@/models/categoria'

export const getCategorias = () =>
   fetchAPI<Categoria[]>('/categorias')
