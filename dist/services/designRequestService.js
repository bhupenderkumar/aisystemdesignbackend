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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesignRequestService = void 0;
const uuid_1 = require("uuid");
const DesignRequest_1 = require("../models/DesignRequest");
const UserStats_1 = require("../models/UserStats");
class DesignRequestService {
    static createRequest(userId_1, prompt_1, context_1) {
        return __awaiter(this, arguments, void 0, function* (userId, prompt, context, status = 'pending') {
            const requestId = (0, uuid_1.v4)();
            // Create design request
            yield DesignRequest_1.DesignRequest.create({
                requestId,
                userId,
                prompt,
                context,
                status
            });
            // Update user stats
            yield UserStats_1.UserStats.findOneAndUpdate({ userId }, {
                $inc: { totalRequests: 1 },
                $set: { lastRequestAt: new Date() },
                $push: {
                    conversations: {
                        requestId,
                        prompt,
                        timestamp: new Date()
                    }
                }
            }, { upsert: true });
            return requestId;
        });
    }
    static updateRequestWithResponse(requestId, response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield DesignRequest_1.DesignRequest.findOneAndUpdate({ requestId }, {
                response,
                status: 'completed'
            });
        });
    }
    static updateRequestWithError(requestId, error) {
        return __awaiter(this, void 0, void 0, function* () {
            yield DesignRequest_1.DesignRequest.findOneAndUpdate({ requestId }, {
                error,
                status: 'failed'
            });
        });
    }
    static getUserRequests(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return DesignRequest_1.DesignRequest.find({
                userId,
                status: 'completed',
                response: { $exists: true }
            })
                .sort({ createdAt: -1 })
                .limit(50);
        });
    }
    static getRequestHistory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return DesignRequest_1.DesignRequest.find({ userId }, { requestId: 1, prompt: 1, status: 1, createdAt: 1, response: 1 }).sort({ createdAt: -1 });
        });
    }
    static getRequestDetails(requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            return DesignRequest_1.DesignRequest.findOne({ requestId });
        });
    }
    static getUserStats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return UserStats_1.UserStats.findOne({ userId });
        });
    }
}
exports.DesignRequestService = DesignRequestService;
