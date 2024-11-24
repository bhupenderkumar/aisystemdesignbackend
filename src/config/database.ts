import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

export async function connectToDatabase() {
    try {
        if (process.env.NODE_ENV === 'development') {
            // Create MongoDB Memory Server
            mongoServer = await MongoMemoryServer.create();
            const mongoUri = await mongoServer.getUri();
            
            // Set Mongoose connection options
            const mongooseOpts = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
            } as mongoose.ConnectOptions;

            console.log('Connecting to MongoDB Memory Server...');
            await mongoose.connect(mongoUri, mongooseOpts);
            console.log('Connected to MongoDB Memory Server:', mongoUri);
        } else {
            // Use regular MongoDB connection for production
            const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aisystemdesigner';
            await mongoose.connect(mongoUri);
        }

        mongoose.connection.on('error', (error) => {
            console.error('MongoDB connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        });

        // Initial connection successful
        console.log('Successfully connected to MongoDB.');

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

export async function disconnectFromDatabase() {
    try {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        
        if (process.env.NODE_ENV === 'development' && mongoServer) {
            await mongoServer.stop();
            console.log('MongoDB Memory Server stopped');
        }
        
        console.log('Disconnected from MongoDB.');
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
        throw error;
    }
}
