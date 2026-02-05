# Deployment Guide

## Prerequisites
- Node.js 18+
- Firebase project with Email/Password and Google providers
- MongoDB Atlas cluster
- OpenAI API key
- YouTube Data API v3 key

## Environment Variables
- Frontend (app/.env)
  - NEXT_PUBLIC_API_BASE_URL
  - NEXT_PUBLIC_FIREBASE_API_KEY
  - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  - NEXT_PUBLIC_FIREBASE_PROJECT_ID
  - NEXT_PUBLIC_FIREBASE_APP_ID
- Backend (server/.env)
  - PORT
  - MONGODB_URI
  - OPENAI_API_KEY
  - YOUTUBE_API_KEY
  - CORS_ORIGIN
  - FIREBASE_PROJECT_ID
  - FIREBASE_CLIENT_EMAIL
  - FIREBASE_PRIVATE_KEY

## Deploy Frontend (Vercel)
1. Import the app/ folder as a project
2. Set environment variables in Vercel dashboard
3. Build & deploy

## Deploy Backend (Render/Railway)
1. Create a new service from server/
2. Set environment vars
3. Specify start command: `npm start`

## Domain & API Restrictions
- Restrict YouTube API key to your domains
- Limit OpenAI key via organization controls

## Production Hardening
- Enable HTTPS everywhere
- Use proper CORS: set your frontend domain
- Monitor logs and errors
