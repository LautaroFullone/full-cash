import { useState } from 'react';
import { X, Plus, Pencil, Trash2, Check, Loader2 } from 'lucide-react';
import { EmojiPicker } from './EmojiPicker';
import { CategoryIcon } from './CategoryIcon';
import type { Categoria, TipoMovimiento } from '@/types';

interface CategoryManagerProps {
  categorias: Categoria[];
  onClose: () => void;
  onCreate: (data: { nombre: string; tipo: TipoMovimiento; icono: string }) => Promise<void>;
  onUpdate: (id: string, data: { nombre?: string; icono?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

// ── Inline editor row ──
interface EditRowProps {
  categoria: Categoria;
  usedEmojis: string[];
  onSave: (data: { nombre: string; icono: string }) => Promise<void>;
  onCancel: () => void;
}

function EditRow({ categoria, usedEmojis, onSave, onCancel }: EditRowProps) {
  const [nombre, setNombre] = useState(categoria.nombre);
  const [icono, setIcono] = useState(categoria.icono);
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!nombre.trim()) return;
    setSaving(true);
    await onSave({ nombre: nombre.trim(), icono });
    setSaving(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: 'rgba(229,255,166,0.04)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(229,255,166,0.15)' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {/* Emoji preview button */}
        <button
          type="button"
          onClick={() => setShowPicker(v => !v)}
          style={{
            width: '40px', height: '40px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border-strong)', background: 'var(--color-background)',
            fontSize: '20px', cursor: 'pointer', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {icono || '❓'}
        </button>
        <input
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          style={{ flex: 1, fontSize: '14px' }}
          placeholder="Nombre de categoría..."
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onCancel(); }}
          autoFocus
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !nombre.trim()}
          style={{
            width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
            border: 'none', background: 'var(--color-accent)', color: 'var(--color-background)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: saving || !nombre.trim() ? 0.5 : 1,
          }}
        >
          {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={14} />}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border-strong)', background: 'transparent',
            color: 'var(--color-text-muted)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <X size={14} />
        </button>
      </div>
      {showPicker && (
        <EmojiPicker
          selected={icono}
          usedEmojis={usedEmojis}
          onSelect={e => { setIcono(e); setShowPicker(false); }}
        />
      )}
    </div>
  );
}

// ── New category form ──
interface NewRowProps {
  tipo: TipoMovimiento;
  usedEmojis: string[];
  onSave: (data: { nombre: string; tipo: TipoMovimiento; icono: string }) => Promise<void>;
  onCancel: () => void;
}

function NewRow({ tipo, usedEmojis, onSave, onCancel }: NewRowProps) {
  const [nombre, setNombre] = useState('');
  const [icono, setIcono] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!nombre.trim() || !icono) return;
    setSaving(true);
    await onSave({ nombre: nombre.trim(), tipo, icono });
    setSaving(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: 'rgba(229,255,166,0.04)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(229,255,166,0.2)' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => setShowPicker(v => !v)}
          style={{
            width: '40px', height: '40px', borderRadius: 'var(--radius-sm)',
            border: `1px solid ${icono ? 'var(--color-accent)' : 'var(--color-border-strong)'}`,
            background: 'var(--color-background)', fontSize: icono ? '20px' : '14px',
            cursor: 'pointer', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-text-muted)',
          }}
        >
          {icono || '＋'}
        </button>
        <input
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          style={{ flex: 1, fontSize: '14px' }}
          placeholder={`Nueva categoría de ${tipo === 'INGRESO' ? 'ingreso' : 'gasto'}...`}
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onCancel(); }}
          autoFocus
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !nombre.trim() || !icono}
          style={{
            width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
            border: 'none', background: 'var(--color-accent)', color: 'var(--color-background)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: saving || !nombre.trim() || !icono ? 0.4 : 1,
          }}
        >
          {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={14} />}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border-strong)', background: 'transparent',
            color: 'var(--color-text-muted)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <X size={14} />
        </button>
      </div>
      {(!icono || showPicker) && (
        <EmojiPicker
          selected={icono}
          usedEmojis={usedEmojis}
          onSelect={e => { setIcono(e); setShowPicker(false); }}
        />
      )}
    </div>
  );
}

