"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomInt = randomInt;
exports.pickRandom = pickRandom;
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pickRandom(items) {
    return items[randomInt(0, items.length - 1)];
}
