import express, { Request, Response, Router } from 'express';
import { listSessions } from '../db/queries';
import type { ApiErrorBody, PersonaId, SessionsResponseBody } from '../types';

const router: Router = express.Router();

router.get(
  '/sessions',
  async (
    req: Request<unknown, SessionsResponseBody | ApiErrorBody, unknown, { personaId?: PersonaId }>,
    res: Response<SessionsResponseBody | ApiErrorBody>
  ) => {
    try {
      const personaId = req.query.personaId;
      const sessions = await listSessions(personaId);
      return res.json({ sessions });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[sessions] error', err);
      return res.status(500).json({ error: 'Could not load chat history' });
    }
  }
);

export default router;
