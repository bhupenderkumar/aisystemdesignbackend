import express from 'express';
import GeminiService from '../services/geminiService';
import { SystemDesignResponse } from '../types';

const router = express.Router();
const geminiService = new GeminiService();

// Generate system design
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const userId = req.header('x-user-id');
    if (!userId) {
      return res.status(401).json({ error: 'User ID is required' });
    }

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Validate message format
    const isValidMessages = messages.every(msg => 
      msg.role && 
      typeof msg.role === 'string' && 
      msg.content && 
      typeof msg.content === 'string'
    );

    if (!isValidMessages) {
      return res.status(400).json({ 
        error: 'Invalid message format. Each message must have role and content.'
      });
    }

    // Process the design request
    const response = await generateDesignResponse(messages);
    
    res.json({ response });
  } catch (error) {
    console.error('Error processing design request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate system diagram
router.post('/generate-diagram', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'] as string || req.body.userId;
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Messages array is required' });
        }

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Store all messages in conversation history
        for (const message of messages) {
            await geminiService.storage.addMessage(userId, message);
        }

        // Get the latest user message
        const latestMessage = messages[messages.length - 1];
        if (latestMessage.role !== 'user') {
            return res.status(400).json({ error: 'Last message must be from user' });
        }

        const diagram = await geminiService.generateSystemDiagram(userId, latestMessage.content);
        res.json(diagram);
    } catch (error) {
        console.error('Error in generate-diagram endpoint:', error);
        res.status(500).json({ 
            error: error instanceof Error ? error.message : 'Failed to generate system diagram' 
        });
    }
});

// Generate suggested questions
router.post('/generate-questions', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'] as string || req.body.userId;
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Messages array is required' });
        }

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Store all messages in conversation history
        for (const message of messages) {
            await geminiService.storage.addMessage(userId, message);
        }

        // Get the latest user message
        const latestMessage = messages[messages.length - 1];
        if (latestMessage.role !== 'user') {
            return res.status(400).json({ error: 'Last message must be from user' });
        }

        const questions = await geminiService.generateSuggestedQuestions(userId, latestMessage.content);
        res.json(questions);
    } catch (error) {
        console.error('Error in generate-questions endpoint:', error);
        res.status(500).json({ 
            error: error instanceof Error ? error.message : 'Failed to generate suggested questions' 
        });
    }
});

// Delete conversation
router.delete('/conversation/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.header('x-user-id');
    if (!userId) {
      return res.status(401).json({ error: 'User ID is required' });
    }

    const conversationId = req.params.id;
    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID is required' });
    }

    // Delete the conversation from storage
    await geminiService.storage.deleteConversation(userId, conversationId);

    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
