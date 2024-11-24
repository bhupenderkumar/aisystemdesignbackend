"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const api_1 = __importDefault(require("./routes/api"));
// Load environment variables
const loadEnvFiles = () => {
    const envFiles = [
        '.env',
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env.local'
    ];
    envFiles.forEach(file => {
        dotenv_1.default.config({ path: file });
    });
};
loadEnvFiles();
const app = (0, express_1.default)();
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
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
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
app.use('/api', api_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
// Error handling
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});
app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
});
