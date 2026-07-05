import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { groupSessionsByDay } from '../lib/date';
import type { Persona, SessionListItem } from '../types';

interface HistoryListProps {
  sessions: SessionListItem[];
  loading: boolean;
  personaById: Record<string, Persona | undefined>;
  onNavigate?: () => void;
}

export default function HistoryList({ sessions, loading, personaById, onNavigate }: HistoryListProps) {
  const navigate = useNavigate();
  const { sessionId: activeSessionId } = useParams();
  const groups = groupSessionsByDay(sessions);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  if (loading && !sessions.length) {
    return (
      <div className="px-3 py-4 space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-4 rounded bg-panelLight/60 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!sessions.length) {
    return (
      <p className="px-3 py-4 text-[11px] text-parchment/35 font-mono leading-relaxed">
        No conversations yet — say hi to start one.
      </p>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-2 pb-3">
      {groups.map((group) => {
        const isCollapsed = collapsed[group.label];
        return (
          <div key={group.label} className="mb-1">
            <button
              type="button"
              onClick={() => setCollapsed((c) => ({ ...c, [group.label]: !c[group.label] }))}
              className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] font-mono uppercase tracking-wide text-parchment/35 hover:text-parchment/60"
            >
              {group.label}
              <span className={`transition-transform ${isCollapsed ? '-rotate-90' : ''}`}>⌄</span>
            </button>
            {!isCollapsed && (
              <ul className="flex flex-col gap-0.5">
                {group.sessions.map((session) => {
                  const persona = personaById[session.personaId];
                  const active = session.id === activeSessionId;
                  return (
                    <li key={session.id}>
                      <button
                        type="button"
                        onClick={() => {
                          navigate(`/chat/${session.id}`);
                          onNavigate?.();
                        }}
                        className={[
                          'w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors truncate',
                          active
                            ? 'bg-panelLight text-parchment'
                            : 'text-parchment/55 hover:bg-panelLight/50 hover:text-parchment/85',
                        ].join(' ')}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: persona?.color ?? '#888', opacity: active ? 1 : 0.5 }}
                        />
                        <span className="truncate">{session.title || 'Untitled chat'}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
