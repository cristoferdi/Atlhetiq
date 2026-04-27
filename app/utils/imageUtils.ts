const imageCache = new Map<string, string>()

export async function getImageAsBase64(url: string): Promise<string> {
  if (!url) return ''
  
  if (imageCache.has(url)) {
    return imageCache.get(url)!
  }

  try {
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit',
    })

    if (!response.ok) {
      console.warn(`[ImageUtils] Failed to fetch image: ${url}, status: ${response.status}`)
      return ''
    }

    const blob = await response.blob()
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        imageCache.set(url, base64)
        resolve(base64)
      }
      reader.onerror = () => {
        console.warn(`[ImageUtils] Failed to convert image to base64: ${url}`)
        resolve('')
      }
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.warn(`[ImageUtils] Error fetching image: ${url}`, error)
    return ''
  }
}

export function clearImageCache(): void {
  imageCache.clear()
}