"use client";
import { useState } from 'react';
import Link from 'next/link';

interface VideoCardProps {
  title: string;
  channel: string;
  duration?: string;
  href: string;
  thumbnail?: string;
  videoId?: string;  // Optional video ID for embedded player
  embedMode?: boolean; // Toggle between link and embed
}

/**
 * VideoCard Component
 * Displays YouTube video with thumbnail, title, and channel info
 * Supports both external link and embedded player modes
 */
export function VideoCard({ 
  title, 
  channel, 
  duration = '10:00', 
  href,
  thumbnail,
  videoId,
  embedMode = false
}: VideoCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isEmbedded, setIsEmbedded] = useState(false);
  
  // Extract video ID from href if not provided
  const extractedVideoId = videoId || href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
  
  // Fallback image if thumbnail fails or is missing
  const fallbackImage = 'https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=Video';
  
  // Ensure HTTPS for thumbnail URL
  const secureThumbnail = thumbnail?.replace(/^http:/, 'https:') || fallbackImage;
  
  // Handle thumbnail load error
  const handleImageError = () => {
    console.warn(`[VideoCard] Failed to load thumbnail for: "${title}"`);
    setImageError(true);
    setImageLoading(false);
  };
  
  const handleImageLoad = () => {
    console.log(`[VideoCard] Thumbnail loaded successfully for: "${title}"`);
    setImageLoading(false);
  };
  
  // Handle click for mobile devices - toggle embed
  const handleClick = (e: React.MouseEvent) => {
    if (embedMode && extractedVideoId) {
      e.preventDefault();
      setIsEmbedded(!isEmbedded);
    }
  };
  
  // Render embedded player
  if (isEmbedded && extractedVideoId) {
    return (
      <div className="glass rounded-xl overflow-hidden">
        <div className="relative aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${extractedVideoId}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
        <div className="p-4">
          <button 
            onClick={() => setIsEmbedded(false)}
            className="text-xs text-brand-blue hover:underline"
          >
            ← Back to thumbnail
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <Link 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group block"
      onClick={handleClick}
    >
      <div className="glass rounded-xl overflow-hidden card-hover">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gradient-to-br from-brand-blue to-brand-orange overflow-hidden">
          {/* Loading skeleton */}
          {imageLoading && !imageError && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-neutral-800 animate-pulse" />
          )}
          
          {/* Thumbnail image */}
          {!imageError ? (
            <img 
              src={secureThumbnail} 
              alt={title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
            />
          ) : (
            // Fallback icon if image fails
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
              </svg>
            </div>
          )}
          
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-bold rounded">
            {duration}
          </div>
          
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all">
              <svg className="w-6 h-6 text-brand-blue ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>
          
          {/* YouTube badge */}
          <div className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            YouTube
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h4 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-brand-blue transition">
            {title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              {channel}
            </span>
          </div>
          {embedMode && extractedVideoId && (
            <div className="mt-2 text-xs text-brand-blue">
              Click to play inline
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
