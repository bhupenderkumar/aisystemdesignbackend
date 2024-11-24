import mongoose, { Document, Schema } from 'mongoose';

interface IConversation {
    requestId: string;
    prompt: string;
    timestamp: Date;
}

interface IUserStats extends Document {
    userId: string;
    totalRequests: number;
    lastRequestAt: Date;
    conversations: IConversation[];
}

const ConversationSchema = new Schema<IConversation>({
    requestId: { type: String, required: true },
    prompt: { type: String, required: true },
    timestamp: { type: Date, required: true }
});

const UserStatsSchema = new Schema<IUserStats>({
    userId: { 
        type: String, 
        required: true, 
        unique: true,
        index: true
    },
    totalRequests: { 
        type: Number, 
        default: 0 
    },
    lastRequestAt: { 
        type: Date, 
        default: Date.now 
    },
    conversations: [ConversationSchema]
}, {
    timestamps: true
});

// Create index for efficient querying
UserStatsSchema.index({ userId: 1, lastRequestAt: -1 });

export const UserStats = mongoose.model<IUserStats>('UserStats', UserStatsSchema);
