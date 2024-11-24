export interface SystemDesignResponse {
    overview: {
        description: string;
        objectives: string[];
        users: string;
        scale: string;
    };
    components: Array<{
        name: string;
        type: string;
        purpose: string;
        characteristics: string[];
        technologies: string[];
        interactions: string[];
        icon?: string;
    }>;
    dataFlow: {
        steps: string[];
        apis: Array<{
            endpoint: string;
            purpose: string;
            method: string;
        }>;
        patterns: string[];
    };
    technicalSpecs: {
        languages: string[];
        frameworks: string[];
        databases: string[];
        cache: string[];
        messageQueues: string[];
        loadBalancers: string[];
        cdn: string;
        icon?: string;
    };
    nonFunctionalReqs: {
        scalability: string[];
        security: string[];
        performance: string[];
        reliability: string[];
        consistency: string;
    };
    designDecisions: Array<{
        decision: string;
        rationale: string;
        tradeoffs: string[];
        alternatives: string[];
    }>;
    assumptions: Array<{
        category: string;
        details: string[];
    }>;
}
