import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import apiRouter from './routes/api';

// Load environment variables
const loadEnvFiles = () => {
    const envFiles = [
        '.env',
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env.local'
    ];

    envFiles.forEach(file => {
        dotenv.config({ path: file });
    });
};

loadEnvFiles();

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'x-user-id'
    ],
    credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Request logging in development
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`, {
            body: req.body,
            headers: req.headers,
            query: req.query
        });
        next();
    });
}

// Routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
});
