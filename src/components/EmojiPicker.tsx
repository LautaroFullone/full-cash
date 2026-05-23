import { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export const EMOJI_GROUPS = [
  { group: 'Finanzas', emojis: ['💰', '💵', '💴', '💶', '💷', '💳', '💸', '🏦', '📈', '📉', '🧾', '💹', '💱', '🤑', '💲'] },
  { group: 'Trabajo', emojis: ['💼', '👔', '🤝', '🏢', '💻', '🖥️', '⌨️', '🖨️', '📋', '🗂️', '📎', '🗃️', '📊', '📁', '🔑'] },
  { group: 'Hogar', emojis: ['🏠', '🏡', '🏘️', '🛋️', '🛏️', '🪑', '💡', '🔌', '🔥', '🌊', '🛠️', '🪣', '🧹', '🧼', '🚿'] },
  { group: 'Comida', emojis: ['🍕', '🍔', '🌮', '🍣', '🍱', '🥗', '🛒', '🏪', '🥦', '🍎', '☕', '🍷', '🍺', '🧃', '🍽️'] },
  { group: 'Transporte', emojis: ['🚗', '🚕', '🛻', '🚌', '🚆', '✈️', '⛽', '🛵', '🚲', '🛴', '🚁', '🚢', '🛤️', '🗺️', '🅿️'] },
  { group: 'Salud', emojis: ['💊', '🏥', '🦷', '💪', '🧘', '🏃', '🌡️', '🩺', '🩹', '🧬', '🔬', '🏋️', '🚑', '🧠', '❤️'] },
  { group: 'Entretenimiento', emojis: ['🎮', '🎬', '🎵', '🎧', '🎨', '🎭', '🎯', '🎪', '🎢', '🎳', '🎲', '🃏', '🎙️', '🎤', '🎺'] },
  { group: 'Educación', emojis: ['🎓', '📚', '📖', '✏️', '🖊️', '📝', '🔭', '🔬', '🧪', '📐', '📏', '🏫', '💡', '🧩', '🗺️'] },
  { group: 'Ropa', emojis: ['👕', '👗', '👟', '👠', '👜', '🧥', '🛍️', '💄', '💍', '🕶️', '🧣', '🧤', '🎩', '👒', '👔'] },
  { group: 'Mascotas', emojis: ['🐕', '🐈', '🐾', '🦮', '🐠', '🦜', '🐇', '🐹', '🦎', '🐢', '🐓', '🐝', '🦊', '🐺', '🐟'] },
  { group: 'Ahorro', emojis: ['🐷', '🏆', '⭐', '💫', '🌟', '🎯', '💎', '🥇', '🏅', '🎁', '🍀', '🔒', '🗝️', '🧲', '🎰'] },
  { group: 'Social', emojis: ['🎉', '🥳', '🎊', '🎟️', '🌐', '📱', '🤳', '🧳', '✈️', '🏖️', '🏔️', '⛺', '🎠', '🎡', '🎢'] },
  { group: 'Otros', emojis: ['❓', '📌', '📍', '🔖', '⚙️', '🔔', '📡', '🧩', '🗓️', '🔍', '📦', '🏷️', '🎗️', '🌈', '⚡'] },
];

export const ALL_EMOJIS = EMOJI_GROUPS.flatMap(g => g.emojis);

interface EmojiPickerProps {
  selected: string;
  usedEmojis?: string[];
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ selected, usedEmojis = [], onSelect }: EmojiPickerProps) {
  const [search, setSearch] = useState('');

  const filteredGroups = search.trim()
    ? [{ group: 'Resultados', emojis: ALL_EMOJIS.filter(e => e.includes(search.trim())) }]
    : EMOJI_GROUPS;

  return (
    <div className="bg-background border border-border-strong rounded-lg overflow-hidden w-full shadow-elevated">
      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
        <Search size={14} className="text-text-muted shrink-0" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar emoji..."
          className="flex-1 border-none bg-transparent text-[13px] p-0 text-white"
          autoFocus
        />
      </div>

      {/* Emoji grid */}
      <div className="max-h-[220px] overflow-y-auto p-2">
        {filteredGroups.map(({ group, emojis }) => (
          <div key={group} className="mb-2">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.6px] mx-1 mt-1 mb-1.5">
              {group}
            </p>
            <div className="flex flex-wrap gap-0.5">
              {emojis.map(emoji => {
                const isUsed = usedEmojis.includes(emoji) && emoji !== selected;
                const isSelected = emoji === selected;
                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => !isUsed && onSelect(emoji)}
                    title={isUsed ? 'Ya usado en otra categoría' : ''}
                    className={cn(
                      'w-[34px] h-[34px] text-lg flex items-center justify-center rounded-sm border-2 leading-none transition-all duration-100',
                      isSelected ? 'border-accent bg-accent/[15%]' : 'border-transparent bg-transparent hover:bg-white/5',
                      isUsed ? 'cursor-not-allowed opacity-25' : 'cursor-pointer'
                    )}
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
