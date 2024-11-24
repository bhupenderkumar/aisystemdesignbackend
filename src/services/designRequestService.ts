import { v4 as uuidv4 } from 'uuid';
import { DesignRequest } from '../models/DesignRequest';
import { UserStats } from '../models/UserStats';
import { SystemDesignResponse } from '../types';

export class DesignRequestService {
    static async createRequest(
        userId: string, 
        prompt: string, 
        context?: string,
        status: 'pending' | 'cached' = 'pending'
    ): Promise<string> {
        const requestId = uuidv4();
        
        // Create design request
        await DesignRequest.create({
            requestId,
            userId,
            prompt,
            context,
            status
        });

        // Update user stats
        await UserStats.findOneAndUpdate(
            { userId },
            {
                $inc: { totalRequests: 1 },
                $set: { lastRequestAt: new Date() },
                $push: {
                    conversations: {
                        requestId,
                        prompt,
                        timestamp: new Date()
                    }
                }
            },
            { upsert: true }
        );

        return requestId;
    }

    static async updateRequestWithResponse(
        requestId: string,
        response: SystemDesignResponse
    ): Promise<void> {
        await DesignRequest.findOneAndUpdate(
            { requestId },
            { 
                response,
                status: 'completed'
            }
        );
    }

    static async updateRequestWithError(
        requestId: string,
        error: string
    ): Promise<void> {
        await DesignRequest.findOneAndUpdate(
            { requestId },
            { 
                error,
                status: 'failed'
            }
        );
    }

    static async getUserRequests(userId: string) {
        return DesignRequest.find({ 
            userId,
            status: 'completed',
            response: { $exists: true }
        })
        .sort({ createdAt: -1 })
        .limit(50);
    }

    static async getRequestHistory(userId: string): Promise<any[]> {
        return DesignRequest.find(
            { userId },
            { requestId: 1, prompt: 1, status: 1, createdAt: 1, response: 1 }
        ).sort({ createdAt: -1 });
    }

    static async getRequestDetails(requestId: string): Promise<any> {
        return DesignRequest.findOne({ requestId });
    }

    static async getUserStats(userId: string): Promise<any> {
        return UserStats.findOne({ userId });
    }
}
