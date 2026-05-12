import { useState } from 'react';
import { PiggyBank, Settings2, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface SavingsBarProps {
  totalIngresos: number;
  totalEgresos: number;
  porcentajeAhorro: number;
  onUpdatePorcentaje: (value: number) => Promise<void>;
}

export function SavingsBar({
  totalIngresos,
  totalEgresos,
  porcentajeAhorro,
  onUpdatePorcentaje,
}: SavingsBarProps) {
  const [editing, setEditing] = useState(false);
  const [tempPorcentaje, setTempPorcentaje] = useState(Math.round(porcentajeAhorro * 100));

  const montoRecomendado = totalIngresos * porcentajeAhorro;
  const ahorroReal = totalIngresos - totalEgresos;
  const progreso = montoRecomendado > 0 ? Math.min((ahorroReal / montoRecomendado) * 100, 100) : 0;

  const getProgressColor = () => {
    if (progreso >= 80) return 'var(--color-accent)';
    if (progreso >= 50) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  const handleSave = async () => {
    await onUpdatePorcentaje(tempPorcentaje / 100);
    setEditing(false);
  };

  return (
    <div
      className="card animate-slide-up"
      style={{
        padding: '20px',
        animationDelay: '0.2s',
        animationFillMode: 'backwards',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255,198,63,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PiggyBank size={16} color="var(--color-warning)" />
          </div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Meta de ahorro</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>
              {Math.round(porcentajeAhorro * 100)}% del ingreso
            </p>
          </div>
        </div>

        {editing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="number"
              min={1}
              max={100}
              value={tempPorcentaje}
              onChange={(e) => setTempPorcentaje(Number(e.target.value))}
              style={{
                width: '60px',
                padding: '6px 8px',
                fontSize: '13px',
                textAlign: 'center',
                borderRadius: 'var(--radius-sm)',
              }}
            />
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>%</span>
            <button
              onClick={handleSave}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'var(--color-accent)',
                color: 'var(--color-background)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Check size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setTempPorcentaje(Math.round(porcentajeAhorro * 100));
              setEditing(true);
            }}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-strong)',
              background: 'transparent',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Settings2 size={14} />
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: '8px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255,255,255,0.06)',
          overflow: 'hidden',
          marginBottom: '12px',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.max(progreso, 0)}%`,
            borderRadius: 'var(--radius-full)',
            background: getProgressColor(),
            transition: 'width 0.6s ease, background 0.3s ease',
          }}
        />
      </div>

      {/* Values */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
        <span style={{ color: 'var(--color-text-muted)' }}>
          Ahorro real: <span style={{ color: ahorroReal >= 0 ? 'var(--color-accent)' : 'var(--color-danger)', fontWeight: 600 }}>
            {formatCurrency(ahorroReal)}
          </span>
        </span>
        <span style={{ color: 'var(--color-text-muted)' }}>
          Meta: <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            {formatCurrency(montoRecomendado)}
          </span>
        </span>
      </div>
    </div>
  );
}
