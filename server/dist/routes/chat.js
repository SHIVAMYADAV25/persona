"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const personas_1 = require("../personas");
const queries_1 = require("../db/queries");
const openai_1 = require("../lib/openai");
const router = express_1.default.Router();
// naive per-IP rate limit so a demo deployment doesn't get hammered
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;
const hits = new Map();
function rateLimited(ip) {
    const now = Date.now();
    const entry = hits.get(ip) ?? { count: 0, windowStart: now };
    if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
        entry.count = 0;
        entry.windowStart = now;
    }
    entry.count += 1;
    hits.set(ip, entry);
    return entry.count > RATE_LIMIT_MAX;
}
router.post('/chat', async (req, res) => {
    try {
        const forwardedFor = req.headers['x-forwarded-for'];
        const ip = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor) ||
            req.socket.remoteAddress ||
            'unknown';
        if (rateLimited(String(ip))) {
            return res.status(429).json({ error: 'Too many requests, thoda ruk ke try karo.' });
        }
        const { message, personaId, sessionId } = req.body ?? {};
        if (!message || typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({ error: 'message is required' });
        }
        const persona = (0, personas_1.getPersona)(personaId);
        if (!persona) {
            return res.status(400).json({ error: 'Unknown or missing personaId' });
        }
        if (message.length > 4000) {
            return res.status(400).json({ error: 'Message too long (max 4000 chars).' });
        }
        const session = await (0, queries_1.ensureSession)(sessionId, persona.id);
        // Context management: sliding window of recent turns pulled from Neon.
        // See docs/CONTEXT_MANAGEMENT.md for the reasoning/trade-offs.
        const history = await (0, queries_1.getRecentMessages)(session.id);
        const chatMessages = [
            { role: 'system', content: persona.systemPrompt },
            ...history.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: message.trim() },
        ];
        const completion = await openai_1.client.chat.completions.create({
            model: openai_1.MODEL,
            messages: chatMessages,
            temperature: persona.temperature,
            // max_tokens: 700,
            presence_penalty: 0.2,
        });
        const reply = completion.choices[0]?.message?.content?.trim();
        if (!reply) {
            return res.status(502).json({ error: 'No response from model' });
        }
        await (0, queries_1.saveMessage)(session.id, 'user', message.trim());
        await (0, queries_1.saveMessage)(session.id, 'assistant', reply);
        return res.json({ reply, sessionId: session.id, personaId: persona.id });
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.error('[chat] error', err);
        return res.status(500).json({ error: 'Something went wrong generating a reply.' });
    }
});
router.get('/chat/:sessionId/history', async (req, res) => {
    try {
        const session = await (0, queries_1.getSessionById)(req.params.sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        const history = await (0, queries_1.getRecentMessages)(req.params.sessionId, 100);
        return res.json({ messages: history, personaId: session.persona, title: session.title ?? null });
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.error('[history] error', err);
        return res.status(500).json({ error: 'Could not load history' });
    }
});
exports.default = router;
