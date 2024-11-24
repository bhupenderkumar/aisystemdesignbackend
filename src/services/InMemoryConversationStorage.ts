import { ConversationStorage, ConversationMessage } from '../interfaces/ConversationStorage';

export class InMemoryConversationStorage implements ConversationStorage {
    private conversations: Map<string, ConversationMessage[]>;
    private readonly conversationTTL: number = 60 * 60 * 24 * 1000; // 24 hours in milliseconds

    constructor() {
        this.conversations = new Map();
        console.log('Initialized InMemoryConversationStorage for development');
    }

    async getConversation(userId: string): Promise<ConversationMessage[]> {
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
        } catch (error) {
            console.error('Error getting conversation:', error);
            return [];
        }
    }

    async addMessage(userId: string, message: ConversationMessage): Promise<void> {
        try {
            // Ensure timestamp is a Date object
            const messageWithDateTimestamp = {
                ...message,
                timestamp: message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp)
            };

            const conversation = await this.getConversation(userId);
            
            // Keep only last 10 messages to prevent context from growing too large
            if (conversation.length >= 10) {
                conversation.shift();
            }
            
            conversation.push(messageWithDateTimestamp);
            this.conversations.set(userId, conversation);
            
            console.log(`Added message for user ${userId}. Total messages: ${conversation.length}`);
        } catch (error) {
            console.error('Error adding message:', error);
            throw error;
        }
    }

    async clearConversation(userId: string): Promise<void> {
        try {
            this.conversations.delete(userId);
            console.log(`Cleared conversation for user ${userId}`);
        } catch (error) {
            console.error('Error clearing conversation:', error);
            throw error;
        }
    }
}
