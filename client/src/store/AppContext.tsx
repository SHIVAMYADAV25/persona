import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { fetchPersonas, fetchSessions } from '../lib/api';
import type { Persona, PersonaId, SessionListItem } from '../types';

const FALLBACK_PERSONAS: Persona[] = [
  {
    id: 'hitesh',
    displayName: 'Hitesh Choudhary',
    tagline: 'Tech educator, focuses on practical learning and real-world coding.',
    color: '#c9762c',
    greeting: 'Haanji! Batao, aaj kya seekhna/banana hai?',
  },
  {
    id: 'piyush',
    displayName: 'Piyush Garg',
    tagline: 'Engineering leader, shares insights on system design and scaling.',
    color: '#3d7fd6',
    greeting: 'Chalo bhai, seedha shuru karte hain — kis project pe kaam chal raha hai?',
  },
];

const ACTIVE_PERSONA_KEY = 'persona-ai-active-persona';

interface AppContextValue {
  personas: Persona[];
  activePersonaId: PersonaId;
  activePersona: Persona;
  setActivePersonaId: (id: PersonaId) => void;
  sessions: SessionListItem[];
  sessionsLoading: boolean;
  refreshSessions: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [personas, setPersonas] = useState<Persona[]>(FALLBACK_PERSONAS);
  const [activePersonaId, setActivePersonaIdState] = useState<PersonaId>(() => {
    const stored = localStorage.getItem(ACTIVE_PERSONA_KEY);
    return stored === 'piyush' || stored === 'hitesh' ? stored : 'hitesh';
  });
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPersonas()
      .then((list) => list.length && setPersonas(list))
      .catch(() => {
        /* keep bundled fallback metadata */
      });
  }, []);

  const refreshSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const list = await fetchSessions();
      setSessions(list);
    } catch {
      // keep whatever we already had; sidebar will just show what's cached
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  const setActivePersonaId = useCallback((id: PersonaId) => {
    setActivePersonaIdState(id);
    localStorage.setItem(ACTIVE_PERSONA_KEY, id);
  }, []);

  const activePersona = useMemo(
    () => personas.find((p) => p.id === activePersonaId) ?? personas[0],
    [personas, activePersonaId]
  );

  const value: AppContextValue = {
    personas,
    activePersonaId,
    activePersona,
    setActivePersonaId,
    sessions,
    sessionsLoading,
    refreshSessions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
