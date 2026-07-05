"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
if (!process.env.DATABASE_URL) {
    // eslint-disable-next-line no-console
    console.warn('[db] DATABASE_URL is not set. Set it to your Neon connection string (with ?sslmode=require).');
}
exports.pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('sslmode=require')
        ? { rejectUnauthorized: false }
        : undefined,
    max: 5,
});
