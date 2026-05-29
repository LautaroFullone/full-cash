import { fetchAPI } from '@/lib/fetchAPI'
import type { Categoria, TipoMovimiento } from '@/models/categoria'

export interface PostCategoriaBody {
   nombre: string
   tipo: TipoMovimiento
   icono: string
}

export const postCategoria = (body: PostCategoriaBody) =>
   fetchAPI<Categoria>('/categorias', {
      method: 'POST',
      body: JSON.stringify(body),
   })
