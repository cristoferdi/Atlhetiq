import { NextResponse } from 'next/server'
import sharp from 'sharp'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')

  if (!imageUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 })
  }

  try {
    const response = await fetch(imageUrl)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const pngBuffer = await sharp(buffer)
      .png()
      .toBuffer()
    
    const base64String = `data:image/png;base64,${pngBuffer.toString('base64')}`

    return NextResponse.json({ base64: base64String })
  } catch (error) {
    console.error('[proxy-image] Error:', error)
    return NextResponse.json({ 
      base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' 
    }, { status: 500 })
  }
}