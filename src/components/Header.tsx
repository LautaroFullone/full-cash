import { ChevronLeft, ChevronRight, Wallet, Tags } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface HeaderProps {
  anio: number;
  monthName: string;
  saldo: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onOpenCategories: () => void;
}

export function Header({ anio, monthName, saldo, onPrevMonth, onNextMonth, onOpenCategories }: HeaderProps) {
  const isPositive = saldo >= 0;

  return (
    <header className="animate-fade-in" style={{ padding: '24px 0 16px' }}>
      {/* Logo + Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dim))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Wallet size={22} color="#003a34" strokeWidth={2.2} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Full Cash
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>
              Finanzas personales
            </p>
          </div>
        </div>

        {/* Right side: categories button + month selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onOpenCategories}
          title="Gestionar categorías"
          style={{
            width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border-strong)', background: 'transparent',
            color: 'var(--color-text-muted)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border-strong)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
        >
          <Tags size={16} />
        </button>

        {/* Month Selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 6px',
          }}
        >
          <button
            onClick={onPrevMonth}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              background: 'var(--color-background)',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            aria-label="Mes anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'capitalize',
              minWidth: '100px',
              textAlign: 'center',
              color: 'var(--color-text-primary)',
            }}
          >
            {monthName} {anio}
          </span>
          <button
            onClick={onNextMonth}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              background: 'var(--color-background)',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            aria-label="Mes siguiente"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        </div>
      </div>

      {/* Saldo General */}
      <div
        className="card"
        style={{
          padding: '24px 28px',
          background: `linear-gradient(135deg, var(--color-surface), ${isPositive ? 'rgba(229,255,166,0.05)' : 'rgba(255,75,90,0.05)'})`,
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Saldo del mes
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '36px',
            fontWeight: 800,
            letterSpacing: '-1px',
            color: isPositive ? 'var(--color-accent)' : 'var(--color-danger)',
            transition: 'color 0.3s ease',
          }}
        >
          {isPositive ? '+' : ''}{formatCurrency(saldo)}
        </h2>
      </div>
    </header>
  );
}
