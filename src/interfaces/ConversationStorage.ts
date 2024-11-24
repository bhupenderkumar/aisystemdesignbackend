export interface ConversationMessage {
    role: string;
    content: string;
    timestamp: Date | string;  // Support both Date objects and ISO string timestamps
}

export interface ConversationStorage {
    getConversation(userId: string): Promise<ConversationMessage[]>;
    addMessage(userId: string, message: ConversationMessage): Promise<void>;
    clearConversation(userId: string): Promise<void>;
    deleteConversation(userId: string, conversationId: string): Promise<void>;
}
