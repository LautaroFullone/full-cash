import { useState } from 'react'
import { X, Plus, Pencil, Trash2, Check, Loader2, EyeOff } from 'lucide-react'
import { EmojiPicker } from './components/EmojiPicker'
import { CategoryIcon } from './components/CategoryIcon'
import { cn } from '@/utils/cn'
import type { Categoria, TipoMovimiento } from '@/models/categoria'
import type { PostCategoriaBody } from './services/postCategoria'
import type { PutCategoriaBody } from './services/putCategoria'

interface CategoryManagerProps {
  categorias: Categoria[]
  onClose: () => void
  onCreate: (data: PostCategoriaBody) => Promise<void> | void
  onUpdate: (id: string, data: PutCategoriaBody) => Promise<void> | void
  onDelete: (id: string) => Promise<void> | void
}

interface EditRowProps {
  categoria: Categoria
  usedEmojis: string[]
  onSave: (data: PutCategoriaBody) => Promise<void>
  onCancel: () => void
}

function EditRow({ categoria, usedEmojis, onSave, onCancel }: EditRowProps) {
  const [nombre, setNombre] = useState(categoria.nombre)
  const [icono, setIcono] = useState(categoria.icono)
  const [showPicker, setShowPicker] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!nombre.trim()) return
    setSaving(true)
    await onSave({ nombre: nombre.trim(), icono })
    setSaving(false)
  }

  return (
    <div className="flex flex-col gap-2 p-3 bg-accent/4 rounded-md border border-accent/15">
      <div className="flex gap-2 items-center">
        <button type="button" onClick={() => setShowPicker(v => !v)} className="w-10 h-10 rounded-sm border border-border-strong bg-background text-xl cursor-pointer shrink-0 flex items-center justify-center">
          {icono || '❓'}
        </button>
        <input
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          className="flex-1 text-sm"
          placeholder="Nombre de categoría..."
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onCancel() }}
          autoFocus
        />
        <button type="button" onClick={handleSave} disabled={saving || !nombre.trim()} className="w-9 h-9 rounded-sm border-none bg-accent text-background flex items-center justify-center disabled:opacity-50">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
        </button>
        <button type="button" onClick={onCancel} className="w-9 h-9 rounded-sm border border-border-strong bg-transparent text-text-muted flex items-center justify-center">
          <X size={14} />
        </button>
      </div>
      {showPicker && (
        <EmojiPicker selected={icono} usedEmojis={usedEmojis.filter(e => e !== categoria.icono)} onSelect={e => { setIcono(e); setShowPicker(false) }} />
      )}
    </div>
  )
}

interface NewRowProps {
  tipo: TipoMovimiento
  usedEmojis: string[]
  onSave: (data: PostCategoriaBody) => Promise<void>
  onCancel: () => void
}

function NewRow({ tipo, usedEmojis, onSave, onCancel }: NewRowProps) {
  const [nombre, setNombre] = useState('')
  const [icono, setIcono] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!nombre.trim() || !icono) return
    setSaving(true)
    await onSave({ nombre: nombre.trim(), tipo, icono })
    setSaving(false)
  }

  return (
    <div className="flex flex-col gap-2 p-3 bg-accent/4 rounded-md border border-accent/20">
      <div className="flex gap-2 items-center">
        <button
          type="button"
          onClick={() => setShowPicker(v => !v)}
          className={cn(
            'w-10 h-10 rounded-sm bg-background cursor-pointer shrink-0 flex items-center justify-center border',
            icono ? 'border-accent text-xl' : 'border-border-strong text-sm text-text-muted'
          )}
        >
          {icono || '＋'}
        </button>
        <input
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          className="flex-1 text-sm"
          placeholder={`Nueva categoría de ${tipo === 'INGRESO' ? 'ingreso' : 'gasto'}...`}
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onCancel() }}
          autoFocus
        />
        <button type="button" onClick={handleSave} disabled={saving || !nombre.trim() || !icono} className="w-9 h-9 rounded-sm border-none bg-accent text-background flex items-center justify-center disabled:opacity-40">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
        </button>
        <button type="button" onClick={onCancel} className="w-9 h-9 rounded-sm border border-border-strong bg-transparent text-text-muted flex items-center justify-center">
          <X size={14} />
        </button>
      </div>
      {(!icono || showPicker) && (
        <EmojiPicker selected={icono} usedEmojis={usedEmojis} onSelect={e => { setIcono(e); setShowPicker(false) }} />
      )}
    </div>
  )
}

