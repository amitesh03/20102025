# Next.js API Routes Example

This example demonstrates how to build API routes in Next.js 14 with the App Router.

## Learning Objectives

After completing this example, you'll understand:

- How to create API routes in Next.js
- How to handle different HTTP methods (GET, POST, PUT, DELETE)
- How to work with dynamic routes in API endpoints
- How to handle request bodies and query parameters
- How to return appropriate status codes and error responses
- How to structure API routes in a Next.js application

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### GET /api/hello
Returns a simple greeting message.

**Example Request:**
```bash
curl http://localhost:3000/api/hello
```

**Example Response:**
```json
{
  "message": "Hello from Next.js API Route!",
  "timestamp": "2023-11-15T12:34:56.789Z"
}
```

### POST /api/hello
Accepts a message and returns a personalized response.

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/hello \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello Next.js!"}'
```

**Example Response:**
```json
{
  "message": "You said: \"Hello Next.js!\". Hello back to you!",
  "timestamp": "2023-11-15T12:34:56.789Z"
}
```

### GET /api/users
Returns a list of users.

**Example Request:**
```bash
curl http://localhost:3000/api/users
```

**Example Response:**
```json
{
  "users": [
    { "id": 1, "name": "John Doe", "email": "john@example.com" },
    { "id": 2, "name": "Jane Smith", "email": "jane@example.com" },
    { "id": 3, "name": "Bob Johnson", "email": "bob@example.com" }
  ]
}
```

### GET /api/users/[id]
Returns a specific user by ID.

**Example Request:**
```bash
curl http://localhost:3000/api/users/1
```

**Example Response:**
```json
{ "id": 1, "name": "John Doe", "email": "john@example.com" }
```

### POST /api/users
Creates a new user.

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Brown", "email": "alice@example.com"}'
```

**Example Response:**
```json
{
  "id": 4,
  "name": "Alice Brown",
  "email": "alice@example.com"
}
```

### PUT /api/users/[id]
Updates an existing user.

**Example Request:**
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "John Updated", "email": "john.updated@example.com"}'
```

**Example Response:**
```json
{
  "id": 1,
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

### DELETE /api/users/[id]
Deletes a user.

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

**Example Response:**
```json
{ "id": 1, "name": "John Doe", "email": "john@example.com" }
```

## Key Concepts

### API Routes Structure
In Next.js with the App Router, API routes are created inside the `app/api` directory. Each folder represents a route, and the `route.ts` file exports functions for different HTTP methods.

### Handling Different HTTP Methods
You can export functions named after HTTP methods (GET, POST, PUT, DELETE, etc.) to handle different types of requests:

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  // Handle GET requests
  return NextResponse.json({ message: 'GET request' })
}

export async function POST(request: NextRequest) {
  // Handle POST requests
  const body = await request.json()
  return NextResponse.json({ message: 'POST request', data: body })
}
```

### Dynamic Routes
You can create dynamic routes by using brackets `[param]` in the folder name:

```typescript
// app/api/users/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  // Use the ID to fetch data
  return NextResponse.json({ id })
}
```

### Error Handling
Always handle errors and return appropriate status codes:

```typescript
export async function GET(request: NextRequest) {
  try {
    // Your logic here
    return NextResponse.json({ data: 'success' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
```

## Next Steps

- Try implementing authentication middleware for your API routes
- Connect your API routes to a real database
- Implement validation for request bodies
- Add rate limiting to your API endpoints
- Explore caching strategies for API responses