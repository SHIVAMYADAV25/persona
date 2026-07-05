import type { Persona } from '../types';

interface AvatarProps {
  persona: Persona;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'w-7 h-7 text-[10px]',
  md: 'w-9 h-9 text-xs',
  lg: 'w-11 h-11 text-sm',
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
      className={`shrink-0 rounded-full flex items-center justify-center font-display font-semibold ring-2 ring-white ${SIZE_MAP[size]}`}
      style={{
        backgroundColor: `${persona.color}1a`,
        color: persona.color,
        boxShadow: `0 0 0 1px ${persona.color}33`,
      }}
      aria-hidden
    >
      {initials(persona.displayName)}
    </div>
  );
}
