export interface SystemDesignResponse {
    components: Array<{
        name: string;
        type: string;
        purpose: string;
        technologies: string[];
        interactions: string[];
    }>;
    dataFlow: {
        steps: string[];
        apis: Array<{
            endpoint: string;
            method: string;
            purpose: string;
        }>;
    };
    technicalSpecs: {
        languages: string[];
        frameworks: string[];
        databases: string[];
        cache: string[];
        security: string[];
    };
    overview: {
        description: string;
        requirements: {
            functional: string[];
            nonFunctional: string[];
        };
    };
}

export interface ConversationMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}