// ── Main CategoryManager ──
export function CategoryManager({ categorias, onClose, onCreate, onUpdate, onDelete }: CategoryManagerProps) {
  const [tab, setTab] = useState<TipoMovimiento>('EGRESO');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const usedEmojis = categorias.map(c => c.icono).filter(Boolean);
  const filtered = categorias.filter(c => c.tipo === tab);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    setDeletingId(id);
    try {
      await onDelete(id);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Error al eliminar');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
        zIndex: 60, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        className="animate-slide-up"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '520px',
          background: 'var(--color-surface)', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
          padding: '8px 20px 40px', maxHeight: '88dvh', overflowY: 'auto',
          border: '1px solid var(--color-border)', borderBottom: 'none',
        }}
      >
        {/* Handle */}
        <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'var(--color-border-strong)', margin: '12px auto 20px' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Categorías</h2>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
              {categorias.length} categorías en total
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', padding: '4px', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '2px', background: 'var(--color-background)', borderRadius: 'var(--radius-full)', padding: '3px', marginBottom: '16px' }}>
          {(['EGRESO', 'INGRESO'] as TipoMovimiento[]).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setAddingNew(false); setEditingId(null); }}
              style={{
                flex: 1, padding: '8px', borderRadius: 'var(--radius-full)', border: 'none',
                fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-body)', cursor: 'pointer',
                background: tab === t
                  ? (t === 'EGRESO' ? 'rgba(255,75,90,0.15)' : 'rgba(229,255,166,0.12)')
                  : 'transparent',
                color: tab === t
                  ? (t === 'EGRESO' ? 'var(--color-danger)' : 'var(--color-accent)')
                  : 'var(--color-text-muted)',
                transition: 'all 0.2s ease',
              }}
            >
              {t === 'INGRESO' ? '↑ Ingresos' : '↓ Gastos'} ({categorias.filter(c => c.tipo === t).length})
            </button>
          ))}
        </div>

        {/* Error banner */}
        {deleteError && (
          <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(255,75,90,0.1)', border: '1px solid rgba(255,75,90,0.3)', marginBottom: '12px', fontSize: '13px', color: 'var(--color-danger)' }}>
            {deleteError}
          </div>
        )}

        {/* Category list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {filtered.map(cat => (
            editingId === cat.id ? (
              <EditRow
                key={cat.id}
                categoria={cat}
                usedEmojis={usedEmojis.filter(e => e !== cat.icono)}
                onSave={async data => { await onUpdate(cat.id, data); setEditingId(null); }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div
                key={cat.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 12px', borderRadius: 'var(--radius-md)',
                  border: '1px solid transparent', transition: 'all 0.15s ease',
                  opacity: deletingId === cat.id ? 0.4 : 1,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
              >
                {/* Emoji */}
                <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CategoryIcon icono={cat.icono} size={20} />
                </div>
                {/* Name */}
                <span style={{ flex: 1, fontSize: '14px', fontWeight: 500 }}>{cat.nombre}</span>
                {/* Actions */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => { setEditingId(cat.id); setAddingNew(false); }}
                    style={{ width: '30px', height: '30px', borderRadius: 'var(--radius-xs)', border: 'none', background: 'transparent', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--color-text-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    disabled={!!deletingId}
                    style={{ width: '30px', height: '30px', borderRadius: 'var(--radius-xs)', border: 'none', background: 'transparent', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,75,90,0.1)'; e.currentTarget.style.color = 'var(--color-danger)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )
          ))}

          {/* New category form */}
          {addingNew && !editingId && (
            <NewRow
              tipo={tab}
              usedEmojis={usedEmojis}
              onSave={async data => { await onCreate(data); setAddingNew(false); }}
              onCancel={() => setAddingNew(false)}
            />
          )}

          {/* Add button */}
          {!addingNew && (
            <button
              onClick={() => { setAddingNew(true); setEditingId(null); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 12px', borderRadius: 'var(--radius-md)',
                border: '1px dashed var(--color-border-strong)', background: 'transparent',
                color: 'var(--color-accent)', fontSize: '13px', fontWeight: 600,
                fontFamily: 'var(--font-body)', cursor: 'pointer',
                transition: 'all 0.15s ease',
                marginTop: '4px',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(229,255,166,0.05)'; e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--color-border-strong)'; }}
            >
              <Plus size={16} />
              Nueva categoría de {tab === 'INGRESO' ? 'ingreso' : 'gasto'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
