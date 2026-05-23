import { ChevronLeft, ChevronRight, Wallet, Tags, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface HeaderProps {
  anio: number;
  monthName: string;
  saldo: number;
  isAdmin?: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onOpenCategories: () => void;
  onOpenUsers?: () => void;
}

export function Header({ anio, monthName, saldo, isAdmin, onPrevMonth, onNextMonth, onOpenCategories, onOpenUsers }: HeaderProps) {
  const isPositive = saldo >= 0;

  return (
    <header className="animate-fade-in pt-6 pb-4">
      {/* Logo + Nav */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-[42px] h-[42px] rounded-md flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dim))' }}
          >
            <Wallet size={22} color="#003a34" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="font-heading text-xl font-black tracking-[-0.5px]">Full Cash</h1>
            <p className="text-xs text-text-muted">Finanzas personales</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Users button — admin only */}
          {isAdmin && onOpenUsers && (
            <button
              onClick={onOpenUsers}
              title="Gestionar usuarios"
              className="w-9 h-9 rounded-sm border border-border-strong bg-transparent text-text-muted flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-200"
            >
              <Users size={16} />
            </button>
          )}

          {/* Categories button */}
          <button
            onClick={onOpenCategories}
            title="Gestionar categorías"
            className="w-9 h-9 rounded-sm border border-border-strong bg-transparent text-text-muted flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-200"
          >
            <Tags size={16} />
          </button>

          {/* Month selector */}
          <div className="flex items-center gap-2 bg-surface border border-border rounded-full p-1.5">
            <button
              onClick={onPrevMonth}
              aria-label="Mes anterior"
              className="w-8 h-8 rounded-full border-none bg-background text-text-secondary flex items-center justify-center cursor-pointer hover:text-text-primary transition-colors duration-200"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-heading text-sm font-semibold capitalize min-w-[100px] text-center text-white">
              {monthName} {anio}
            </span>
            <button
              onClick={onNextMonth}
              aria-label="Mes siguiente"
              className="w-8 h-8 rounded-full border-none bg-background text-text-secondary flex items-center justify-center cursor-pointer hover:text-text-primary transition-colors duration-200"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Balance card */}
      <div
        className="card p-6 text-center"
        style={{ background: `linear-gradient(135deg, var(--color-surface), ${isPositive ? 'rgba(229,255,166,0.05)' : 'rgba(255,75,90,0.05)'})` }}
      >
        <p className="text-[11px] text-text-muted mb-1 font-semibold uppercase tracking-[1px]">
          Saldo del mes
        </p>
        <h2 className={`font-heading text-4xl font-black tracking-[-1px] transition-colors duration-300 ${isPositive ? 'text-accent' : 'text-danger'}`}>
          {isPositive ? '+' : ''}{formatCurrency(saldo)}
        </h2>
      </div>
    </header>
  );
}
