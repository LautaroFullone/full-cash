import { fetchAPI } from '@/lib/fetchAPI'

export interface DeleteCategoriaResponse {
   success: boolean
   hidden: boolean
}

export const deleteCategoria = (id: string) =>
   fetchAPI<DeleteCategoriaResponse>(`/categorias/${id}`, { method: 'DELETE' })
