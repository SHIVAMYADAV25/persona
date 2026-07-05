"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_CONTEXT_MESSAGES = void 0;
exports.ensureSession = ensureSession;
exports.maybeSetSessionTitle = maybeSetSessionTitle;
exports.touchSession = touchSession;
exports.listSessions = listSessions;
exports.getRecentMessages = getRecentMessages;
exports.getSessionById = getSessionById;
exports.saveMessage = saveMessage;
const pool_1 = require("./pool");
exports.MAX_CONTEXT_MESSAGES = 16; // sliding window, see docs/CONTEXT_MANAGEMENT.md
const TITLE_MAX_LEN = 60;
async function ensureSession(sessionId, persona) {
    if (sessionId) {
        const existing = await pool_1.pool.query('SELECT id, persona, title FROM sessions WHERE id = $1', [sessionId]);
        if (existing.rows.length)
            return existing.rows[0];
    }
    const created = await pool_1.pool.query('INSERT INTO sessions (persona) VALUES ($1) RETURNING id, persona, title', [persona]);
    return created.rows[0];
}
/** Sets the session's title from the first user message, if not already set. */
async function maybeSetSessionTitle(sessionId, firstMessage) {
    const trimmed = firstMessage.trim();
    const title = trimmed.length > TITLE_MAX_LEN ? `${trimmed.slice(0, TITLE_MAX_LEN).trimEnd()}…` : trimmed;
    await pool_1.pool.query('UPDATE sessions SET title = COALESCE(title, $2) WHERE id = $1', [sessionId, title]);
}
async function touchSession(sessionId) {
    await pool_1.pool.query('UPDATE sessions SET updated_at = now() WHERE id = $1', [sessionId]);
}
/** Sessions list for the sidebar history, most-recently-active first. */
async function listSessions(persona) {
    const result = persona
        ? await pool_1.pool.query(`SELECT id, persona, title, created_at, updated_at FROM sessions
         WHERE persona = $1 AND title IS NOT NULL
         ORDER BY updated_at DESC LIMIT 200`, [persona])
        : await pool_1.pool.query(`SELECT id, persona, title, created_at, updated_at FROM sessions
         WHERE title IS NOT NULL
         ORDER BY updated_at DESC LIMIT 200`);
    return result.rows.map((row) => ({
        id: row.id,
        personaId: row.persona,
        title: row.title,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }));
}
async function getRecentMessages(sessionId, limit = exports.MAX_CONTEXT_MESSAGES) {
    const result = await pool_1.pool.query(`SELECT role, content, created_at FROM messages
     WHERE session_id = $1
     ORDER BY created_at DESC
     LIMIT $2`, [sessionId, limit]);
    return result.rows
        .map((row) => ({ role: row.role, content: row.content, createdAt: row.created_at }))
        .reverse(); // chronological order
}
async function getSessionById(sessionId) {
    const result = await pool_1.pool.query('SELECT id, persona, title FROM sessions WHERE id = $1', [sessionId]);
    return result.rows[0] ?? null;
}
async function saveMessage(sessionId, role, content) {
    await pool_1.pool.query('INSERT INTO messages (session_id, role, content) VALUES ($1, $2, $3)', [
        sessionId,
        role,
        content,
    ]);
    if (role === 'user') {
        await maybeSetSessionTitle(sessionId, content);
    }
    await touchSession(sessionId);
}
