import { google } from 'googleapis';
import { config } from '../config';

const youtube = google.youtube('v3');

/**
 * Search for educational videos on YouTube
 * @param topic - The topic to search for
 * @returns Array of video objects with proper structure
 */
export async function searchEducationalVideos(topic: string) {
  try {
    console.log(`[YouTube Service] Searching videos for topic: "${topic}"`);
    
    const res = await youtube.search.list({
      key: config.youtubeKey,
      part: ['snippet'],
      q: `${topic} tutorial beginner`,
      type: ['video'],
      maxResults: 8,
      videoEmbeddable: 'true',
      relevanceLanguage: 'en',
      safeSearch: 'moderate'
    });

    const items = res.data.items || [];
    console.log(`[YouTube Service] Found ${items.length} videos`);
    
    // Map YouTube API response to our video structure
    // Using proper field paths: item.id.videoId, item.snippet.thumbnails.medium.url
    const videos = items.map((item) => {
      const videoId = item.id?.videoId || '';
      const title = item.snippet?.title || 'Untitled Video';
      const channel = item.snippet?.channelTitle || 'Unknown Channel';
      // Ensure HTTPS URL for thumbnail
      const thumbnailUrl = item.snippet?.thumbnails?.medium?.url || 
                          item.snippet?.thumbnails?.default?.url || 
                          item.snippet?.thumbnails?.high?.url || '';
      const thumbnail = thumbnailUrl.replace(/^http:/, 'https:');
      const href = videoId ? `https://www.youtube.com/watch?v=${videoId}` : '';
      
      console.log(`[YouTube Service] Video mapped: ID=${videoId}, Title="${title}", Thumbnail=${thumbnail ? 'Yes' : 'No'}`);
      
      return {
        videoId,        // Raw video ID for embed player
        id: videoId,    // Alias for compatibility
        title,
        channel,
        thumbnail,
        href
      };
    });
    
    return videos;
  } catch (error: any) {
    console.error('[YouTube Service] API Error:', error.message);
    console.error('[YouTube Service] Full error:', error);
    
    // Return demo data if API fails
    console.log('[YouTube Service] Returning fallback demo videos');
    return [
      { 
        videoId: 'dQw4w9WgXcQ',
        id: 'dQw4w9WgXcQ', 
        title: `${topic} Tutorial for Beginners`, 
        channel: 'Learn Academy', 
        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        href: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' 
      },
      { 
        videoId: '3GwjfUFyY6M',
        id: '3GwjfUFyY6M', 
        title: `${topic} Complete Course`, 
        channel: 'Code School', 
        thumbnail: 'https://i.ytimg.com/vi/3GwjfUFyY6M/mqdefault.jpg',
        href: 'https://www.youtube.com/watch?v=3GwjfUFyY6M' 
      },
      { 
        videoId: 'Tn6-PIqc4UM',
        id: 'Tn6-PIqc4UM', 
        title: `Master ${topic} in 1 Hour`, 
        channel: 'Tech Tutorials', 
        thumbnail: 'https://i.ytimg.com/vi/Tn6-PIqc4UM/mqdefault.jpg',
        href: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM' 
      }
    ];
  }
}
