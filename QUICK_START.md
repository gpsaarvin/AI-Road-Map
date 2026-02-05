# 🚀 Quick Start Guide - YouTube Video Fix

Get your YouTube videos working in **5 minutes**!

---

## ⚡ Super Quick Start

```bash
# 1. Install dependencies (if not done)
cd server && npm install
cd ../app && npm install
cd ..

# 2. Start backend
cd server
npm run dev
# Keep this terminal open

# 3. Start frontend (new terminal)
cd app
npm run dev
# Keep this terminal open

# 4. Open browser
# Navigate to: http://localhost:3000
# Click any course and see videos! ✨
```

---

## 📋 Step-by-Step Guide

### Step 1: Verify Files Were Updated ✅

These files should have the new code:
- ✅ `server/src/services/youtube.ts`
- ✅ `server/src/routes/videos.ts`
- ✅ `app/src/components/VideoCard.tsx`
- ✅ `app/src/app/roadmap/[courseId]/page.tsx`

### Step 2: Check Environment Variables

**File:** `server/.env`

**Minimum required:**
```env
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

**Optional (but recommended):**
```env
YOUTUBE_API_KEY=your_youtube_api_key_here
```

> **Note:** App works without YouTube API key using demo videos!

### Step 3: Start Backend Server

```bash
cd server
npm install  # Only needed once
npm run dev
```

**Expected output:**
```
Server running on http://localhost:4000
MongoDB connected (or warning if not configured)
```

**Verify it's working:**
```bash
# In another terminal
curl http://localhost:4000/health
# Should return: {"ok":true}
```

### Step 4: Start Frontend

```bash
cd app
npm install  # Only needed once
npm run dev
```

**Expected output:**
```
- ready started server on 0.0.0.0:3000
- Local:        http://localhost:3000
```

### Step 5: Test It!

1. **Open browser:** `http://localhost:3000`
2. **Click any course** (e.g., "JavaScript", "Python")
3. **Scroll down** to see video sections
4. **Verify you see:**
   - ✅ Video thumbnails (not gray boxes)
   - ✅ YouTube badge on top-left
   - ✅ Play button on hover
   - ✅ Duration badge (10:00)

5. **Click a video:**
   - ✅ Should open YouTube in new tab
   - ✅ Correct video should play

### Step 6: Check Console Logs

**Backend Terminal (server):**
```
[YouTube Service] Searching videos for topic: "javascript"
[YouTube Service] Found 8 videos
[Video Route] Returning 8 videos
```

**Browser Console (F12):**
```
[Roadmap] Videos for "JavaScript Basics": {videos: Array(3)}
[VideoCard] Thumbnail loaded successfully for: "JS Tutorial"
```

---

## 🎉 Success! What You Should See

### Video Card Appearance:

```
┌─────────────────────────────┐
│  [YouTube]         [10:00]  │ ← Badges
│                             │
│   [Thumbnail Image]         │ ← Actual YouTube thumbnail
│                             │
│      [▶️ Play]               │ ← Shows on hover
└─────────────────────────────┘
│ 📹 JavaScript Tutorial      │ ← Title
│ 👤 Code Academy             │ ← Channel
└─────────────────────────────┘
```

### If It's Working:
- ✅ You see real YouTube thumbnails
- ✅ Videos open when clicked
- ✅ Console shows successful logs
- ✅ No red errors in console

### If It's Not Working:
- ❌ See troubleshooting section below

---

## 🔧 Troubleshooting

### Problem 1: "Cannot GET /api/videos/search"

**Cause:** Backend not running

**Fix:**
```bash
cd server
npm run dev
```

### Problem 2: Gray boxes instead of thumbnails

**Cause 1:** Backend not returning thumbnails

**Check:** 
```bash
curl "http://localhost:4000/api/videos/search?topic=test"
```

Look for `"thumbnail": "https://..."` (should not be empty)

**Cause 2:** CORS error

**Fix:** Check `server/.env` has:
```env
CORS_ORIGIN=http://localhost:3000
```

### Problem 3: Videos not clickable

**Cause:** JavaScript error

**Fix:** 
1. Open browser console (F12)
2. Look for red errors
3. Check if frontend is latest version

### Problem 4: "Network Error"

**Cause:** Frontend can't reach backend

**Check:**
1. Backend is running on port 4000
2. Frontend is configured to use `http://localhost:4000`
3. No firewall blocking

**Fix:** 
```bash
# Test backend directly
curl http://localhost:4000/health
# Should return: {"ok":true}
```

### Problem 5: Demo videos showing instead of real ones

**Cause:** No YouTube API key (this is normal!)

