import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface SummaryCardsProps {
  totalIngresos: number;
  totalEgresos: number;
}

export function SummaryCards({ totalIngresos, totalEgresos }: SummaryCardsProps) {
  return (
    <div
      className="animate-slide-up"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        animationDelay: '0.1s',
        animationFillMode: 'backwards',
      }}
    >
      {/* Ingresos */}
      <div
        className="card"
        style={{
          padding: '20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(229,255,166,0.08)',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(229,255,166,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUp size={16} color="var(--color-accent)" />
          </div>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Ingresos
          </span>
        </div>
        <p
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--color-accent)',
            letterSpacing: '-0.5px',
          }}
        >
          {formatCurrency(totalIngresos)}
        </p>
      </div>

      {/* Egresos */}
      <div
        className="card"
        style={{
          padding: '20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(255,75,90,0.08)',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255,75,90,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingDown size={16} color="var(--color-danger)" />
          </div>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Egresos
          </span>
        </div>
        <p
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--color-danger)',
            letterSpacing: '-0.5px',
          }}
        >
          -{formatCurrency(totalEgresos)}
        </p>
      </div>
    </div>
  );
}
