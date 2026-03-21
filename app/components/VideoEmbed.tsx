'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'
import { parseVideoUrl, getPlatformName } from '../utils/videoUtils'

// 1. Le decimos a TypeScript que existe un objeto 'instgrm' en el window global
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process(): void;
      };
    };
  }
}

interface VideoEmbedProps {
  videoUrl?: string
  mediaUrl: string
  alt?: string
  showPlayButton?: boolean
}

export default function VideoEmbed({ videoUrl, mediaUrl, alt = 'Video ejercicio', showPlayButton = true }: VideoEmbedProps) {
  const [showVideo, setShowVideo] = useState(false)
  
  console.log('[VideoEmbed] Props:', { videoUrl, mediaUrl, alt, showPlayButton })
  const parsed = parseVideoUrl(videoUrl)
  console.log('[VideoEmbed] Parsed video:', parsed)

  // Efecto para inicializar Instagram cuando se muestra el video
  useEffect(() => {
    if (showVideo && parsed.platform === 'instagram' && window.instgrm) {
      window.instgrm.Embeds.process()
    }
  }, [showVideo, parsed.platform])

  // Si no es embebible o no hay URL de video, mostrar solo el GIF
  if (!parsed.isEmbeddable || !parsed.embedUrl) {
    console.log('[VideoEmbed] No embebible, mostrando GIF')
    return (
      <div className="w-full bg-gray-50 rounded-xl overflow-hidden flex justify-center">
        <img
          src={mediaUrl}
          alt={alt}
          className="max-w-full h-auto"
          style={{ maxHeight: '300px' }}
          onError={(e) => {
            console.log('[VideoEmbed] Error cargando imagen, usando placeholder')
            const target = e.target as HTMLImageElement
            target.src = `https://via.placeholder.com/400x225/F3F4F6/9CA3AF?text=${encodeURIComponent(alt)}`
          }}
        />
      </div>
    )
  }

  // Función para renderizar el reproductor
  const renderPlayer = () => {
    if (parsed.platform === 'instagram') {
      return (
        <div className="w-full flex justify-center bg-white rounded-xl overflow-hidden">
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={`https://www.instagram.com/p/${parsed.videoId}/`}
            data-instgrm-version="14"
            style={{ background: '#FFF', border: 0, margin: 1, maxWidth: '540px', minWidth: '326px', width: 'calc(100% - 2px)', height: '600px' }}
          />
        </div>
      )
    }

    const isVertical = parsed.platform === 'tiktok' || 
                       parsed.platform === 'facebook' || 
                       parsed.embedUrl?.includes('shorts')
    const aspectRatio = isVertical ? '177.78%' : '56.25%'

    return (
      <div className="relative w-full bg-black rounded-xl overflow-hidden" style={{ paddingTop: aspectRatio }}>
        <iframe
          src={`${parsed.embedUrl}?autoplay=1`}
          title={alt}
          className="absolute top-0 left-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  // Si showPlayButton es false, mostrar solo el GIF limpio
  if (!showPlayButton) {
    return (
      <div className="w-full bg-gray-50 rounded-xl overflow-hidden flex justify-center">
        <img
          src={mediaUrl}
          alt={alt}
          className="max-w-full h-auto"
          style={{ maxHeight: '300px' }}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = `https://via.placeholder.com/400x225/F3F4F6/9CA3AF?text=${encodeURIComponent(alt)}`
          }}
        />
      </div>
    )
  }

  return (
    <div className="w-full">
      {parsed.platform === 'instagram' && (
        <Script async src="//www.instagram.com/embed.js" strategy="lazyOnload" />
      )}

      {!showVideo ? (
        <div className="relative w-full bg-gray-50 rounded-xl overflow-hidden flex justify-center">
          <img
            src={mediaUrl}
            alt={alt}
            className="max-w-full h-auto cursor-pointer"
            style={{ maxHeight: '300px' }}
            onClick={() => {
              console.log('[VideoEmbed] Click en imagen, mostrando video')
              setShowVideo(true)
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = `https://via.placeholder.com/400x225/F3F4F6/9CA3AF?text=${encodeURIComponent(alt)}`
            }}
          />
          <button
            onClick={() => {
              console.log('[VideoEmbed] Click en boton play')
              setShowVideo(true)
            }}
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
          >
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {getPlatformName(parsed.platform)}
          </div>
        </div>
      ) : (
        renderPlayer()
      )}
    </div>
  )
}

interface VideoLinkProps {
  videoUrl?: string
}

export function VideoLink({ videoUrl }: VideoLinkProps) {
  console.log('[VideoLink] Renderizando con videoUrl:', videoUrl)
  
  if (!videoUrl) {
    console.log('[VideoLink] No hay videoUrl, no se muestra enlace')
    return null
  }

  const parsed = parseVideoUrl(videoUrl)
  console.log('[VideoLink] Plataforma detectada:', parsed.platform)

  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm font-medium text-gray-700"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
      Ver video en {getPlatformName(parsed.platform)}
    </a>
  )
}