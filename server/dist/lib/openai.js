"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODEL = exports.client = void 0;
const openai_1 = __importDefault(require("openai"));
if (!process.env.OPENAI_API_KEY) {
    // eslint-disable-next-line no-console
    console.warn('[openai] OPENAI_API_KEY is not set.');
}
exports.client = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY, baseURL: 'https://openrouter.ai/api/v1' });
exports.MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
