"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
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
exports.default = router;
