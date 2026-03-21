export type VideoPlatform = 'youtube' | 'vimeo' | 'tiktok' | 'facebook' | 'instagram' | 'unknown'

interface ParsedVideo {
  platform: VideoPlatform
  videoId: string | null
  embedUrl: string | null
  isEmbeddable: boolean
}

export function parseVideoUrl(url: string | undefined): ParsedVideo {
  if (!url) {
    return { platform: 'unknown', videoId: null, embedUrl: null, isEmbeddable: false }
  }

  const cleanUrl = url.trim()

  if (cleanUrl.includes('youtube.com/watch')) {
    const videoId = extractParam(url, 'v')
    return {
      platform: 'youtube',
      videoId,
      embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : null,
      isEmbeddable: !!videoId,
    }
  }

  if (cleanUrl.includes('youtu.be/')) {
    const videoId = cleanUrl.split('youtu.be/')[1]?.split('?')[0]
    return {
      platform: 'youtube',
      videoId,
      embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : null,
      isEmbeddable: !!videoId,
    }
  }

  if (cleanUrl.includes('youtube.com/shorts/')) {
    const videoId = cleanUrl.split('shorts/')[1]?.split('?')[0]
    return {
      platform: 'youtube',
      videoId,
      embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : null,
      isEmbeddable: !!videoId,
    }
  }

  if (cleanUrl.includes('vimeo.com/')) {
    const videoId = cleanUrl.split('vimeo.com/')[1]?.split('?')[0]
    return {
      platform: 'vimeo',
      videoId,
      embedUrl: videoId ? `https://player.vimeo.com/video/${videoId}` : null,
      isEmbeddable: !!videoId,
    }
  }

  if (cleanUrl.includes('tiktok.com/')) {
    const parts = cleanUrl.split('tiktok.com/')[1]?.split('?')[0]?.split('/')
    const videoId = parts?.[parts.length - 1]
    return {
      platform: 'tiktok',
      videoId,
      embedUrl: videoId ? `https://www.tiktok.com/player/v1/${videoId}` : null,
      isEmbeddable: !!videoId,
    }
  }

  if (cleanUrl.includes('facebook.com/reel/')) {
    const videoId = cleanUrl.split('reel/')[1]?.split('?')[0]
    return {
      platform: 'facebook',
      videoId,
      embedUrl: videoId ? `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/reel/${videoId}` : null,
      isEmbeddable: !!videoId,
    }
  }

  if (cleanUrl.includes('facebook.com/') || cleanUrl.includes('fb.watch/')) {
    const videoId = extractParam(cleanUrl, 'v') || 
                    cleanUrl.split('/v=')?.[1]?.split('&')[0] ||
                    cleanUrl.split('fb.watch/')[1]?.split('?')[0]
    return {
      platform: 'facebook',
      videoId,
      embedUrl: videoId ? `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/video.php?v=${videoId}` : null,
      isEmbeddable: !!videoId,
    }
  }

  if (cleanUrl.includes('instagram.com/')) {
    const match = cleanUrl.match(/\/(reel|tv|reels|posts|p)\/([A-Za-z0-9_-]+)/)
    const shortcode = match ? match[2] : null
    return {
      platform: 'instagram',
      videoId: shortcode,
      embedUrl: null,
      isEmbeddable: false,
    }
  }

  return { platform: 'unknown', videoId: null, embedUrl: null, isEmbeddable: false }
}

function extractParam(url: string, param: string): string | null {
  try {
    const urlObj = new URL(url)
    return urlObj.searchParams.get(param)
  } catch {
    return null
  }
}

export function getPlatformName(platform: VideoPlatform): string {
  const names: Record<VideoPlatform, string> = {
    youtube: 'YouTube',
    vimeo: 'Vimeo',
    tiktok: 'TikTok',
    facebook: 'Facebook',
    instagram: 'Instagram',
    unknown: 'Video',
  }
  return names[platform]
}
