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
    <div className="flex flex-col gap-1.5">
      {personas.map((p) => {
        const active = p.id === activeId;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSwitch(p.id)}
            className={[
              'w-full flex items-center gap-3 rounded-xl border px-3 text-left transition-colors',
              compact ? 'py-2' : 'py-2.5',
              active ? 'bg-panelLight' : 'bg-transparent hover:bg-panelLight/60',
            ].join(' ')}
            style={{ borderColor: active ? `${p.color}66` : 'rgba(255,255,255,0.06)' }}
          >
            <Avatar persona={p} size={compact ? 'sm' : 'md'} />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-display font-semibold text-parchment truncate">
                {p.displayName}
              </span>
              {!compact && (
                <span className="block text-[11px] text-parchment/45 truncate">{p.tagline}</span>
              )}
            </span>
            <span
              className="shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: active ? p.color : 'rgba(255,255,255,0.25)' }}
            >
              {active && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
