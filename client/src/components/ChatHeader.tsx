import { useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';
import PersonaSwitchList from './PersonaSwitchList';
import type { ChatMessage, Persona, PersonaId } from '../types';

interface ChatHeaderProps {
  persona: Persona;
  personas: Persona[];
  onSwitchPersona: (id: PersonaId) => void;
  onReset: () => void;
  messages: ChatMessage[];
  onMenuToggle?: () => void;
}

export default function ChatHeader({
  persona,
  personas,
  onSwitchPersona,
  onReset,
  messages,
  onMenuToggle,
}: ChatHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent): void {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleCopySession(): Promise<void> {
    const text = messages
      .map((m) => `${m.role === 'user' ? 'You' : persona.displayName}: ${m.content}`)
      .join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard may be unavailable; silently ignore */
    }
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-panel border-b border-white/5 relative">
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={onMenuToggle}
          className="md:hidden mr-1 text-parchment/60 hover:text-parchment"
          aria-label="Open sidebar"
        >
          ☰
        </button>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 min-w-0"
          >
            <Avatar persona={persona} size="sm" />
            <span className="font-display font-semibold text-parchment text-sm truncate">
              Chat with {persona.displayName}
            </span>
            <span className="text-parchment/40 text-xs">⌄</span>
          </button>

          {menuOpen && (
            <div className="absolute left-0 top-full mt-2 w-72 rounded-xl border border-white/10 bg-panel shadow-2xl p-3 z-20">
              <p className="px-1 pb-2 text-[11px] font-mono uppercase tracking-wide text-parchment/35">
                Switch persona
              </p>
              <PersonaSwitchList
                personas={personas}
                activeId={persona.id}
                onSwitch={(id) => {
                  onSwitchPersona(id);
                  setMenuOpen(false);
                }}
                compact
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleCopySession}
          disabled={!messages.length}
          className="font-mono text-[10px] text-parchment/40 hover:text-parchment/80 border border-white/10 rounded-md px-2.5 py-1.5 transition-colors disabled:opacity-30"
        >
          {copied ? 'copied ✓' : 'copy session'}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="font-mono text-[10px] text-parchment/40 hover:text-parchment/80 border border-white/10 rounded-md px-2.5 py-1.5 transition-colors"
        >
          new chat
        </button>
      </div>
    </div>
  );
}
