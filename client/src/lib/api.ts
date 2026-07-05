import type {
  ApiErrorBody,
  HistoryResult,
  Persona,
  PersonaId,
  SendMessageParams,
  SendMessageResult,
  SessionListItem,
} from '../types';

const BASE = '/api';

export async function fetchPersonas(): Promise<Persona[]> {
  const res = await fetch(`${BASE}/personas`);
  if (!res.ok) throw new Error('Failed to load personas');
  const data = (await res.json()) as { personas: Persona[] };
  return data.personas;
}

export async function fetchSessions(personaId?: PersonaId): Promise<SessionListItem[]> {
  const qs = personaId ? `?personaId=${personaId}` : '';
  const res = await fetch(`${BASE}/sessions${qs}`);
  if (!res.ok) throw new Error('Failed to load chat history');
  const data = (await res.json()) as { sessions: SessionListItem[] };
  return data.sessions;
}

export async function fetchHistory(sessionId: string): Promise<HistoryResult> {
  const res = await fetch(`${BASE}/chat/${sessionId}/history`);
  if (!res.ok) throw new Error('Failed to load this conversation');
  return (await res.json()) as HistoryResult;
}

export async function sendMessage({
  message,
  personaId,
  sessionId,
}: SendMessageParams): Promise<SendMessageResult> {
  const res = await fetch(`${BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, personaId, sessionId }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as Partial<ApiErrorBody>;
    throw new Error(err.error || 'Failed to send message');
  }
  return (await res.json()) as SendMessageResult;
}
