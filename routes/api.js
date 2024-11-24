const express = require('express');
const router = express.Router();
const huggingFaceService = require('../services/huggingFaceService');
const rateLimit = require('express-rate-limit');

// Rate limiting middleware
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

router.use(apiLimiter);

router.post('/generate-design', async (req, res) => {
    try {
        const { prompt, context } = req.body;
        
        // Build the complete prompt with context
        const fullPrompt = context 
            ? `Previous conversation:\n${context}\n\nNew request: ${prompt}\n\nPlease provide a detailed system design response that builds upon our previous discussion.`
            : prompt;

        const response = await huggingFaceService.generateSystemDesign(fullPrompt);
        res.json(response);
    } catch (error) {
        console.error('Error in generate-design endpoint:', error);
        res.status(500).json({
            error: 'Failed to generate system design',
            message: error.message
        });
    }
});

module.exports = router;
