"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERSONAS = void 0;
exports.getPersona = getPersona;
exports.listPersonas = listPersonas;
const hitesh_1 = require("./hitesh");
const piyush_1 = require("./piyush");
exports.PERSONAS = {
    hitesh: {
        id: 'hitesh',
        displayName: 'Hitesh Choudhary',
        tagline: 'Tech educator, focuses on practical learning and real-world coding.',
        color: '#c9762c',
        systemPrompt: hitesh_1.HITESH_SYSTEM_PROMPT,
        temperature: 0.85,
        greeting: 'Haanji! Main hoon Hitesh persona — batao, aaj kya seekhna/banana hai?',
    },
    piyush: {
        id: 'piyush',
        displayName: 'Piyush Garg',
        tagline: 'Engineering leader, shares insights on system design and scaling.',
        color: '#2c6fc9',
        systemPrompt: piyush_1.PIYUSH_SYSTEM_PROMPT,
        temperature: 0.75,
        greeting: 'Chalo bhai, seedha shuru karte hain — kis system ya project pe kaam chal raha hai?',
    },
};
function getPersona(id) {
    return exports.PERSONAS[id] ?? null;
}
function listPersonas() {
    return Object.values(exports.PERSONAS).map(({ id, displayName, tagline, color, greeting }) => ({
        id,
        displayName,
        tagline,
        color,
        greeting,
    }));
}
