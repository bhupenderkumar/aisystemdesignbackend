import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import designRoutes from './routes/designRoutes';

const app = express();

// CORS configuration that matches our working curl command
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Origin', 'x-user-id'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Handle preflight requests explicitly
app.options('*', cors());

app.use(express.json());
app.use('/api/design', designRoutes);

export default app;
