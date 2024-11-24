import Redis from 'ioredis';
import { ConversationStorage, ConversationMessage } from '../interfaces/ConversationStorage';

export class RedisConversationStorage implements ConversationStorage {
    private redis: Redis;
    private readonly conversationTTL = 60 * 60 * 24; // 24 hours in seconds

    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD,
            retryStrategy: (times: number) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        });

        // Handle Redis connection errors
        this.redis.on('error', (err: Error) => {
            console.error('Redis connection error:', err);
        });

        this.redis.on('connect', () => {
            console.log('Successfully connected to Redis');
        });
    }

    private getKey(userId: string): string {
        return `conversation:${userId}`;
    }

    async getConversation(userId: string): Promise<ConversationMessage[]> {
        try {
            const key = this.getKey(userId);
            const data = await this.redis.get(key);
            if (!data) return [];
            return JSON.parse(data);
        } catch (error) {
            console.error('Error getting conversation:', error);
            return [];
        }
    }

    async addMessage(userId: string, message: ConversationMessage): Promise<void> {
        try {
            const key = this.getKey(userId);
            const conversation = await this.getConversation(userId);
            
            // Keep only last 10 messages to prevent context from growing too large
            if (conversation.length >= 10) {
                conversation.shift();
            }
            
            conversation.push(message);
            await this.redis.setex(key, this.conversationTTL, JSON.stringify(conversation));
        } catch (error) {
            console.error('Error adding message:', error);
            throw error;
        }
    }

    async clearConversation(userId: string): Promise<void> {
        try {
            const key = this.getKey(userId);
            await this.redis.del(key);
        } catch (error) {
            console.error('Error clearing conversation:', error);
            throw error;
        }
    }

    async deleteConversation(userId: string, conversationId: string): Promise<void> {
        try {
            const key = this.getKey(userId);
            await this.redis.del(key);
        } catch (error) {
            console.error('Error deleting conversation:', error);
            throw error;
        }
    }
}
