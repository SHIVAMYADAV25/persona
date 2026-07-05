import Avatar from './Avatar';
import type { Persona, PersonaId } from '../types';

interface PersonaSwitchListProps {
  personas: Persona[];
  activeId: PersonaId;
  onSwitch: (id: PersonaId) => void;
  compact?: boolean;
}

export default function PersonaSwitchList({
  personas,
  activeId,
  onSwitch,
  compact = false,
}: PersonaSwitchListProps) {
  return (
    <div className="flex flex-col gap-1" role="radiogroup" aria-label="Switch persona">
      {personas.map((p) => {
        const active = p.id === activeId;
        return (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onSwitch(p.id)}
            className={[
              'w-full flex items-center gap-3 rounded-xl border text-left transition-colors',
              compact ? 'py-2 px-2.5' : 'py-2.5 px-3',
              active ? 'bg-subtle border-border' : 'bg-transparent border-transparent hover:bg-subtle/70',
            ].join(' ')}
          >
            <Avatar persona={p} size={compact ? 'sm' : 'md'} />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-ink truncate">{p.displayName}</span>
              {!compact && (
                <span className="block text-[12px] text-ink-faint truncate leading-snug mt-0.5">
                  {p.tagline}
                </span>
              )}
            </span>
            <span
              className="shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: active ? p.color : '#d4d4d4' }}
            >
              {active && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
