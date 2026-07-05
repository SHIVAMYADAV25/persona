"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pool_1 = require("./pool");
async function migrate() {
    const sql = fs_1.default.readFileSync(path_1.default.join(__dirname, 'schema.sql'), 'utf8');
    await pool_1.pool.query(sql);
    // eslint-disable-next-line no-console
    console.log('Migration applied successfully.');
    await pool_1.pool.end();
}
migrate().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Migration failed:', err);
    process.exit(1);
});
