"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserId = getUserId;
exports.getConversationContext = getConversationContext;
exports.saveConversationContext = saveConversationContext;
exports.clearConversationContext = clearConversationContext;
const uuid_1 = require("uuid");
/**
 * Get the user ID from local storage or create a new one
 */
function getUserId() {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
        return storedUserId;
    }
    const newUserId = `user-${(0, uuid_1.v4)()}`;
    localStorage.setItem('userId', newUserId);
    return newUserId;
}
/**
 * Get the conversation context for a user
 */
function getConversationContext(userId) {
    const contextKey = `conversation_${userId}`;
    return localStorage.getItem(contextKey) || undefined;
}
/**
 * Save the conversation context for a user
 */
function saveConversationContext(userId, context) {
    const contextKey = `conversation_${userId}`;
    localStorage.setItem(contextKey, context);
}
/**
 * Clear the conversation context for a user
 */
function clearConversationContext(userId) {
    const contextKey = `conversation_${userId}`;
    localStorage.removeItem(contextKey);
}
