import { NextResponse } from 'next/server'

// Mock user data
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
]

// Handle GET requests to /api/users/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  
  if (isNaN(id)) {
    return NextResponse.json(
      { error: 'Invalid user ID' },
      { status: 400 }
    )
  }
  
  const user = users.find(u => u.id === id)
  
  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(user)
}

// Handle PUT requests to /api/users/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      )
    }
    
    const userIndex = users.findIndex(u => u.id === id)
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    const body = await request.json()
    const { name, email } = body
    
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }
    
    // In a real app, you would update in a database
    users[userIndex] = { id, name, email }
    
    return NextResponse.json(users[userIndex])
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }
}

// Handle DELETE requests to /api/users/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  
  if (isNaN(id)) {
    return NextResponse.json(
      { error: 'Invalid user ID' },
      { status: 400 }
    )
  }
  
  const userIndex = users.findIndex(u => u.id === id)
  
  if (userIndex === -1) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    )
  }
  
  // In a real app, you would delete from a database
  const deletedUser = users[userIndex]
  users.splice(userIndex, 1)
  
  return NextResponse.json(deletedUser)
}