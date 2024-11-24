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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisConversationStorage = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
class RedisConversationStorage {
    constructor() {
        this.conversationTTL = 60 * 60 * 24; // 24 hours in seconds
        this.redis = new ioredis_1.default({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        });
        // Handle Redis connection errors
        this.redis.on('error', (err) => {
            console.error('Redis connection error:', err);
        });
        this.redis.on('connect', () => {
            console.log('Successfully connected to Redis');
        });
    }
    getKey(userId) {
        return `conversation:${userId}`;
    }
    getConversation(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const key = this.getKey(userId);
                const data = yield this.redis.get(key);
                if (!data)
                    return [];
                return JSON.parse(data);
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
                const key = this.getKey(userId);
                const conversation = yield this.getConversation(userId);
                // Keep only last 10 messages to prevent context from growing too large
                if (conversation.length >= 10) {
                    conversation.shift();
                }
                conversation.push(message);
                yield this.redis.setex(key, this.conversationTTL, JSON.stringify(conversation));
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
                const key = this.getKey(userId);
                yield this.redis.del(key);
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
                const key = this.getKey(userId);
                yield this.redis.del(key);
            }
            catch (error) {
                console.error('Error deleting conversation:', error);
                throw error;
            }
        });
    }
}
exports.RedisConversationStorage = RedisConversationStorage;
