import { NextResponse } from 'next/server'

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
    const contentType = response.headers.get('content-type') || 'image/gif'
    
    const base64String = `data:${contentType};base64,${buffer.toString('base64')}`

    return NextResponse.json({ base64: base64String })
  } catch (error) {
    console.error('[proxy-image] Error:', error)
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 })
  }
}