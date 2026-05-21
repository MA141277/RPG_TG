"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertExists = assertExists;
function assertExists(value, message) {
    if (value == null) {
        throw new Error(message);
    }
}
