import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Sparkle, X, Crown } from 'lucide-react';
import HistoryList from './HistoryList';
import PersonaSwitchList from './PersonaSwitchList';
import { useAppContext } from '../store/AppContext';
import type { PersonaId } from '../types';

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const navigate = useNavigate();
  const { personas, activePersonaId, setActivePersonaId, sessions, sessionsLoading } =
    useAppContext();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [proNote, setProNote] = useState(false);

  const personaById = Object.fromEntries(personas.map((p) => [p.id, p]));

  function handleNewChat(): void {
    navigate('/');
    onNavigate?.();
  }

  function handleSwitchPersona(id: PersonaId): void {
    setActivePersonaId(id);
    navigate('/');
    onNavigate?.();
  }

  function closeSearch(): void {
    setSearchOpen(false);
    setQuery('');
  }

  return (
    <aside className="w-full md:w-72 h-full flex flex-col bg-sidebar border-r border-border">
      {/* Title bar */}
      <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <Sparkle className="w-4 h-4 text-ink shrink-0" strokeWidth={2.25} />
          <h1 className="font-display font-semibold text-[15px] text-ink truncate">Persona AI</h1>
        </div>
        <button
          type="button"
          onClick={() => setSearchOpen((v) => !v)}
          aria-label="Search conversations"
          aria-pressed={searchOpen}
          className={[
            'shrink-0 rounded-md p-1.5 transition-colors',
            searchOpen ? 'bg-subtle text-ink' : 'text-ink-faint hover:bg-subtle hover:text-ink',
          ].join(' ')}
        >
          <Search className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>

      {/* New chat */}
      <div className="px-3 pt-2 pb-1">
        <button
          type="button"
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-[13.5px] font-medium bg-ink text-white hover:bg-ink-soft transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={2.25} />
          New chat
        </button>
      </div>

      {/* Search field */}
      {searchOpen && (
        <div className="px-3 pt-2 pb-1 animate-fadeIn">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-2.5 py-1.5">
            <Search className="w-3.5 h-3.5 text-ink-quiet shrink-0" strokeWidth={2} />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chats"
              className="flex-1 bg-transparent outline-none text-[13px] text-ink placeholder:text-ink-quiet"
            />
            <button
              type="button"
              onClick={closeSearch}
              aria-label="Clear search"
              className="text-ink-quiet hover:text-ink transition-colors"
            >
              <X className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>
      )}

      {/* History */}
      <div className="px-3 pt-2 pb-1">
        <p className="px-1 pb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-quiet">
          History
        </p>
      </div>

      <HistoryList
        sessions={sessions}
        loading={sessionsLoading}
        personaById={personaById}
        onNavigate={onNavigate}
        filter={query}
      />

      {/* Switch persona */}
      <div className="p-3 border-t border-border">
        <p className="px-1 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-quiet">
          Switch persona
        </p>
        <PersonaSwitchList personas={personas} activeId={activePersonaId} onSwitch={handleSwitchPersona} />
      </div>

      {/* Upgrade */}
      <div className="p-3 pt-0">
        <button
          type="button"
          onClick={() => setProNote(true)}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-[13px] font-medium border border-border bg-white text-ink hover:bg-subtle transition-colors"
        >
          <Crown className="w-3.5 h-3.5 text-hitesh" strokeWidth={2.25} />
          Upgrade to Pro
        </button>
        {proNote && (
          <p className="mt-1.5 px-1 text-[11px] text-ink-quiet animate-fadeIn">
            Pro plans aren&rsquo;t open yet — check back soon.
          </p>
        )}
      </div>
    </aside>
  );
}
