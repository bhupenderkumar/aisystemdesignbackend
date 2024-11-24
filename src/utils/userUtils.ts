import { v4 as uuidv4 } from 'uuid';

/**
 * Get the user ID from local storage or create a new one
 */
export function getUserId(): string {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
        return storedUserId;
    }

    const newUserId = `user-${uuidv4()}`;
    localStorage.setItem('userId', newUserId);
    return newUserId;
}

/**
 * Get the conversation context for a user
 */
export function getConversationContext(userId: string): string | undefined {
    const contextKey = `conversation_${userId}`;
    return localStorage.getItem(contextKey) || undefined;
}

/**
 * Save the conversation context for a user
 */
export function saveConversationContext(userId: string, context: string): void {
    const contextKey = `conversation_${userId}`;
    localStorage.setItem(contextKey, context);
}

/**
 * Clear the conversation context for a user
 */
export function clearConversationContext(userId: string): void {
    const contextKey = `conversation_${userId}`;
    localStorage.removeItem(contextKey);
}
