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
const express_rate_limit_1 = require("express-rate-limit");
const geminiService_1 = __importDefault(require("../services/geminiService"));
const router = express_1.default.Router();
// Initialize GeminiService
const geminiService = new geminiService_1.default();
// Rate limiting middleware
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
router.use(limiter);
// Middleware to ensure user ID is present
const ensureUserId = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required in x-user-id header' });
    }
    next();
};
router.post('/design/generate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { messages } = req.body;
        const userId = req.headers['x-user-id'];
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Messages array is required' });
        }
        // Get the latest user message
        const latestMessage = messages[messages.length - 1];
        if (latestMessage.role !== 'user') {
            return res.status(400).json({ error: 'Last message must be from user' });
        }
        console.log('Received request:', {
            userId,
            messages,
            headers: req.headers
        });
        // Store all messages in conversation history
        for (const message of messages) {
            yield geminiService.storage.addMessage(userId, message);
        }
        const systemDesign = yield geminiService.generateSystemDesign(userId, latestMessage.content);
        res.json({
            success: true,
            data: systemDesign
        });
    }
    catch (error) {
        console.error('Error in generate-system-design endpoint:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error'
        });
    }
}));
router.post('/design/generate-diagram', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { messages } = req.body;
        const userId = req.headers['x-user-id'];
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Messages array is required' });
        }
        // Get the latest user message
        const latestMessage = messages[messages.length - 1];
        if (latestMessage.role !== 'user') {
            return res.status(400).json({ error: 'Last message must be from user' });
        }
        // Store all messages in conversation history
        for (const message of messages) {
            yield geminiService.storage.addMessage(userId, message);
        }
        const diagram = yield geminiService.generateSystemDiagram(userId, latestMessage.content);
        res.json({
            success: true,
            data: diagram
        });
    }
    catch (error) {
        console.error('Error in generate-diagram endpoint:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error'
        });
    }
}));
router.post('/design/generate-questions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { messages } = req.body;
        const userId = req.headers['x-user-id'];
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Messages array is required' });
        }
        // Get the latest user message
        const latestMessage = messages[messages.length - 1];
        if (latestMessage.role !== 'user') {
            return res.status(400).json({ error: 'Last message must be from user' });
        }
        // Store all messages in conversation history
        for (const message of messages) {
            yield geminiService.storage.addMessage(userId, message);
        }
        const questions = yield geminiService.generateSuggestedQuestions(userId, latestMessage.content);
        res.json({
            success: true,
            data: questions
        });
    }
    catch (error) {
        console.error('Error in generate-questions endpoint:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error'
        });
    }
}));
exports.default = router;
