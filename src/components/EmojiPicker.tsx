import { useState } from 'react';
import { Search } from 'lucide-react';

// ── Emoji catalog ──
export const EMOJI_GROUPS = [
  {
    group: 'Finanzas',
    emojis: ['💰', '💵', '💴', '💶', '💷', '💳', '💸', '🏦', '📈', '📉', '🧾', '💹', '💱', '🤑', '💲'],
  },
  {
    group: 'Trabajo',
    emojis: ['💼', '👔', '🤝', '🏢', '💻', '🖥️', '⌨️', '🖨️', '📋', '🗂️', '📎', '🗃️', '📊', '📁', '🔑'],
  },
  {
    group: 'Hogar',
    emojis: ['🏠', '🏡', '🏘️', '🛋️', '🛏️', '🪑', '💡', '🔌', '🔥', '🌊', '🛠️', '🪣', '🧹', '🧼', '🚿'],
  },
  {
    group: 'Comida',
    emojis: ['🍕', '🍔', '🌮', '🍣', '🍱', '🥗', '🛒', '🏪', '🥦', '🍎', '☕', '🍷', '🍺', '🧃', '🍽️'],
  },
  {
    group: 'Transporte',
    emojis: ['🚗', '🚕', '🛻', '🚌', '🚆', '✈️', '⛽', '🛵', '🚲', '🛴', '🚁', '🚢', '🛤️', '🗺️', '🅿️'],
  },
  {
    group: 'Salud',
    emojis: ['💊', '🏥', '🦷', '💪', '🧘', '🏃', '🌡️', '🩺', '🩹', '🧬', '🔬', '🏋️', '🚑', '🧠', '❤️'],
  },
  {
    group: 'Entretenimiento',
    emojis: ['🎮', '🎬', '🎵', '🎧', '🎨', '🎭', '🎯', '🎪', '🎢', '🎳', '🎲', '🃏', '🎙️', '🎤', '🎺'],
  },
  {
    group: 'Educación',
    emojis: ['🎓', '📚', '📖', '✏️', '🖊️', '📝', '🔭', '🔬', '🧪', '📐', '📏', '🏫', '💡', '🧩', '🗺️'],
  },
  {
    group: 'Ropa',
    emojis: ['👕', '👗', '👟', '👠', '👜', '🧥', '🛍️', '💄', '💍', '🕶️', '🧣', '🧤', '🎩', '👒', '👔'],
  },
  {
    group: 'Mascotas',
    emojis: ['🐕', '🐈', '🐾', '🦮', '🐠', '🦜', '🐇', '🐹', '🦎', '🐢', '🐓', '🐝', '🦊', '🐺', '🐟'],
  },
  {
    group: 'Ahorro',
    emojis: ['🐷', '🏆', '⭐', '💫', '🌟', '🎯', '💎', '🥇', '🏅', '🎁', '🍀', '🔒', '🗝️', '🧲', '🎰'],
  },
  {
    group: 'Social',
    emojis: ['🎉', '🥳', '🎊', '🎟️', '🌐', '📱', '🤳', '🧳', '✈️', '🏖️', '🏔️', '⛺', '🎠', '🎡', '🎢'],
  },
  {
    group: 'Otros',
    emojis: ['❓', '📌', '📍', '🔖', '⚙️', '🔔', '📡', '🧩', '🗓️', '🔍', '📦', '🏷️', '🎗️', '🌈', '⚡'],
  },
];

export const ALL_EMOJIS = EMOJI_GROUPS.flatMap(g => g.emojis);

interface EmojiPickerProps {
  selected: string;
  usedEmojis?: string[]; // emojis ya usados por otras categorías
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ selected, usedEmojis = [], onSelect }: EmojiPickerProps) {
  const [search, setSearch] = useState('');

  const filteredGroups = search.trim()
    ? [{ group: 'Resultados', emojis: ALL_EMOJIS.filter(e => e.includes(search.trim())) }]
    : EMOJI_GROUPS;

  return (
    <div
      style={{
        background: 'var(--color-background)',
        border: '1px solid var(--color-border-strong)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        width: '100%',
        boxShadow: 'var(--shadow-elevated)',
      }}
    >
      {/* Search */}
      <div
        style={{
          padding: '10px 12px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Search size={14} color="var(--color-text-muted)" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar emoji..."
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            fontSize: '13px',
            padding: 0,
            outline: 'none',
            color: 'var(--color-text-primary)',
          }}
          autoFocus
        />
      </div>

      {/* Emoji grid — scrollable */}
      <div style={{ maxHeight: '220px', overflowY: 'auto', padding: '8px' }}>
        {filteredGroups.map(({ group, emojis }) => (
          <div key={group} style={{ marginBottom: '8px' }}>
            <p
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                margin: '4px 4px 6px',
              }}
            >
              {group}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
              {emojis.map(emoji => {
                const isUsed = usedEmojis.includes(emoji) && emoji !== selected;
                const isSelected = emoji === selected;
                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => !isUsed && onSelect(emoji)}
                    title={isUsed ? 'Ya usado en otra categoría' : ''}
                    style={{
                      width: '34px',
                      height: '34px',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 'var(--radius-sm)',
                      border: isSelected ? '2px solid var(--color-accent)' : '2px solid transparent',
                      background: isSelected
                        ? 'rgba(229,255,166,0.15)'
                        : 'transparent',
                      cursor: isUsed ? 'not-allowed' : 'pointer',
                      opacity: isUsed ? 0.25 : 1,
                      transition: 'all 0.1s ease',
                      lineHeight: 1,
                    }}
                    onMouseEnter={e => {
                      if (!isUsed && !isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {emoji}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
