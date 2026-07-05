import type { Persona } from '../types';

interface AvatarProps {
  persona: Persona;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
};

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Avatar({ persona, size = 'md' }: AvatarProps) {
  return (
    <div
      className={`shrink-0 rounded-full flex items-center justify-center font-display font-bold ${SIZE_MAP[size]}`}
      style={{
        backgroundColor: `${persona.color}26`,
        color: persona.color,
        border: `1.5px solid ${persona.color}55`,
      }}
    >
      {initials(persona.displayName)}
    </div>
  );
}
