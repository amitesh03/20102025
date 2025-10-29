import { NextRequest, NextResponse } from 'next/server'

// Handle GET requests
export async function GET() {
  return NextResponse.json({ 
    message: 'Hello from Next.js API Route!',
    timestamp: new Date().toISOString()
  })
}

// Handle POST requests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = body
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      message: `You said: "${message}". Hello back to you!`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }
}