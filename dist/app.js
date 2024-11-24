"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const designRoutes_1 = __importDefault(require("./routes/designRoutes"));
const app = (0, express_1.default)();
// CORS configuration that matches our working curl command
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Origin', 'x-user-id'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));
// Handle preflight requests explicitly
app.options('*', (0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/design', designRoutes_1.default);
exports.default = app;
