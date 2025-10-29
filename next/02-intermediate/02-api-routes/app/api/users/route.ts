import { NextResponse } from 'next/server'

// Mock user data
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
]

// Handle GET requests to /api/users
export async function GET() {
  return NextResponse.json({ users })
}

// Handle POST requests to /api/users
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email } = body
    
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }
    
    // In a real app, you would save to a database
    const newUser = {
      id: users.length + 1,
      name,
      email
    }
    
    users.push(newUser)
    
    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }
}