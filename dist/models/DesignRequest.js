"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesignRequest = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const DesignRequestSchema = new mongoose_1.Schema({
    requestId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    prompt: {
        type: String,
        required: true,
        trim: true
    },
    context: {
        type: String,
        trim: true
    },
    response: {
        type: mongoose_1.Schema.Types.Mixed
    },
    error: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'cached'],
        default: 'pending',
        required: true
    }
}, {
    timestamps: true
});
// Create compound indexes for efficient querying
DesignRequestSchema.index({ userId: 1, createdAt: -1 });
DesignRequestSchema.index({ requestId: 1, userId: 1 });
// Add some basic validation
DesignRequestSchema.pre('save', function (next) {
    if (!this.prompt || this.prompt.trim().length === 0) {
        next(new Error('Prompt is required'));
    }
    next();
});
// Add error handling middleware
DesignRequestSchema.post('save', function (error, doc, next) {
    if (error.name === 'ValidationError') {
        console.error('Validation Error:', error);
        next(new Error('Invalid request data'));
    }
    else {
        next(error);
    }
});
exports.DesignRequest = mongoose_1.default.model('DesignRequest', DesignRequestSchema);
