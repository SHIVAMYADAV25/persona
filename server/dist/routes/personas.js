"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const personas_1 = require("../personas");
const router = express_1.default.Router();
router.get('/personas', (_req, res) => {
    res.json({ personas: (0, personas_1.listPersonas)() });
});
exports.default = router;
