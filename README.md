# AI System Designer Backend

A powerful backend service for the AI System Designer application that helps in creating and managing system designs using AI.

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB
- Redis

## Project Structure

```
aisystemdesigner-backend/
├── frontend/           # Frontend React application
├── src/               # Source files
├── routes/            # Express route controllers
├── services/          # Business logic services
├── dist/              # Compiled TypeScript output
├── public/            # Static files
└── views/             # View templates
```

## Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env.local` and update the variables:

```env
PORT=3000
MONGODB_URI=your_mongodb_uri
REDIS_URL=your_redis_url
HUGGINGFACE_API_KEY=your_api_key_here
CORS_ORIGIN=http://localhost:3000
# Add other required environment variables
```

## Important Note
⚠️ The API key in .env.local has expired. Please generate a new Gemini API key and update it in your environment variables.

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

## Development

```bash
# Run in development mode with hot reload
npm run dev
```

## Production

```bash
# Build and start the production server
npm run build
npm start
```

## Docker Deployment

The project includes Docker support for easy deployment:

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## Deployment

### Vercel Deployment

1. Install the Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Configure your environment variables in the Vercel dashboard:
   - Go to your project settings
   - Navigate to the "Environment Variables" tab
   - Add all required environment variables from your `.env.local`

4. Deploy to Vercel:
```bash
vercel
```

For production deployment:
```bash
vercel --prod
```

### Environment Variables for Vercel

Make sure to set these environment variables in your Vercel project settings:
- `MONGODB_URI`
- `REDIS_URL`
- `HUGGINGFACE_API_KEY`
- `CORS_ORIGIN`
- Any other environment variables from your `.env.local`

## Available Scripts

- `npm start`: Run the production server
- `npm run dev`: Run development server with hot reload
- `npm run build`: Build the TypeScript project
- `npm run clean`: Clean the build directory
- `npm run postinstall`: Automatically run build after install

## Dependencies

### Main Dependencies
- Express.js - Web framework
- TypeScript - Programming language
- MongoDB/Mongoose - Database
- Redis/ioredis - Caching
- Google AI - Generative AI integration
- HuggingFace - AI model inference

### Development Dependencies
- nodemon - Development server
- ts-node - TypeScript execution
- rimraf - Build cleanup
- Various TypeScript type definitions

## API Endpoints

### POST /api/generate-design

Generates a system design based on the provided prompt and context.

**Request Body:**
```json
{
    "prompt": "Design a cloud storage system",
    "context": "Optional previous conversation context"
}
```

**Response:**
```json
{
    "overview": "System overview text",
    "components": [
        {
            "name": "Component name",
            "description": "Component description",
            "icon": "Optional icon name"
        }
    ],
    "dataFlow": [
        {
            "from": "Source component",
            "to": "Target component",
            "description": "Flow description"
        }
    ],
    "technicalSpecs": {
        "spec1": "value1",
        "spec2": "value2"
    },
    "nonFunctionalRequirements": [
        "Requirement 1",
        "Requirement 2"
    ]
}
```

## Security

- Uses helmet for security headers
- Implements rate limiting
- Environment variables for sensitive data
- CORS configuration
- Input sanitization with DOMPurify

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## Troubleshooting

- Ensure all environment variables are properly set
- Check MongoDB and Redis connections
- Verify Node.js and npm versions
- Clear dist/ directory and rebuild if experiencing compilation issues

## License

[Add your license information here]
