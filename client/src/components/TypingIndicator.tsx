import Avatar from './Avatar';
import type { Persona } from '../types';

interface TypingIndicatorProps {
  persona: Persona;
}

export default function TypingIndicator({ persona }: TypingIndicatorProps) {
  const firstName = persona.displayName.split(' ')[0];

  return (
    <div className="flex justify-start px-4 gap-3">
      <Avatar persona={persona} />
      <div className="bg-panel rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
        <span className="font-mono text-[11px] text-parchment/40">{firstName} is typing</span>
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full animate-blink"
              style={{ backgroundColor: persona.color, animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
