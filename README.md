# AI Course Roadmap Platform

Modern, responsive platform to generate AI-powered learning roadmaps and curate YouTube references. Frontend: Next.js + Tailwind. Backend: Express + MongoDB. Auth: Firebase. AI: OpenAI. YouTube: Data API v3.

## Features
- Email & Google login (Firebase)
- AI roadmap generation (Beginner → Intermediate → Advanced)
- Topic-wise video recommendations via YouTube API
- Progress tracking with resume and course progress bar
- AI chatbot (extend using OpenAI API)
- Admin panel to review roadmaps and approve references
- Light/Dark mode, mobile-first UI

## Monorepo Structure
- app/ — Next.js frontend
- server/ — Express + MongoDB backend
- docs/ — Deployment guide

## Environment Setup
1. Create a Firebase project, enable Email/Password and Google sign-in.
2. Create a MongoDB Atlas cluster; get connection string.
3. Get an OpenAI API key.
4. Create a YouTube Data API v3 key and restrict it to your domain.
5. Copy app/.env.example and server/.env.example to .env files and fill values.

## Local Development
- Frontend
  - cd app
  - npm install
  - npm run dev
- Backend
  - cd server
  - npm install
  - npm run dev

Set NEXT_PUBLIC_API_BASE_URL to http://localhost:4000.

## Deployment
- Frontend: Vercel or Netlify
- Backend: Render, Railway, Azure App Service, or Heroku
- Use environment variables; never commit secrets

## Security Notes
- Restrict YouTube and OpenAI keys
- Verify Firebase ID tokens server-side
- Helmet, CORS configured

## Next Steps
- Wire UI buttons to backend API calls
- Add chat endpoint and UI
- Add admin auth/roles
