import { Header } from '@/components/Header';
import { SummaryCards } from '@/components/SummaryCards';
import { SavingsBar } from '@/components/SavingsBar';
import { CategoryChart } from '@/components/CategoryChart';
import { MovementForm } from '@/components/MovementForm';
import { MovementList } from '@/components/MovementList';
import { useMonthSelector } from '@/hooks/useMonthSelector';
import { useMovements } from '@/hooks/useMovements';
import { useCategories } from '@/hooks/useCategories';
import { usePlatforms } from '@/hooks/usePlatforms';
import { useSavingsConfig } from '@/hooks/useSavingsConfig';
import { Loader2 } from 'lucide-react';

function App() {
  const { mes, anio, monthName, goToPrevMonth, goToNextMonth } = useMonthSelector();
  const { movimientos, resumen, loading, createMovimiento, deleteMovimiento } = useMovements(mes, anio);
  const { categorias } = useCategories();
  const { plataformas } = usePlatforms();
  const { config, updatePorcentaje } = useSavingsConfig();

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '0 16px', paddingBottom: '100px' }}>
      <Header
        anio={anio}
        monthName={monthName}
        saldo={resumen?.saldo ?? 0}
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
      />

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <Loader2 size={32} color="var(--color-accent)" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <main style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SummaryCards
            totalIngresos={resumen?.totalIngresos ?? 0}
            totalEgresos={resumen?.totalEgresos ?? 0}
          />

          {config && (
            <SavingsBar
              totalIngresos={resumen?.totalIngresos ?? 0}
              totalEgresos={resumen?.totalEgresos ?? 0}
              porcentajeAhorro={config.porcentajeAhorro}
              onUpdatePorcentaje={updatePorcentaje}
            />
          )}

          <CategoryChart distribucion={resumen?.distribucionCategorias ?? []} />

          <MovementList movimientos={movimientos} onDelete={deleteMovimiento} />
        </main>
      )}

      <MovementForm
        categorias={categorias}
        plataformas={plataformas}
        onSubmit={createMovimiento}
      />
    </div>
  );
}

export default App;
