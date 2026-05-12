import { useState } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';
import { CurrencyInput } from './CurrencyInput';
import type { Categoria, Plataforma, TipoMovimiento } from '@/types';

interface MovementFormProps {
  categorias: Categoria[];
  plataformas: Plataforma[];
  onSubmit: (data: {
    concepto: string;
    monto: number;
    tipo: TipoMovimiento;
    categoriaId: string;
    plataformaId?: string;
    fecha: string;
  }) => Promise<void>;
}

export function MovementForm({ categorias, plataformas, onSubmit }: MovementFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tipo, setTipo] = useState<TipoMovimiento>('EGRESO');
  const [concepto, setConcepto] = useState('');
  const [monto, setMonto] = useState<number | ''>('');
  const [categoriaId, setCategoriaId] = useState('');
  const [plataformaId, setPlataformaId] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filteredCategorias = categorias.filter(c => c.tipo === tipo);

  const resetForm = () => {
    setConcepto('');
    setMonto('');
    setCategoriaId('');
    setPlataformaId('');
    setFecha(new Date().toISOString().split('T')[0]);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concepto.trim()) { setError('Ingresá un concepto'); return; }
    if (!monto || monto <= 0) { setError('Ingresá un monto válido'); return; }
    if (!categoriaId) { setError('Seleccioná una categoría'); return; }

    try {
      setLoading(true);
      setError('');
      await onSubmit({
        concepto: concepto.trim(),
        monto: Number(monto),
        tipo,
        categoriaId,
        plataformaId: plataformaId || undefined,
        fecha: new Date(fecha + 'T12:00:00').toISOString(),
      });
      resetForm();
      setIsOpen(false);
    } catch {
      setError('Error al guardar el movimiento');
    } finally {
      setLoading(false);
    }
  };

  const handleTipoChange = (newTipo: TipoMovimiento) => {
    setTipo(newTipo);
    setCategoriaId('');
  };

  // ── Label helper ──
  const Label = ({ children }: { children: React.ReactNode }) => (
    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px', display: 'block' }}>
      {children}
    </label>
  );

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Nuevo movimiento"
        style={{
          position: 'fixed', bottom: '24px', right: '24px', width: '56px', height: '56px',
          borderRadius: '50%', border: 'none',
          background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dim))',
          color: 'var(--color-background)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(229,255,166,0.3)', zIndex: 40, cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
            zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          }}
          onClick={() => setIsOpen(false)}
        >
          {/* Bottom Sheet */}
          <div
            className="animate-slide-up"
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '520px',
              background: 'var(--color-surface)', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
              padding: '8px 20px 32px', maxHeight: '92dvh', overflowY: 'auto',
              border: '1px solid var(--color-border)', borderBottom: 'none',
            }}
          >
            {/* Handle */}
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'var(--color-border-strong)', margin: '12px auto 20px' }} />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Nuevo movimiento</h2>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', padding: '4px', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Tipo Toggle */}
              <div>
                <Label>Tipo</Label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border-strong)' }}>
                  {(['INGRESO', 'EGRESO'] as TipoMovimiento[]).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleTipoChange(t)}
                      style={{
                        padding: '11px', border: 'none', fontSize: '14px', fontWeight: 700,
                        fontFamily: 'var(--font-body)', cursor: 'pointer', transition: 'all 0.2s ease',
                        background: tipo === t
                          ? (t === 'INGRESO' ? 'var(--color-accent)' : 'var(--color-danger)')
                          : 'var(--color-background)',
                        color: tipo === t
                          ? (t === 'INGRESO' ? 'var(--color-background)' : '#fff')
                          : 'var(--color-text-muted)',
                      }}
                    >
                      {t === 'INGRESO' ? '↑ Ingreso' : '↓ Gasto'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Concepto */}
              <div>
                <Label>Concepto</Label>
                <input
                  value={concepto}
                  onChange={e => setConcepto(e.target.value)}
                  placeholder="Ej: Sueldo, Supermercado..."
                  style={{ width: '100%' }}
                />
              </div>

              {/* Monto — CurrencyInput */}
              <div>
                <Label>Monto</Label>
                <CurrencyInput value={monto} onChange={setMonto} />
              </div>

              {/* Categoría */}
              <div>
                <Label>Categoría</Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {filteredCategorias.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoriaId(cat.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '7px 12px', borderRadius: 'var(--radius-full)', border: '1px solid',
                        fontSize: '13px', fontFamily: 'var(--font-body)', cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        borderColor: categoriaId === cat.id ? 'var(--color-accent)' : 'var(--color-border-strong)',
                        background: categoriaId === cat.id ? 'rgba(229,255,166,0.1)' : 'var(--color-background)',
                        color: categoriaId === cat.id ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                      }}
                    >
                      <CategoryIcon categoryName={cat.nombre} iconName={cat.icono} size={14} />
                      {cat.nombre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Plataforma */}
              <div>
                <Label>Plataforma (opcional)</Label>
                <select value={plataformaId} onChange={e => setPlataformaId(e.target.value)} style={{ width: '100%' }}>
                  <option value="">Sin plataforma</option>
                  {plataformas.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Fecha */}
              <div>
                <Label>Fecha</Label>
                <input
                  type="date"
                  value={fecha}
                  onChange={e => setFecha(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Error */}
              {error && (
                <p style={{ fontSize: '13px', color: 'var(--color-danger)', margin: 0, fontWeight: 500 }}>
                  ⚠ {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '4px', padding: '15px', border: 'none',
                  borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-heading)',
                  fontSize: '15px', fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
                  background: 'var(--color-text-primary)', color: 'var(--color-background)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  opacity: loading ? 0.7 : 1, transition: 'all 0.2s ease',
                }}
              >
                {loading
                  ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  : <Plus size={18} />
                }
                Guardar movimiento
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