**Options:**
1. **Use demo mode** (works fine for testing)
2. **Add API key** for real YouTube videos:
   - Get key from [Google Cloud Console](https://console.cloud.google.com)
   - Add to `server/.env`: `YOUTUBE_API_KEY=your_key_here`
   - Restart server

---

## 🧪 Quick Test (30 seconds)

Run this PowerShell script to verify backend:

```powershell
.\test-video-api.ps1
```

**Expected output:**
```
✅ Server is running!
✅ Found X videos
✅ Video ID: ✅
✅ Thumbnail: ✅
✅ HTTPS: ✅
```

---

## 📱 Test on Different Devices

### Desktop
- Open `http://localhost:3000`
- See 3 videos per row
- Hover effects work

### Mobile (or resize browser to < 640px)
- Open `http://localhost:3000`
- See 1 video per row
- Touch to open video

### Tablet (or resize browser to 640-1024px)
- Open `http://localhost:3000`
- See 2 videos per row

---

## 🎯 What to Test Next

### Basic Tests (5 minutes)
1. ✅ Videos display on roadmap pages
2. ✅ Thumbnails are visible
3. ✅ Clicking opens YouTube
4. ✅ No console errors

### Advanced Tests (10 minutes)
1. ✅ Test multiple topics
2. ✅ Test on mobile
3. ✅ Test hover effects
4. ✅ Check loading states
5. ✅ Verify HTTPS URLs

### Production Tests (15 minutes)
1. ✅ Add YouTube API key
2. ✅ Test with real API
3. ✅ Check quota usage
4. ✅ Test error scenarios
5. ✅ Performance testing

---

## 💡 Pro Tips

### Tip 1: View Backend Logs in Real-Time
```bash
cd server
npm run dev | grep -E "\[YouTube|Video Route\]"
```

### Tip 2: View Frontend Logs
Open browser console and filter by:
```
[Roadmap]
[VideoCard]
```

### Tip 3: Test API Directly
```bash
# Test with curl
curl "http://localhost:4000/api/videos/search?topic=javascript" | jq

# Test with browser
http://localhost:4000/api/videos/search?topic=javascript
```

### Tip 4: Clear Cache if Needed
```bash
# Backend
cd server
rm -rf node_modules package-lock.json
npm install

# Frontend
cd app
rm -rf node_modules .next package-lock.json
npm install
```

---

## 📚 Next Steps

### For Development:
1. ✅ Everything works? Great!
2. Read `YOUTUBE_VIDEO_FIX.md` for technical details
3. Check `VISUAL_GUIDE.md` for UI/UX info
4. Run full test suite in `TEST_CHECKLIST.md`

### For Production:
1. Add YouTube API key to production env
2. Update CORS settings for production domain
3. Enable error monitoring (Sentry, etc.)
4. Set up caching strategy
5. Configure CDN for images

---

## 🆘 Still Not Working?

### Check These Files:

**1. Backend Entry Point**
```bash
cat server/src/index.ts | grep cors
# Should show: app.use(cors(...))
```

**2. Video Service**
```bash
cat server/src/services/youtube.ts | grep videoId
# Should show: videoId: item.id?.videoId
```

**3. Video Card Component**
```bash
cat app/src/components/VideoCard.tsx | grep thumbnail
# Should show error handling and fallbacks
```

### Get Detailed Help:

1. **Check documentation:**
   - `YOUTUBE_VIDEO_FIX.md` - Technical details
   - `VISUAL_GUIDE.md` - Visual walkthrough
   - `TEST_CHECKLIST.md` - Complete testing

2. **Review console logs:**
   - Backend: Server terminal
   - Frontend: Browser DevTools (F12)

3. **Run diagnostics:**
   ```powershell
   .\test-video-api.ps1
   ```

---

## ✅ Success Checklist

Mark these off as you verify:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] `/health` endpoint returns `{"ok":true}`
- [ ] `/api/videos/search` returns videos
- [ ] Videos have thumbnail URLs
- [ ] Thumbnails display in browser
- [ ] Videos are clickable
- [ ] YouTube opens in new tab
- [ ] Console shows success logs
- [ ] No red errors in console
- [ ] Mobile view works
- [ ] Hover effects work

**All checked?** 🎉 **You're done!**

---

## 🎓 Learn More

Want to understand the implementation?

- **Technical Details:** `docs/YOUTUBE_VIDEO_FIX.md`
- **Visual Guide:** `docs/VISUAL_GUIDE.md`
- **Full Testing:** `TEST_CHECKLIST.md`
- **Summary:** `YOUTUBE_FIX_SUMMARY.md`

---

**Time to complete:** 5-10 minutes  
**Difficulty:** Easy  
**Status:** Production Ready ✅

---

**Last updated:** February 4, 2026  
**Version:** 1.0.0

Happy coding! 🚀
