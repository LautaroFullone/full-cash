import { fetchAPI } from '@/lib/fetchAPI'
import type { Categoria } from '@/models/categoria'

export interface PutCategoriaBody {
   nombre?: string
   icono?: string
}

export function putCategoria(id: string, body: PutCategoriaBody): Promise<Categoria> {
   return fetchAPI(`/categorias/${id}`, { method: 'PUT', body: JSON.stringify(body) })
}
