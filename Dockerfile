# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Copy environment files
COPY .env* ./

# Add Redis
RUN apk add --no-cache redis

# Create a directory for Redis data
RUN mkdir -p /data/redis

# Copy the Redis configuration file (if you have one)
# COPY redis.conf /etc/redis/redis.conf

# Expose ports
EXPOSE 3001 6379

# Create start script
RUN echo '#!/bin/sh\nredis-server --daemonize yes && npm start' > start.sh
RUN chmod +x start.sh

# Start both Redis and Node.js application
CMD ["./start.sh"]
