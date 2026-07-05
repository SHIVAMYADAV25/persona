export type PersonaId = 'hitesh' | 'piyush';

export type ChatRole = 'user' | 'assistant';

/** A single stored/exchanged chat turn. */
export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/** Full internal config for a persona, including its system prompt. */
export interface PersonaConfig {
  id: PersonaId;
  displayName: string;
  tagline: string;
  color: string;
  systemPrompt: string;
  temperature: number;
  greeting: string;
}

/** Public-safe subset returned to the client via GET /api/personas. */
export type PersonaListItem = Omit<PersonaConfig, 'systemPrompt' | 'temperature'>;

/** Row shape for the `sessions` table. */
export interface SessionRow {
  id: string;
  persona: PersonaId;
  title?: string | null;
}

/** Row shape used for the sidebar history list. */
export interface SessionListItem {
  id: string;
  personaId: PersonaId;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionsResponseBody {
  sessions: SessionListItem[];
}

/** Row shape for the `messages` table (as read back from Postgres). */
export interface MessageRow {
  role: ChatRole;
  content: string;
  createdAt?: string;
}

export interface ChatRequestBody {
  message: string;
  personaId: PersonaId;
  sessionId?: string | null;
}

export interface ChatResponseBody {
  reply: string;
  sessionId: string;
  personaId: PersonaId;
}

export interface ApiErrorBody {
  error: string;
}

export interface HistoryResponseBody {
  messages: MessageRow[];
  personaId: PersonaId;
  title: string | null;
}

export interface PersonasResponseBody {
  personas: PersonaListItem[];
}
