import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Categoria } from '@/types';

export function useCategories() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['categorias'],
    queryFn: () => api.getCategorias() as Promise<Categoria[]>,
    staleTime: 5 * 60_000,
  });

  const createCategoria = useMutation({
    mutationFn: (data: { nombre: string; tipo: 'INGRESO' | 'EGRESO'; icono: string }) =>
      api.createCategoria(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categorias'] }),
  });

  const updateCategoria = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { nombre?: string; icono?: string } }) =>
      api.updateCategoria(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categorias'] }),
  });

  const deleteCategoria = useMutation({
    mutationFn: (id: string) => api.deleteCategoria(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categorias'] }),
  });

  return {
    categorias: query.data ?? [],
    loading: query.isLoading,
    createCategoria: async (data: { nombre: string; tipo: 'INGRESO' | 'EGRESO'; icono: string }): Promise<void> => {
      await createCategoria.mutateAsync(data);
    },
    updateCategoria: async (id: string, data: { nombre?: string; icono?: string }): Promise<void> => {
      await updateCategoria.mutateAsync({ id, data });
    },
    deleteCategoria: async (id: string): Promise<void> => {
      await deleteCategoria.mutateAsync(id);
    },
  };
}
