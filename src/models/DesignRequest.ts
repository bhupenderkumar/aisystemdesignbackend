import mongoose, { Document, Schema } from 'mongoose';
import { SystemDesignResponse } from '../types';

interface IDesignRequest extends Document {
    requestId: string;
    userId: string;
    prompt: string;
    context?: string;
    response?: SystemDesignResponse;
    error?: string;
    status: 'pending' | 'completed' | 'failed' | 'cached';
    createdAt: Date;
    updatedAt: Date;
}

const DesignRequestSchema = new Schema<IDesignRequest>({
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
        type: Schema.Types.Mixed 
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
DesignRequestSchema.pre('save', function(next) {
    if (!this.prompt || this.prompt.trim().length === 0) {
        next(new Error('Prompt is required'));
    }
    next();
});

// Add error handling middleware
DesignRequestSchema.post('save', function(error: any, doc: any, next: any) {
    if (error.name === 'ValidationError') {
        console.error('Validation Error:', error);
        next(new Error('Invalid request data'));
    } else {
        next(error);
    }
});

export const DesignRequest = mongoose.model<IDesignRequest>('DesignRequest', DesignRequestSchema);
