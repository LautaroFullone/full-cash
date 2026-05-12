import { useState } from 'react';
import { Trash2, Inbox } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Movimiento, TipoMovimiento } from '@/types';

interface MovementListProps {
  movimientos: Movimiento[];
  onDelete: (id: string) => Promise<void>;
}

type FilterType = 'TODOS' | TipoMovimiento;

export function MovementList({ movimientos, onDelete }: MovementListProps) {
  const [filter, setFilter] = useState<FilterType>('TODOS');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = filter === 'TODOS' ? movimientos : movimientos.filter(m => m.tipo === filter);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este movimiento?')) return;
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const filters: { label: string; value: FilterType }[] = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Ingresos', value: 'INGRESO' },
    { label: 'Gastos', value: 'EGRESO' },
  ];

  return (
    <div className="card animate-slide-up" style={{ padding: '20px', animationDelay: '0.4s', animationFillMode: 'backwards' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Todos los movimientos</h3>
          <span style={{
            fontSize: '11px', fontWeight: 700, background: 'var(--color-accent)', color: 'var(--color-background)',
            borderRadius: 'var(--radius-full)', padding: '2px 8px', minWidth: '20px', textAlign: 'center',
          }}>
            {filtered.length}
          </span>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '2px', background: 'var(--color-background)', borderRadius: 'var(--radius-full)', padding: '3px' }}>
          {filters.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)} style={{
              padding: '5px 12px', borderRadius: 'var(--radius-full)', border: 'none', fontSize: '12px', fontWeight: 500,
              fontFamily: 'var(--font-body)', cursor: 'pointer',
              background: filter === f.value ? 'var(--color-surface-elevated)' : 'transparent',
              color: filter === f.value ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              transition: 'all 0.15s ease',
            }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Inbox size={40} color="var(--color-text-muted)" style={{ marginBottom: '12px', opacity: 0.5 }} />
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>No hay movimientos</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {filtered.map(mov => (
            <div key={mov.id} style={{
              display: 'flex', alignItems: 'center', padding: '12px 8px', gap: '12px',
              borderRadius: 'var(--radius-md)', transition: 'background 0.15s ease',
              opacity: deletingId === mov.id ? 0.4 : 1,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              {/* Category icon */}
              <div style={{
                width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', flexShrink: 0,
                background: mov.tipo === 'INGRESO' ? 'rgba(229,255,166,0.1)' : 'rgba(255,75,90,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: mov.tipo === 'INGRESO' ? 'var(--color-accent)' : 'var(--color-danger)',
              }}>
                <CategoryIcon categoryName={mov.categoria?.nombre || ''} iconName={mov.categoria?.icono} size={18} />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {mov.concepto}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
                  {mov.categoria?.nombre} · {format(new Date(mov.fecha), 'd MMM', { locale: es })}
                  {mov.plataforma && <> · {mov.plataforma.nombre}</>}
                </p>
              </div>

              {/* Amount */}
              <span style={{
                fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 700, whiteSpace: 'nowrap',
                color: mov.tipo === 'INGRESO' ? 'var(--color-accent)' : 'var(--color-danger)',
              }}>
                {mov.tipo === 'INGRESO' ? '+' : '-'}{formatCurrency(mov.monto)}
              </span>

              {/* Delete */}
              <button onClick={() => handleDelete(mov.id)} style={{
                width: '28px', height: '28px', borderRadius: 'var(--radius-sm)', border: 'none',
                background: 'transparent', color: 'var(--color-text-muted)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                opacity: 0.4, transition: 'opacity 0.15s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '0.4'; }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
