import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        name: 'AI System Designer API',
        version: '1.0.0',
        endpoints: {
            '/api/generate-design': {
                method: 'POST',
                description: 'Generate a system design based on prompt and context'
            }
        }
    });
});

export default router;
