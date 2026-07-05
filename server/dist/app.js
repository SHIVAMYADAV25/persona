"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const chat_1 = __importDefault(require("./routes/chat"));
const personas_1 = __importDefault(require("./routes/personas"));
const sessions_1 = __importDefault(require("./routes/sessions"));
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json({ limit: '1mb' }));
    app.get('/api/health', (_req, res) => res.json({ ok: true }));
    app.use('/api', personas_1.default);
    app.use('/api', chat_1.default);
    app.use('/api', sessions_1.default);
    return app;
}
