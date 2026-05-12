import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CATEGORY_COLORS } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CategoryChartProps {
  distribucion: {
    categoriaId: string;
    categoriaNombre: string;
    total: number;
    porcentaje: number;
  }[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: { categoriaNombre: string; total: number; porcentaje: number } }[] }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-md)', padding: '10px 14px', boxShadow: 'var(--shadow-elevated)' }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>{data.categoriaNombre}</p>
      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>{formatCurrency(data.total)} · {data.porcentaje.toFixed(1)}%</p>
    </div>
  );
}

export function CategoryChart({ distribucion }: CategoryChartProps) {
  if (!distribucion.length) {
    return (
      <div className="card animate-slide-up" style={{ padding: '32px 20px', textAlign: 'center', animationDelay: '0.3s', animationFillMode: 'backwards' }}>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>No hay gastos este mes para graficar</p>
      </div>
    );
  }

  const chartData = distribucion.map((item, i) => ({ ...item, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }));

  return (
    <div className="card animate-slide-up" style={{ padding: '20px', animationDelay: '0.3s', animationFillMode: 'backwards' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Distribución de gastos</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ width: '140px', height: '140px', flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="total" stroke="none" animationDuration={800}>
                {chartData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {chartData.map((item) => (
            <div key={item.categoriaId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                <span style={{ color: 'var(--color-text-secondary)' }}>{item.categoriaNombre}</span>
              </div>
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '12px' }}>{item.porcentaje.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
