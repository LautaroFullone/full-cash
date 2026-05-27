import type { Categoria, TipoMovimiento } from '@/models/categoria'
import { fetchAPI } from '@/lib/fetchAPI'

export interface PutCategoriaBody {
   nombre?: string
   icono?: string
   tipo?: TipoMovimiento
}

export function putCategoria(id: string, body: PutCategoriaBody) {
   return fetchAPI<Categoria>(`/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
   })
}
