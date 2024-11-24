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
exports.connectToDatabase = connectToDatabase;
exports.disconnectFromDatabase = disconnectFromDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
let mongoServer;
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (process.env.NODE_ENV === 'development') {
                // Create MongoDB Memory Server
                mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
                const mongoUri = yield mongoServer.getUri();
                // Set Mongoose connection options
                const mongooseOpts = {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    serverSelectionTimeoutMS: 10000,
                    socketTimeoutMS: 45000,
                };
                console.log('Connecting to MongoDB Memory Server...');
                yield mongoose_1.default.connect(mongoUri, mongooseOpts);
                console.log('Connected to MongoDB Memory Server:', mongoUri);
            }
            else {
                // Use regular MongoDB connection for production
                const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aisystemdesigner';
                yield mongoose_1.default.connect(mongoUri);
            }
            mongoose_1.default.connection.on('error', (error) => {
                console.error('MongoDB connection error:', error);
            });
            mongoose_1.default.connection.on('disconnected', () => {
                console.log('MongoDB disconnected');
            });
            mongoose_1.default.connection.on('connected', () => {
                console.log('MongoDB connected successfully');
            });
            // Initial connection successful
            console.log('Successfully connected to MongoDB.');
        }
        catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        }
    });
}
function disconnectFromDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (mongoose_1.default.connection.readyState !== 0) {
                yield mongoose_1.default.disconnect();
            }
            if (process.env.NODE_ENV === 'development' && mongoServer) {
                yield mongoServer.stop();
                console.log('MongoDB Memory Server stopped');
            }
            console.log('Disconnected from MongoDB.');
        }
        catch (error) {
            console.error('Error disconnecting from MongoDB:', error);
            throw error;
        }
    });
}
