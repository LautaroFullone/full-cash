import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Plataforma } from '@/types';

export function usePlatforms() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['plataformas'],
    queryFn: () => api.getPlataformas() as Promise<Plataforma[]>,
    staleTime: 5 * 60_000,
  });

  const createPlataforma = useMutation({
    mutationFn: (nombre: string) => api.createPlataforma({ nombre }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['plataformas'] }),
  });

  const deletePlataforma = useMutation({
    mutationFn: (id: string) => api.deletePlataforma(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['plataformas'] }),
  });

  return {
    plataformas: query.data ?? [],
    loading: query.isLoading,
    createPlataforma: (nombre: string) => createPlataforma.mutateAsync(nombre),
    deletePlataforma: (id: string) => deletePlataforma.mutateAsync(id),
  };
}
