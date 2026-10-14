import React, { useState } from 'react';
import { Loader2, VideoOff } from 'lucide-react';
import { parseVideoSource } from '../../utils/videoEmbed';

interface CinemaPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  title?: string;
  aspectRatio?: '16:9' | '9:16' | '2.39:1' | '4:3';
  autoPlay?: boolean;
  className?: string;
}

export const CinemaPlayer: React.FC<CinemaPlayerProps> = ({
  videoUrl,
  posterUrl,
  title = 'Cinema Reel',
  aspectRatio = '16:9',
  autoPlay = true,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const parsed = parseVideoSource(videoUrl, autoPlay);

  if (!videoUrl || !parsed.isValid) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black/90 text-neutral-500 font-mono text-xs gap-2 p-6">
        <VideoOff className="w-8 h-8 text-neutral-600" />
        <span>NO VIDEO SOURCE ATTACHED</span>
      </div>
    );
  }

  // Calculate CSS aspect ratio classes
  const isInstagram = parsed.type === 'instagram';
  const effectiveAspect = isInstagram && aspectRatio === '16:9' ? '9:16' : aspectRatio;

  const getAspectClass = () => {
    switch (effectiveAspect) {
      case '9:16':
        return 'aspect-[9/16] max-h-[78vh] w-auto mx-auto';
      case '2.39:1':
        return 'aspect-[2.39/1] max-w-full';
      case '4:3':
        return 'aspect-[4/3] max-w-full';
      case '16:9':
      default:
        return 'aspect-video max-w-full';
    }
  };

  // 1. Direct Video File (.mp4, .webm, local file upload)
  if (parsed.type === 'direct') {
    return (
      <div className={`relative w-full h-full flex items-center justify-center bg-black ${className}`}>
        <video
          src={parsed.embedUrl}
          poster={posterUrl}
          controls
          autoPlay={autoPlay}
          playsInline
          className={`w-full h-full object-contain ${getAspectClass()}`}
        />
      </div>
    );
  }

  // 2. IFrame Embed (YouTube, Vimeo, Instagram, or Custom Embed)
  return (
    <div className={`relative w-full h-full flex items-center justify-center bg-black ${className}`}>
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10 text-neutral-400 font-mono text-xs gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-cinema-amber" />
          <span className="tracking-wider uppercase">CONNECTING CINEMA FEED...</span>
        </div>
      )}

      {/* Responsive IFrame Player Container */}
      <div className={`relative ${effectiveAspect === '9:16' ? 'h-full flex items-center justify-center' : 'w-full'} ${getAspectClass()} overflow-hidden shadow-2xl bg-black rounded-lg`}>
        <iframe
          src={parsed.embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          scrolling="no"
          onLoad={() => setIsLoading(false)}
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    </div>
  );
};
