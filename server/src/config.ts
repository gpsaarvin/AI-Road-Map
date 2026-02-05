import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000'),
  mongoUri: process.env.MONGODB_URI || '',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  openaiKey: process.env.OPENAI_API_KEY || '',
  youtubeKey: process.env.YOUTUBE_API_KEY || '',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
  }
};
