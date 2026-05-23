import { useState } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';
import { CurrencyInput } from './CurrencyInput';
import { DatePicker } from './DatePicker';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
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
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-bold text-text-muted uppercase tracking-[0.8px] mb-1.5">
      {children}
    </label>
  );
}

export function MovementForm({ categorias, plataformas, onSubmit, isOpen: controlledOpen, onClose: controlledClose, onOpen: controlledOnOpen }: MovementFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [tipo, setTipo] = useState<TipoMovimiento>('EGRESO');
  const [concepto, setConcepto] = useState('');
  const [monto, setMonto] = useState<number | ''>('');
  const [categoriaId, setCategoriaId] = useState('');
  const [plataformaId, setPlataformaId] = useState('');
  const [fecha, setFecha] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const handleOpen = () => { if (controlledOnOpen) controlledOnOpen(); else setInternalOpen(true); };
  const handleClose = () => { if (controlledClose) controlledClose(); else setInternalOpen(false); };

  const filteredCategorias = categorias.filter(c => c.tipo === tipo);

  const resetForm = () => {
    setConcepto('');
    setMonto('');
    setCategoriaId('');
    setPlataformaId('');
    setFecha(format(new Date(), 'yyyy-MM-dd'));
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
      handleClose();
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

  return (
    <>
      {/* FAB — mobile only */}
      <button
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full border-none flex items-center justify-center z-40 cursor-pointer hover:scale-110 transition-transform duration-200"
        style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dim))', boxShadow: '0 4px 20px rgba(229,255,166,0.3)' }}
        onClick={handleOpen}
        aria-label="Nuevo movimiento"
      >
        <Plus size={24} color="#003a34" strokeWidth={2.5} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="modal-overlay fixed inset-0 bg-black/65 backdrop-blur-md z-50 flex justify-center"
          onClick={handleClose}
        >
          {/* Sheet / Dialog */}
          <div
            className="modal-sheet animate-slide-up bg-surface overflow-y-auto"
            style={{ maxHeight: '92dvh', paddingLeft: '20px', paddingRight: '20px', paddingBottom: '40px' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drag handle — mobile only */}
            <div className="lg:hidden w-10 h-1 rounded-full bg-border-strong mx-auto mt-3 mb-5" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Nuevo movimiento</h2>
              <button onClick={handleClose} className="bg-transparent border-none text-text-muted p-1 cursor-pointer hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
              {/* Tipo */}
              <div>
                <FormLabel>Tipo</FormLabel>
                <div className="grid grid-cols-2 rounded-md overflow-hidden border border-border-strong">
                  {(['INGRESO', 'EGRESO'] as TipoMovimiento[]).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleTipoChange(t)}
                      className={cn(
                        'py-3 border-none text-sm font-bold font-body cursor-pointer transition-all duration-200',
                        tipo === t
                          ? t === 'INGRESO' ? 'bg-accent text-background' : 'bg-danger text-white'
                          : 'bg-background text-text-muted'
                      )}
                    >
                      {t === 'INGRESO' ? '↑ Ingreso' : '↓ Gasto'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Concepto */}
              <div>
                <FormLabel>Concepto</FormLabel>
                <input
                  value={concepto}
                  onChange={e => setConcepto(e.target.value)}
                  placeholder="Ej: Sueldo, Supermercado..."
                  className="w-full"
                />
              </div>

              {/* Monto */}
              <div>
                <FormLabel>Monto</FormLabel>
                <CurrencyInput value={monto} onChange={setMonto} />
              </div>

              {/* Categoría */}
              <div>
                <FormLabel>Categoría</FormLabel>
                {filteredCategorias.length === 0 ? (
                  <p className="text-[13px] text-text-muted py-2">
                    No hay categorías de {tipo === 'INGRESO' ? 'ingreso' : 'gasto'}. Creá una desde el gestor.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {filteredCategorias.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategoriaId(cat.id)}
                        className={cn(
                          'flex items-center gap-1.5 py-[7px] px-3 rounded-full border text-[13px] font-body cursor-pointer transition-all duration-150',
                          categoriaId === cat.id
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border-strong bg-background text-text-secondary hover:border-border hover:text-white'
                        )}
                      >
                        <CategoryIcon icono={cat.icono} size={14} />
                        {cat.nombre}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Plataforma */}
              <div>
                <FormLabel>Plataforma (opcional)</FormLabel>
                <select value={plataformaId} onChange={e => setPlataformaId(e.target.value)} className="w-full">
                  <option value="">Sin plataforma</option>
                  {plataformas.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </div>

              {/* Fecha */}
              <div>
                <FormLabel>Fecha</FormLabel>
                <DatePicker value={fecha} onChange={setFecha} />
              </div>

              {error && (
                <p className="text-[13px] text-danger font-medium">⚠ {error}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 py-[15px] border-none rounded-md font-heading text-[15px] font-bold bg-white text-background flex items-center justify-center gap-2 disabled:opacity-70 transition-all duration-200 cursor-pointer"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                Guardar movimiento
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
