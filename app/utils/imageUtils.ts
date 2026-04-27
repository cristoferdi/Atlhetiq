const imageCache = new Map<string, string>()

export async function getImageAsBase64(url: string): Promise<string> {
  if (!url) return ''
  
  if (imageCache.has(url)) {
    return imageCache.get(url)!
  }

  try {
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`
    const response = await fetch(proxyUrl)

    if (!response.ok) {
      console.warn(`[ImageUtils] Proxy failed for: ${url}, status: ${response.status}`)
      return ''
    }

    const data = await response.json()
    
    if (data.base64) {
      imageCache.set(url, data.base64)
      return data.base64
    }

    return ''
  } catch (error) {
    console.warn(`[ImageUtils] Error fetching image: ${url}`, error)
    return ''
  }
}

export async function preloadAllImages(routine: any[]): Promise<Record<string, string>> {
  const imageMap: Record<string, string> = {}
  const urls: string[] = []

  for (const day of routine) {
    if (day.blocks) {
      for (const block of day.blocks) {
        if (block.sub_exercises) {
          for (const subExercise of block.sub_exercises) {
            if (subExercise.gif_url && !imageMap[subExercise.gif_url]) {
              urls.push(subExercise.gif_url)
            }
          }
        }
      }
    }
  }

  console.log(`[ImageUtils] Preloading ${urls.length} images...`)

  for (const url of urls) {
    const base64 = await getImageAsBase64(url)
    if (base64) {
      imageMap[url] = base64
    }
  }

  console.log(`[ImageUtils] Successfully loaded ${Object.keys(imageMap).length} images`)
  return imageMap
}

export function clearImageCache(): void {
  imageCache.clear()
}