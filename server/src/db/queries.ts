import { pool } from './pool';
import type { MessageRow, PersonaId, SessionListItem, SessionRow, ChatRole } from '../types';

export const MAX_CONTEXT_MESSAGES = 16; // sliding window, see docs/CONTEXT_MANAGEMENT.md
const TITLE_MAX_LEN = 60;

export async function ensureSession(
  sessionId: string | null | undefined,
  persona: PersonaId
): Promise<SessionRow> {
  if (sessionId) {
    const existing = await pool.query<SessionRow>(
      'SELECT id, persona, title FROM sessions WHERE id = $1',
      [sessionId]
    );
    if (existing.rows.length) return existing.rows[0];
  }
  const created = await pool.query<SessionRow>(
    'INSERT INTO sessions (persona) VALUES ($1) RETURNING id, persona, title',
    [persona]
  );
  return created.rows[0];
}

/** Sets the session's title from the first user message, if not already set. */
export async function maybeSetSessionTitle(sessionId: string, firstMessage: string): Promise<void> {
  const trimmed = firstMessage.trim();
  const title =
    trimmed.length > TITLE_MAX_LEN ? `${trimmed.slice(0, TITLE_MAX_LEN).trimEnd()}…` : trimmed;
  await pool.query(
    'UPDATE sessions SET title = COALESCE(title, $2) WHERE id = $1',
    [sessionId, title]
  );
}

export async function touchSession(sessionId: string): Promise<void> {
  await pool.query('UPDATE sessions SET updated_at = now() WHERE id = $1', [sessionId]);
}

/** Sessions list for the sidebar history, most-recently-active first. */
export async function listSessions(persona?: PersonaId): Promise<SessionListItem[]> {
  const result = persona
    ? await pool.query(
        `SELECT id, persona, title, created_at, updated_at FROM sessions
         WHERE persona = $1 AND title IS NOT NULL
         ORDER BY updated_at DESC LIMIT 200`,
        [persona]
      )
    : await pool.query(
        `SELECT id, persona, title, created_at, updated_at FROM sessions
         WHERE title IS NOT NULL
         ORDER BY updated_at DESC LIMIT 200`
      );

  return result.rows.map(
    (row): SessionListItem => ({
      id: row.id,
      personaId: row.persona,
      title: row.title,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })
  );
}

export async function getRecentMessages(
  sessionId: string,
  limit: number = MAX_CONTEXT_MESSAGES
): Promise<MessageRow[]> {
  const result = await pool.query(
    `SELECT role, content, created_at FROM messages
     WHERE session_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [sessionId, limit]
  );
  return result.rows
    .map((row): MessageRow => ({ role: row.role, content: row.content, createdAt: row.created_at }))
    .reverse(); // chronological order
}

export async function getSessionById(sessionId: string): Promise<SessionRow | null> {
  const result = await pool.query<SessionRow>(
    'SELECT id, persona, title FROM sessions WHERE id = $1',
    [sessionId]
  );
  return result.rows[0] ?? null;
}

export async function saveMessage(
  sessionId: string,
  role: ChatRole,
  content: string
): Promise<void> {
  await pool.query('INSERT INTO messages (session_id, role, content) VALUES ($1, $2, $3)', [
    sessionId,
    role,
    content,
  ]);
  if (role === 'user') {
    await maybeSetSessionTitle(sessionId, content);
  }
  await touchSession(sessionId);
}