export function CategoryManager({ categorias, onClose, onCreate, onUpdate, onDelete }: CategoryManagerProps) {
  const [tab, setTab] = useState<TipoMovimiento>('EGRESO')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [addingNew, setAddingNew] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const usedEmojis = categorias.map(c => c.icono).filter(Boolean)
  const filtered = categorias.filter(c => c.tipo === tab)

  const handleDelete = async (id: string) => {
    setDeleteError(null)
    setDeletingId(id)
    try { await onDelete(id) } catch (err) { setDeleteError(err instanceof Error ? err.message : 'Error al eliminar') } finally { setDeletingId(null) }
  }

  return (
    <div className="modal-overlay fixed inset-0 bg-black/70 backdrop-blur-lg z-60 flex justify-center" onClick={onClose}>
      <div
        className="modal-sheet animate-slide-up bg-surface overflow-y-auto"
        style={{ maxHeight: '88dvh', paddingLeft: '20px', paddingRight: '20px', paddingBottom: '40px' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="lg:hidden w-10 h-1 rounded-full bg-border-strong mx-auto mt-3 mb-5" />

        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold">Categorías</h2>
            <p className="text-[13px] text-text-muted mt-0.5">{categorias.length} categorías en total</p>
          </div>
          <button onClick={onClose} className="bg-transparent border-none text-text-muted p-1 cursor-pointer hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-0.5 bg-background rounded-full p-0.75 mb-4">
          {(['EGRESO', 'INGRESO'] as TipoMovimiento[]).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setAddingNew(false); setEditingId(null) }}
              className={cn(
                'flex-1 py-2 rounded-full border-none text-[13px] font-semibold font-body cursor-pointer transition-all duration-200',
                tab === t
                  ? t === 'EGRESO' ? 'bg-danger/15 text-danger' : 'bg-accent/12 text-accent'
                  : 'bg-transparent text-text-muted'
              )}
            >
              {t === 'INGRESO' ? '↑ Ingresos' : '↓ Gastos'} ({categorias.filter(c => c.tipo === t).length})
            </button>
          ))}
        </div>

        {deleteError && (
          <div className="px-3.5 py-2.5 rounded-md bg-danger/10 border border-danger/30 mb-3 text-[13px] text-danger">{deleteError}</div>
        )}

        <div className="flex flex-col gap-1.5">
          {filtered.map(cat =>
            editingId === cat.id ? (
              <EditRow
                key={cat.id} categoria={cat} usedEmojis={usedEmojis}
                onSave={async data => { await onUpdate(cat.id, data); setEditingId(null) }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div
                key={cat.id}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md border border-transparent transition-all duration-150 hover:bg-white/3 hover:border-border',
                  deletingId === cat.id && 'opacity-40'
                )}
              >
                <div className="w-9.5 h-9.5 rounded-sm bg-white/5 flex items-center justify-center shrink-0">
                  <CategoryIcon icono={cat.icono} size={20} />
                </div>
                <span className="flex-1 text-sm font-medium text-white">{cat.nombre}</span>

                {cat.userId === null ? (
                  <button
                    onClick={() => handleDelete(cat.id)}
                    disabled={!!deletingId}
                    title="Ocultar de mi lista"
                    className="w-7.5 h-7.5 rounded-xs border-none bg-transparent text-text-muted flex items-center justify-center cursor-pointer hover:bg-white/8 hover:text-text-secondary transition-all duration-150"
                  >
                    <EyeOff size={13} />
                  </button>
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={() => { setEditingId(cat.id); setAddingNew(false) }}
                      className="w-7.5 h-7.5 rounded-xs border-none bg-transparent text-text-muted flex items-center justify-center cursor-pointer hover:bg-white/8 hover:text-white transition-all duration-150"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      disabled={!!deletingId}
                      className="w-7.5 h-7.5 rounded-xs border-none bg-transparent text-text-muted flex items-center justify-center cursor-pointer hover:bg-danger/10 hover:text-danger transition-all duration-150"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            )
          )}

          {addingNew && !editingId && (
            <NewRow
              tipo={tab} usedEmojis={usedEmojis}
              onSave={async data => { await onCreate(data); setAddingNew(false) }}
              onCancel={() => setAddingNew(false)}
            />
          )}

          {!addingNew && (
            <button
              onClick={() => { setAddingNew(true); setEditingId(null) }}
              className="flex items-center gap-2 px-3 py-2.5 mt-1 rounded-md border border-dashed border-border-strong bg-transparent text-accent text-[13px] font-semibold font-body cursor-pointer transition-all duration-150 hover:bg-accent/5 hover:border-accent"
            >
              <Plus size={16} />
              Nueva categoría de {tab === 'INGRESO' ? 'ingreso' : 'gasto'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
