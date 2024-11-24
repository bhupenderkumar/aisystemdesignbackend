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
const generative_ai_1 = require("@google/generative-ai");
const RedisConversationStorage_1 = require("./RedisConversationStorage");
const InMemoryConversationStorage_1 = require("./InMemoryConversationStorage");
class GeminiService {
    constructor() {
        this.maxRetries = 3;
        this.retryDelay = 1000;
        console.log('Initializing GeminiService');
        // Hardcoded API key for testing - REMOVE IN PRODUCTION
        const apiKey = 'AIzaSyAn3e6FC_voLm4LCB2PueQ5AcfiVq14onM';
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
        this.storage = process.env.NODE_ENV === 'production'
            ? new RedisConversationStorage_1.RedisConversationStorage()
            : new InMemoryConversationStorage_1.InMemoryConversationStorage();
        console.log(`Using ${process.env.NODE_ENV === 'production' ? 'Redis' : 'In-Memory'} storage`);
    }
    generatePrompt(userId, prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!prompt) {
                throw new Error('Prompt is required');
            }
            const conversation = yield this.storage.getConversation(userId);
            let contextPrompt = '';
            if (conversation.length > 0) {
                contextPrompt = conversation.map(msg => {
                    return `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`;
                }).join('\n\n');
            }
            return `You are an AI System Design expert. Generate an extremely detailed and comprehensive system design based on the requirements.
Follow these guidelines:
1. Be extremely specific and technical in your explanations
2. Provide in-depth analysis of each component and interaction
3. Include detailed code examples and configuration snippets where relevant
4. Consider all aspects: scalability, reliability, security, performance, maintainability
5. Explain design decisions and tradeoffs
6. Include specific version numbers for technologies
7. Provide monitoring, logging, and observability strategies
8. Detail deployment and DevOps considerations
9. Include error handling and fallback strategies
10. Consider data consistency and integrity measures

${contextPrompt ? `Previous Conversation:\n${contextPrompt}\n\n` : ''}
Current Request: ${prompt}

IMPORTANT: Respond with a well-structured HTML format using the following template. Make sure to provide extensive details for each section:

<div class="system-design">
    <h1 class="design-title">System Design: [Detailed Title]</h1>
    
    <section class="overview">
        <h2>Overview</h2>
        <p class="description">[Comprehensive system description including purpose, scale, and key challenges]</p>
        
        <div class="requirements">
            <h3>Requirements</h3>
            <div class="functional">
                <h4>Functional Requirements</h4>
                <ul>
                    [Exhaustive list of functional requirements with detailed explanations]
                </ul>
            </div>
            <div class="non-functional">
                <h4>Non-Functional Requirements</h4>
                <ul>
                    [Comprehensive list of non-functional requirements with specific metrics and targets]
                </ul>
            </div>
        </div>
    </section>
</div>`;
        });
    }
    retryOperation(operation) {
        return __awaiter(this, void 0, void 0, function* () {
            let lastError = null;
            for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
                try {
                    return yield operation();
                }
                catch (error) {
                    lastError = error;
                    if (attempt < this.maxRetries) {
                        yield new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
                    }
                }
            }
            throw lastError;
        });
    }
    generateSystemDesign(userId, prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!prompt) {
                throw new Error('Prompt is required');
            }
            try {
                const fullPrompt = yield this.generatePrompt(userId, prompt);
                const result = yield this.retryOperation(() => __awaiter(this, void 0, void 0, function* () {
                    const chat = this.model.startChat({
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 4096,
                        },
                    });
                    const response = yield chat.sendMessage(fullPrompt);
                    const html = response.response.text();
                    return html;
                }));
                // Add the response to conversation history
                yield this.storage.addMessage(userId, {
                    role: 'assistant',
                    content: result,
                    timestamp: new Date()
                });
                return result;
            }
            catch (error) {
                console.error('Error generating system design:', error);
                throw error;
            }
        });
    }
    generateSystemDiagram(userId, systemDesign) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!systemDesign) {
                throw new Error('System design is required');
            }
            try {
                const diagramPrompt = `Based on the following system design, create a detailed system architecture diagram using ASCII art or text-based diagram. Make it as clear and detailed as possible, showing all components, their relationships, and data flow:

${systemDesign}

IMPORTANT: Create a detailed system diagram using this format:

<div class="system-diagram">
    <h2>System Architecture Diagram</h2>
    <div class="diagram-content">
        <pre class="ascii-diagram">
            [Create a detailed ASCII art diagram showing:]
            - All major components
            - Component relationships
            - Data flow directions
            - API endpoints
            - Databases
            - Caching layers
            - Load balancers
            - User interactions
            Use ASCII characters like: 
            +---+ for components
            ---> for data flow
            [[ ]] for databases
            {{ }} for caches
            || || for load balancers
        </pre>
    </div>
    
    <div class="diagram-legend">
        <h3>Legend</h3>
        <ul>
            [List and explain each symbol used in the diagram]
        </ul>
    </div>
    
    <div class="diagram-notes">
        <h3>Key Points</h3>
        <ul>
            [List important aspects of the architecture highlighted in the diagram]
        </ul>
    </div>
</div>`;
                const result = yield this.retryOperation(() => __awaiter(this, void 0, void 0, function* () {
                    const chat = this.model.startChat({
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 4096,
                        },
                    });
                    const response = yield chat.sendMessage(diagramPrompt);
                    const html = response.response.text();
                    return html;
                }));
                yield this.storage.addMessage(userId, {
                    role: 'assistant',
                    content: result,
                    timestamp: new Date()
                });
                return result;
            }
            catch (error) {
                console.error('Error generating system diagram:', error);
                throw error;
            }
        });
    }
    generateSuggestedQuestions(userId, systemDesign) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!systemDesign) {
                throw new Error('System design is required');
            }
            try {
                const suggestionsPrompt = `Based on the following system design, generate a list of relevant follow-up questions that a user might want to ask. Focus on important aspects that could help clarify or expand the design:

${systemDesign}

IMPORTANT: Return the suggested questions in this HTML format:

<div class="suggested-questions">
    <h3>Suggested Questions</h3>
    <div class="questions-list">
        [For each question create:]
        <div class="question-item">
            <button class="question-button">
                [Question text that would help expand or clarify the design]
            </button>
            <p class="question-context">[Brief explanation of why this question is relevant]</p>
        </div>
    </div>
</div>

Guidelines for questions:
1. Focus on architectural decisions and trade-offs
2. Include questions about scalability and performance
3. Ask about security considerations
4. Consider deployment and maintenance aspects
5. Include questions about specific components or interactions
6. Ask about potential improvements or alternatives`;
                const result = yield this.retryOperation(() => __awaiter(this, void 0, void 0, function* () {
                    const chat = this.model.startChat({
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 4096,
                        },
                    });
                    const response = yield chat.sendMessage(suggestionsPrompt);
                    const html = response.response.text();
                    return html;
                }));
                yield this.storage.addMessage(userId, {
                    role: 'assistant',
                    content: result,
                    timestamp: new Date()
                });
                return result;
            }
            catch (error) {
                console.error('Error generating suggested questions:', error);
                throw error;
            }
        });
    }
    generateDesignResponse(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const latestMessage = messages[messages.length - 1];
                if (!latestMessage || latestMessage.role !== 'user') {
                    throw new Error('Invalid message format');
                }
                const prompt = yield this.generatePrompt('', latestMessage.content);
                const result = yield this.model.generateContent(prompt);
                const response = result.response;
                const text = response.text();
                const designResponse = {
                    content: text,
                    timestamp: new Date().toISOString()
                };
                return designResponse;
            }
            catch (error) {
                console.error('Error generating design response:', error);
                throw error;
            }
        });
    }
}
exports.default = GeminiService;
