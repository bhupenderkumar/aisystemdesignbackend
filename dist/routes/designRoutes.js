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
        // Get userId from either header or body to match curl command
        const userId = req.headers['x-user-id'] || req.body.userId;
        const { prompt } = req.body;
        // Log request for debugging
        console.log('Headers:', req.headers);
        console.log('Body:', req.body);
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const response = yield geminiService.generateSystemDesign(userId, prompt);
        res.json(response);
    }
    catch (error) {
        console.error('Error in generate-design endpoint:', error);
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Failed to generate system design'
        });
    }
}));
exports.default = router;
