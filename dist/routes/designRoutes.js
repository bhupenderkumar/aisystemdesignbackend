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
const express_1 = __importDefault(require("express"));
const geminiService_1 = __importDefault(require("../services/geminiService"));
const router = express_1.default.Router();
const geminiService = new geminiService_1.default();
// Generate system design
router.post('/generate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) {
            return res.status(401).json({ error: 'User ID is required' });
        }
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Messages array is required' });
        }
        // Validate message format
        const isValidMessages = messages.every(msg => msg.role &&
            typeof msg.role === 'string' &&
            msg.content &&
            typeof msg.content === 'string');
        if (!isValidMessages) {
            return res.status(400).json({
                error: 'Invalid message format. Each message must have role and content.'
            });
        }
        // Process the design request
        const response = yield geminiService.generateDesignResponse(messages);
        res.json({ response });
    }
    catch (error) {
        console.error('Error processing design request:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}));
// Generate system diagram
router.post('/generate-diagram', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.headers['x-user-id'] || req.body.userId;
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Messages array is required' });
        }
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        // Store all messages in conversation history
        for (const message of messages) {
            yield geminiService.storage.addMessage(userId, message);
        }
        // Get the latest user message
        const latestMessage = messages[messages.length - 1];
        if (latestMessage.role !== 'user') {
            return res.status(400).json({ error: 'Last message must be from user' });
        }
        const diagram = yield geminiService.generateSystemDiagram(userId, latestMessage.content);
        res.json(diagram);
    }
    catch (error) {
        console.error('Error in generate-diagram endpoint:', error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : 'Failed to generate system diagram'
        });
    }
}));
// Generate suggested questions
router.post('/generate-questions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.headers['x-user-id'] || req.body.userId;
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Messages array is required' });
        }
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        // Store all messages in conversation history
        for (const message of messages) {
            yield geminiService.storage.addMessage(userId, message);
        }
        // Get the latest user message
        const latestMessage = messages[messages.length - 1];
        if (latestMessage.role !== 'user') {
            return res.status(400).json({ error: 'Last message must be from user' });
        }
        const questions = yield geminiService.generateSuggestedQuestions(userId, latestMessage.content);
        res.json(questions);
    }
    catch (error) {
        console.error('Error in generate-questions endpoint:', error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : 'Failed to generate suggested questions'
        });
    }
}));
// Delete conversation
router.delete('/conversation/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) {
            return res.status(401).json({ error: 'User ID is required' });
        }
        const conversationId = req.params.id;
        if (!conversationId) {
            return res.status(400).json({ error: 'Conversation ID is required' });
        }
        // Delete the conversation from storage
        yield geminiService.storage.deleteConversation(userId, conversationId);
        res.json({ message: 'Conversation deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting conversation:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
