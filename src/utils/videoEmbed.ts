export interface ParsedVideoSource {
  type: 'youtube' | 'vimeo' | 'instagram' | 'iframe' | 'direct';
  embedUrl: string;
  originalUrl: string;
  videoId?: string;
  thumbnailUrl?: string;
  isValid: boolean;
}

/**
 * Extracts YouTube video ID from various URL patterns including:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 */
export function parseYouTubeId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // Pattern matches:
  // (?:v=|\/embed\/|\/shorts\/|youtu\.be\/|\/v\/)([a-zA-Z0-9_-]{11})
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(ytRegex);
  return match ? match[1] : null;
}

/**
 * Extracts Vimeo video ID from URLs like:
 * - https://vimeo.com/VIDEO_ID
 * - https://player.vimeo.com/video/VIDEO_ID
 */
export function parseVimeoId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  const vimeoRegex = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/(?:\d+\/)?video\/|video\/|)(\d+))/;
  const match = trimmed.match(vimeoRegex);
  return match ? match[1] : null;
}

/**
 * Extracts Instagram Reel / Post / TV shortcode from URLs like:
 * - https://www.instagram.com/reel/C3b4Xy_vZbA/
 * - https://instagram.com/reels/C3b4Xy_vZbA
 * - https://www.instagram.com/p/C3b4Xy_vZbA/
 * - https://www.instagram.com/tv/C3b4Xy_vZbA/
 */
export function parseInstagramId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  const igRegex = /(?:instagram\.com\/(?:reel|reels|p|tv)\/([a-zA-Z0-9_-]+))/i;
  const match = trimmed.match(igRegex);
  return match ? match[1] : null;
}

/**
 * Extracts src from an <iframe> HTML tag if the user pasted raw iframe code
 */
export function extractIframeSrc(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (trimmed.startsWith('<iframe') || trimmed.includes('<iframe')) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }
  return null;
}

/**
 * Generates the highest-resolution YouTube thumbnail available.
 */
export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

/**
 * High-quality fallback thumbnail for YouTube if maxresdefault is unavailable.
 */
export function getYouTubeHqThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Universal video parser that detects YouTube, Vimeo, iframe tags, and direct video files.
 * Returns an embed-ready URL configured with cinematic parameters.
 */
export function parseVideoSource(input: string, autoPlay: boolean = true): ParsedVideoSource {
  if (!input || typeof input !== 'string') {
    return {
      type: 'direct',
      embedUrl: '',
      originalUrl: '',
      isValid: false,
    };
  }

  const trimmed = input.trim();

  // 1. Check if raw iframe code was pasted
  const iframeSrc = extractIframeSrc(trimmed);
  if (iframeSrc) {
    // If the extracted src is YouTube or Vimeo, re-parse that src for optimal embed params
    return parseVideoSource(iframeSrc, autoPlay);
  }

  // 2. Check for YouTube
  const ytId = parseYouTubeId(trimmed);
  if (ytId) {
    const playParam = autoPlay ? 'autoplay=1&' : 'autoplay=0&';
    // Use youtube-nocookie for privacy, fast CDN, and no third-party cookie blocking
    const embedUrl = `https://www.youtube-nocookie.com/embed/${ytId}?${playParam}rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''}`;
    return {
      type: 'youtube',
      embedUrl,
      originalUrl: trimmed,
      videoId: ytId,
      thumbnailUrl: getYouTubeThumbnail(ytId),
      isValid: true,
    };
  }

  // 3. Check for Vimeo
  const vimeoId = parseVimeoId(trimmed);
  if (vimeoId) {
    const playParam = autoPlay ? 'autoplay=1&' : 'autoplay=0&';
    const embedUrl = `https://player.vimeo.com/video/${vimeoId}?${playParam}title=0&byline=0&portrait=0&dnt=1`;
    return {
      type: 'vimeo',
      embedUrl,
      originalUrl: trimmed,
      videoId: vimeoId,
      isValid: true,
    };
  }

  // 4. Check for Instagram Reel or Post
  const igId = parseInstagramId(trimmed);
  if (igId) {
    const isReel = trimmed.includes('/reel') || trimmed.includes('/reels');
    const embedUrl = isReel
      ? `https://www.instagram.com/reel/${igId}/embed/`
      : `https://www.instagram.com/p/${igId}/embed/`;
    return {
      type: 'instagram',
      embedUrl,
      originalUrl: trimmed,
      videoId: igId,
      isValid: true,
    };
  }

  // 5. Check if already an embed link (e.g. custom video host)
  if (trimmed.includes('/embed/') || trimmed.includes('player.')) {
    return {
      type: 'iframe',
      embedUrl: trimmed,
      originalUrl: trimmed,
      isValid: true,
    };
  }

  // 5. Fallback: Direct video stream (MP4, WebM, local upload)
  return {
    type: 'direct',
    embedUrl: trimmed,
    originalUrl: trimmed,
    isValid: Boolean(trimmed),
  };
}
