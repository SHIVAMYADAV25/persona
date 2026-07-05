import { useNavigate } from 'react-router-dom';
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

  return (
    <aside className="w-full md:w-72 h-full flex flex-col bg-ink border-r border-white/5">
      <div className="p-3">
        <p className="font-mono text-[10px] text-parchment/30 mb-3 px-1">
          persona-ai / GenAI with JS 2026
        </p>
        <button
          type="button"
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-display font-semibold bg-parchment text-ink hover:opacity-90 transition-opacity"
        >
          <span className="text-base leading-none">+</span> New Chat
        </button>
      </div>

      <div className="px-3 pb-2">
        <p className="px-1 pb-1.5 text-[11px] font-mono uppercase tracking-wide text-parchment/35">
          History
        </p>
      </div>

      <HistoryList
        sessions={sessions}
        loading={sessionsLoading}
        personaById={personaById}
        onNavigate={onNavigate}
      />

      <div className="p-3 border-t border-white/5">
        <p className="px-1 pb-1.5 text-[11px] font-mono uppercase tracking-wide text-parchment/35 flex items-center justify-between">
          Switch Persona
        </p>
        <PersonaSwitchList personas={personas} activeId={activePersonaId} onSwitch={handleSwitchPersona} />
      </div>
    </aside>
  );
}
