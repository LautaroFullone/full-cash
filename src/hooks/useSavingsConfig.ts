import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Configuracion } from '@/types';

export function useSavingsConfig() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['configuracion'],
    queryFn: () => api.getConfiguracion() as Promise<Configuracion>,
  });

  const updateMutation = useMutation({
    mutationFn: (porcentajeAhorro: number) =>
      api.updateConfiguracion({ porcentajeAhorro }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['configuracion'] }),
  });

  return {
    config: query.data ?? null,
    loading: query.isLoading,
    updatePorcentaje: async (value: number): Promise<void> => { await updateMutation.mutateAsync(value); },
  };
}
