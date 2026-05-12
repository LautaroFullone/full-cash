import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Categoria } from '@/types';

export function useCategories() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['categorias'],
    queryFn: () => api.getCategorias() as Promise<Categoria[]>,
    staleTime: 5 * 60_000, // categorías cambian poco
  });

  const createCategoria = useMutation({
    mutationFn: (data: { nombre: string; tipo: 'INGRESO' | 'EGRESO'; icono: string }) =>
      api.createCategoria(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categorias'] }),
  });

  const deleteCategoria = useMutation({
    mutationFn: (id: string) => api.deleteCategoria(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categorias'] }),
  });

  return {
    categorias: query.data ?? [],
    loading: query.isLoading,
    createCategoria: (data: { nombre: string; tipo: 'INGRESO' | 'EGRESO'; icono: string }) =>
      createCategoria.mutateAsync(data),
    deleteCategoria: (id: string) => deleteCategoria.mutateAsync(id),
  };
}
