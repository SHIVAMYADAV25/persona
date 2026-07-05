"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const app = (0, app_1.createApp)();
const PORT = Number(process.env.PORT) || 8787;
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Persona AI server listening on http://localhost:${PORT}`);
});
