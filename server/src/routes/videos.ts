import { Router } from 'express';
import { z } from 'zod';
import { searchEducationalVideos } from '../services/youtube';
import { config } from '../config';

const router = Router();

/**
 * GET /api/videos/search
 * Search for educational videos by topic
 * Query params: topic (required, min 2 chars)
 * Returns: { videos: Array<{ videoId, id, title, channel, thumbnail, href }> }
 */
router.get('/search', async (req, res) => {
  const schema = z.object({ topic: z.string().min(2) });
  const parsed = schema.safeParse(req.query);
  
  if (!parsed.success) {
    console.error('[Video Route] Invalid query params:', req.query);
    return res.status(400).json({ error: 'Invalid input: topic is required (min 2 characters)' });
  }

  const topic = parsed.data.topic;
  console.log(`[Video Route] Searching for topic: "${topic}"`);

  try {
    let videos;
    const hasValidKey = config.youtubeKey && 
                       !config.youtubeKey.includes('your_youtube_api_key') && 
                       config.youtubeKey.length > 20;
    
    if (!hasValidKey) {
      console.log('[Video Route] No valid YouTube API key, using demo data');
      // Demo fallback with proper structure and real video IDs
      videos = [
        { 
          videoId: 'dQw4w9WgXcQ',
          id: 'dQw4w9WgXcQ', 
          title: `${topic} Tutorial`, 
          channel: 'Demo Channel', 
          thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
          href: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' 
        },
        { 
          videoId: '3GwjfUFyY6M',
          id: '3GwjfUFyY6M', 
          title: `${topic} Crash Course`, 
          channel: 'Demo Academy', 
          thumbnail: 'https://i.ytimg.com/vi/3GwjfUFyY6M/mqdefault.jpg',
          href: 'https://www.youtube.com/watch?v=3GwjfUFyY6M' 
        }
      ];
    } else {
      // YouTube service has its own error handling and fallback
      videos = await searchEducationalVideos(topic);
    }
    
    console.log(`[Video Route] Returning ${videos.length} videos`);
    res.json({ videos });
  } catch (err: any) {
    console.error('[Video Route] Unexpected error:', err);
    
    // Ultimate fallback
    const fallbackVideos = [
      { 
        videoId: 'fallback1',
        id: 'fallback1', 
        title: `${topic} Tutorial`, 
        channel: 'Learning Hub', 
        thumbnail: 'https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=Video',
        href: 'https://www.youtube.com' 
      },
      { 
        videoId: 'fallback2',
        id: 'fallback2', 
        title: `${topic} Guide`, 
        channel: 'Tech Academy', 
        thumbnail: 'https://via.placeholder.com/320x180/F97316/FFFFFF?text=Video',
        href: 'https://www.youtube.com' 
      }
    ];
    res.json({ videos: fallbackVideos });
  }
});

export default router;
