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
const uuid_1 = require("uuid");
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
    generatePrompt(userId, prompt, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversation = yield this.storage.getConversation(userId);
            let contextPrompt = '';
            if (conversation.length > 0) {
                contextPrompt = conversation.map(msg => {
                    return `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`;
                }).join('\n\n');
            }
            if (context) {
                contextPrompt += `\n\nAdditional Context: ${context}\n\n`;
            }
            return `You are an AI System Design expert. Generate a detailed system design based on the requirements.
Follow these guidelines:
1. Be specific and technical in your explanations
2. Consider scalability, reliability, and security
3. Provide clear component interactions
4. Include specific technologies where relevant

${contextPrompt ? `Previous Conversation:\n${contextPrompt}\n\n` : ''}
Current Request: ${prompt}

IMPORTANT: Respond with a well-structured HTML format using the following template. Use semantic HTML tags and add appropriate CSS classes for styling:

<div class="system-design">
    <h1 class="design-title">System Design: [Title]</h1>
    
    <section class="overview">
        <h2>Overview</h2>
        <p class="description">[System description]</p>
        
        <div class="requirements">
            <h3>Requirements</h3>
            <div class="functional">
                <h4>Functional Requirements</h4>
                <ul>
                    [List functional requirements]
                </ul>
            </div>
            <div class="non-functional">
                <h4>Non-Functional Requirements</h4>
                <ul>
                    [List non-functional requirements]
                </ul>
            </div>
        </div>
    </section>

    <section class="components">
        <h2>System Components</h2>
        <div class="component-list">
            [For each component create:]
            <div class="component">
                <h3>[Component Name]</h3>
                <p class="type">Type: [Component Type]</p>
                <p class="purpose">[Component Purpose]</p>
                <div class="technologies">
                    <h4>Technologies</h4>
                    <ul>[List technologies]</ul>
                </div>
                <div class="interactions">
                    <h4>Interactions</h4>
                    <ul>[List interactions]</ul>
                </div>
            </div>
        </div>
    </section>

    <section class="data-flow">
        <h2>Data Flow</h2>
        <div class="steps">
            <h3>Process Steps</h3>
            <ol>[List steps]</ol>
        </div>
        <div class="apis">
            <h3>API Endpoints</h3>
            <div class="api-list">
                [For each API create:]
                <div class="api-endpoint">
                    <code>[HTTP Method] [Endpoint]</code>
                    <p>[Purpose]</p>
                </div>
            </div>
        </div>
    </section>

    <section class="technical-specs">
        <h2>Technical Specifications</h2>
        <div class="specs-grid">
            <div class="spec">
                <h3>Languages</h3>
                <ul>[List languages]</ul>
            </div>
            <div class="spec">
                <h3>Frameworks</h3>
                <ul>[List frameworks]</ul>
            </div>
            <div class="spec">
                <h3>Databases</h3>
                <ul>[List databases]</ul>
            </div>
            <div class="spec">
                <h3>Caching</h3>
                <ul>[List caching solutions]</ul>
            </div>
            <div class="spec">
                <h3>Security Measures</h3>
                <ul>[List security measures]</ul>
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
                    console.error(`Attempt ${attempt} failed:`, error);
                    lastError = error;
                    if (attempt < this.maxRetries) {
                        yield new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
                    }
                }
            }
            throw lastError || new Error('Operation failed after retries');
        });
    }
    generateSystemDesign(userId, prompt, context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId) {
                    userId = (0, uuid_1.v4)();
                    console.log('Generated new userId:', userId);
                }
                console.log('Generating design with context:', { userId, prompt, context });
                const fullPrompt = yield this.generatePrompt(userId, prompt, context);
                console.log('Generated prompt:', fullPrompt);
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
                    console.log('Raw response from Gemini:', html);
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
                console.error('Error generating system design:', error);
                throw error;
            }
        });
    }
}
exports.default = GeminiService;
