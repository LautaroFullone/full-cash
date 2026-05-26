import { fetchAPI } from '@/lib/fetchAPI'

export interface DeleteCategoriaResponse {
   success: boolean
   hidden: boolean
}

export function deleteCategoria(id: string) {
   return fetchAPI<DeleteCategoriaResponse>(`/categorias/${id}`, { method: 'DELETE' })
}
