import { fetchAPI } from '@/lib/fetchAPI'

export interface DeleteCategoriaResponse {
  success: boolean
  hidden: boolean
}

export function deleteCategoria(id: string): Promise<DeleteCategoriaResponse> {
  return fetchAPI(`/categorias/${id}`, { method: 'DELETE' })
}
