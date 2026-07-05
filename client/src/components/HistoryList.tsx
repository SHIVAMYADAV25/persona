import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, MessagesSquare } from 'lucide-react';
import { groupSessionsByDay, formatClockTime } from '../lib/date';
import type { Persona, SessionListItem } from '../types';

interface HistoryListProps {
  sessions: SessionListItem[];
  loading: boolean;
  personaById: Record<string, Persona | undefined>;
  onNavigate?: () => void;
  filter?: string;
}

export default function HistoryList({
  sessions,
  loading,
  personaById,
  onNavigate,
  filter = '',
}: HistoryListProps) {
  const navigate = useNavigate();
  const { sessionId: activeSessionId } = useParams();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const query = filter.trim().toLowerCase();
  const visibleSessions = query
    ? sessions.filter((s) => (s.title || 'Untitled chat').toLowerCase().includes(query))
    : sessions;
  const groups = groupSessionsByDay(visibleSessions);

  if (loading && !sessions.length) {
    return (
      <div className="px-3 py-4 space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-8 rounded-lg bg-subtle animate-pulse" />
        ))}
      </div>
    );
  }

  if (!sessions.length) {
    return (
      <div className="px-4 py-8 flex flex-col items-center gap-2 text-center">
        <MessagesSquare className="w-5 h-5 text-ink-quiet" strokeWidth={1.75} />
        <p className="text-[12.5px] text-ink-faint leading-relaxed">
          No conversations yet.
          <br />
          Say hi to start one.
        </p>
      </div>
    );
  }

  if (query && !visibleSessions.length) {
    return <p className="px-4 py-6 text-[12.5px] text-ink-faint">No chats match &ldquo;{filter}&rdquo;.</p>;
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
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-quiet hover:text-ink-soft transition-colors"
            >
              {group.label}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
                strokeWidth={2}
              />
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
                          'group w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors',
                          active ? 'bg-subtle text-ink' : 'text-ink-soft hover:bg-subtle/70 hover:text-ink',
                        ].join(' ')}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: persona?.color ?? '#a3a3a3' }}
                        />
                        <span className="truncate flex-1">{session.title || 'Untitled chat'}</span>
                        <span className="shrink-0 text-[10.5px] font-mono tabular-nums text-ink-quiet">
                          {formatClockTime(session.updatedAt)}
                        </span>
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
