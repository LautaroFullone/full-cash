import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Movimiento, ResumenMensual } from '@/types';

export function useMovements(mes: number, anio: number) {
  const qc = useQueryClient();
  const keys = {
    list: ['movimientos', mes, anio] as const,
    resumen: ['resumen', mes, anio] as const,
  };

  const movimientosQuery = useQuery({
    queryKey: keys.list,
    queryFn: () => api.getMovimientos(mes, anio) as Promise<Movimiento[]>,
  });

  const resumenQuery = useQuery({
    queryKey: keys.resumen,
    queryFn: () => api.getResumen(mes, anio) as Promise<ResumenMensual>,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['movimientos', mes, anio] });
    qc.invalidateQueries({ queryKey: ['resumen', mes, anio] });
  };

  const createMovimiento = useMutation({
    mutationFn: (data: Record<string, unknown>) => api.createMovimiento(data),
    onSuccess: invalidate,
  });

  const deleteMovimiento = useMutation({
    mutationFn: (id: string) => api.deleteMovimiento(id),
    onSuccess: invalidate,
  });

  const updateMovimiento = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      api.updateMovimiento(id, data),
    onSuccess: invalidate,
  });

  return {
    movimientos: movimientosQuery.data ?? [],
    resumen: resumenQuery.data ?? null,
    loading: movimientosQuery.isLoading || resumenQuery.isLoading,
    error: movimientosQuery.error?.message ?? resumenQuery.error?.message ?? null,
    createMovimiento: async (data: Record<string, unknown>): Promise<void> => { await createMovimiento.mutateAsync(data); },
    deleteMovimiento: async (id: string): Promise<void> => { await deleteMovimiento.mutateAsync(id); },
    updateMovimiento: async (id: string, data: Record<string, unknown>): Promise<void> => { await updateMovimiento.mutateAsync({ id, data }); },
  };
}
