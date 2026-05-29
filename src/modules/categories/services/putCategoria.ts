import type { Categoria, TipoMovimiento } from '@/models/categoria'
import { fetchAPI } from '@/lib/fetchAPI'

export interface PutCategoriaBody {
   nombre?: string
   icono?: string
   tipo?: TipoMovimiento
}

export interface UpdateCategoriaArgs {
   id: string
   data: PutCategoriaBody
}

export const putCategoria = ({ id, data }: UpdateCategoriaArgs) =>
   fetchAPI<Categoria>(`/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
   })
