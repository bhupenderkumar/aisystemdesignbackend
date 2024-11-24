"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryConversationStorage = void 0;
class InMemoryConversationStorage {
    constructor() {
        this.conversationTTL = 60 * 60 * 24 * 1000; // 24 hours in milliseconds
        this.conversations = new Map();
        console.log('Initialized InMemoryConversationStorage for development');
    }
    getConversation(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversation = this.conversations.get(userId) || [];
                // Filter out expired messages
                const now = Date.now();
                const validMessages = conversation.filter(msg => {
                    const timestamp = msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp);
                    return (now - timestamp.getTime()) < this.conversationTTL;
                });
                // Update the conversation if we removed expired messages
                if (validMessages.length !== conversation.length) {
                    this.conversations.set(userId, validMessages);
                }
                return validMessages;
            }
            catch (error) {
                console.error('Error getting conversation:', error);
                return [];
            }
        });
    }
    addMessage(userId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Ensure timestamp is a Date object
                const messageWithDateTimestamp = Object.assign(Object.assign({}, message), { timestamp: message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp) });
                const conversation = yield this.getConversation(userId);
                // Keep only last 10 messages to prevent context from growing too large
                if (conversation.length >= 10) {
                    conversation.shift();
                }
                conversation.push(messageWithDateTimestamp);
                this.conversations.set(userId, conversation);
                console.log(`Added message for user ${userId}. Total messages: ${conversation.length}`);
            }
            catch (error) {
                console.error('Error adding message:', error);
                throw error;
            }
        });
    }
    clearConversation(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.conversations.delete(userId);
                console.log(`Cleared conversation for user ${userId}`);
            }
            catch (error) {
                console.error('Error clearing conversation:', error);
                throw error;
            }
        });
    }
    deleteConversation(userId, conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // For in-memory storage, we'll just clear the conversation
                yield this.clearConversation(userId);
            }
            catch (error) {
                console.error('Error deleting conversation:', error);
                throw error;
            }
        });
    }
}
exports.InMemoryConversationStorage = InMemoryConversationStorage;
