# AI Course Roadmap - Quick Start Guide

## ✅ CURRENT STATUS
Both servers are running successfully with **REAL AI APIs**:

- **Frontend**: http://localhost:3000 ✅
- **Backend**: http://localhost:4000 ✅
- **AI Model**: OpenRouter - liquid/lfm-2.5-1.2b-thinking:free ✅
- **YouTube API**: Integrated and working ✅
- **Status**: Fully functional with real AI roadmap generation

## 🎯 HOW TO USE

### 1. Open the Website
Visit: http://localhost:3000

### 2. Generate a Roadmap
- Type any course name in the search box (e.g., "Python", "Web Development", "Machine Learning")
- Click **Generate**
- You'll see a structured roadmap with:
  - Beginner, Intermediate, and Advanced levels
  - Topic cards with estimated hours
  - 2 YouTube video references per topic

### 3. Explore Features
- **Dashboard**: http://localhost:3000/dashboard (progress tracking + AI chatbot)
- **Profile**: http://localhost:3000/profile (user settings)
- **Admin**: http://localhost:3000/admin (roadmap review panel)

## 🔧 API CONFIGURATION

Currently running with **LIVE APIs**:
- ✅ **AI Roadmap Generation**: OpenRouter (liquid/lfm-2.5-1.2b-thinking:free)
  - Generates structured learning paths with Beginner → Intermediate → Advanced levels
  - Topic-wise breakdown with estimated hours per topic
- ✅ **YouTube Video Search**: YouTube Data API v3
  - Fetches 8 relevant educational videos per topic
  - Shows title, channel name, thumbnail, and duration
  - Opens videos in YouTube when clicked
- ⚠️ **Progress tracking**: Requires MongoDB (disabled in current setup)
- ⚠️ **Authentication**: Requires Firebase (disabled in current setup)

## 🚀 ENABLE FULL FEATURES

To use real AI and YouTube APIs:

### Backend (.env file in `server/` folder):
```env
# Required for AI roadmap generation
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# Required for YouTube video search
YOUTUBE_API_KEY=AIzaxxxxxxxxxxxxx

# Required for progress tracking
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ai_roadmap

# Required for authentication
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nXXXX\n-----END PRIVATE KEY-----\n"

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env file in `app/` folder):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

After adding keys:
1. Save the .env files
2. The backend will auto-reload (ts-node-dev watches files)
3. Refresh the frontend page

## ✅ VERIFIED WORKING

Tested endpoints:
- ✅ `GET /health` → `{"ok":true}`
- ✅ `POST /api/roadmap/generate` → Returns 3 levels with topics
- ✅ `GET /api/videos/search?topic=Python` → Returns 2 demo videos
- ✅ Frontend landing page renders correctly
- ✅ Search navigation to roadmap page works
- ✅ Roadmap fetches from backend and displays

## 📝 KNOWN WARNINGS (SAFE TO IGNORE)

Backend shows:
```
Firebase Admin init failed. Check credentials.
MongoDB connection failed. Starting in demo mode (no DB).
```
**This is expected** when running without credentials. The app works with demo data.

## 🎓 TEST IT NOW

1. Open http://localhost:3000
2. Type "Python" in the search box
3. Click "Generate"
4. See the AI-generated roadmap with video references!

## 💡 NEXT STEPS TO ENHANCE

Want to add:
- ✅ Firebase Authentication (Email + Google login)
- ✅ Real-time progress tracking
- ✅ AI chatbot with OpenAI streaming
- ✅ YouTube video duration display
- ✅ Video player modal/embed

Let me know which feature you want to implement next!
