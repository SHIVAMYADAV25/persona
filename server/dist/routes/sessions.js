"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const queries_1 = require("../db/queries");
const router = express_1.default.Router();
router.get('/sessions', async (req, res) => {
    try {
        const personaId = req.query.personaId;
        const sessions = await (0, queries_1.listSessions)(personaId);
        return res.json({ sessions });
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.error('[sessions] error', err);
        return res.status(500).json({ error: 'Could not load chat history' });
    }
});
exports.default = router;
