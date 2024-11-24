import express, { Request, Response, NextFunction } from 'express';
import { rateLimit } from 'express-rate-limit';
import GeminiService from '../services/geminiService';

const router = express.Router();

// Initialize GeminiService
const geminiService = new GeminiService();

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

router.use(limiter);

// Middleware to ensure user ID is present
const ensureUserId = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required in x-user-id header' });
    }
    next();
};

router.post('/design/generate', async (req: Request, res: Response) => {
    try {
        const { messages } = req.body;
        const userId = req.headers['x-user-id'] as string;

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
            await geminiService.storage.addMessage(userId, message);
        }

        const systemDesign = await geminiService.generateSystemDesign(userId, latestMessage.content);
        
        res.json({ 
            success: true, 
            data: systemDesign 
        });
    } catch (error) {
        console.error('Error in generate-system-design endpoint:', error);
        res.status(500).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Internal server error' 
        });
    }
});

router.post('/design/generate-diagram', async (req: Request, res: Response) => {
    try {
        const { messages } = req.body;
        const userId = req.headers['x-user-id'] as string;

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
            await geminiService.storage.addMessage(userId, message);
        }

        const diagram = await geminiService.generateSystemDiagram(userId, latestMessage.content);
        
        res.json({ 
            success: true, 
            data: diagram 
        });
    } catch (error) {
        console.error('Error in generate-diagram endpoint:', error);
        res.status(500).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Internal server error' 
        });
    }
});

router.post('/design/generate-questions', async (req: Request, res: Response) => {
    try {
        const { messages } = req.body;
        const userId = req.headers['x-user-id'] as string;

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
            await geminiService.storage.addMessage(userId, message);
        }

        const questions = await geminiService.generateSuggestedQuestions(userId, latestMessage.content);
        
        res.json({ 
            success: true, 
            data: questions 
        });
    } catch (error) {
        console.error('Error in generate-questions endpoint:', error);
        res.status(500).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Internal server error' 
        });
    }
});

export default router;
