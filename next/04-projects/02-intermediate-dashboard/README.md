# Intermediate Dashboard Project

This project demonstrates intermediate Next.js concepts by building a comprehensive analytics dashboard with data visualization, authentication, and API integration.

## Features

- User authentication with JWT tokens
- Interactive data visualizations with Chart.js
- Real-time data updates with WebSocket
- CRUD operations for dashboard widgets
- Responsive design with Tailwind CSS
- API routes for data fetching and manipulation
- Server-side rendering with static generation
- Client-side data fetching with SWR

## Learning Objectives

After completing this project, you'll understand:

- How to implement authentication in Next.js
- How to create and consume API routes
- How to manage state in a complex application
- How to integrate third-party libraries
- How to implement real-time features
- How to optimize performance in data-heavy applications

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
04-projects/02-intermediate-dashboard/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/
│   │   │   ├── widgets/
│   │   │   └── data/
│   │   └── users/
│   ├── components/
│   │   ├── ui/
│   │   ├── charts/
│   │   └── auth/
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── lib/
│   │   ├── auth.ts
│   │   └── utils.ts
│   └── pages/
│       ├── login.tsx
│       ├── register.tsx
│       ├── dashboard/
│       │   └── [id].tsx
│       └── _app.tsx
├── components/
│   ├── charts/
│   │   ├── LineChart.tsx
│   │   ├── BarChart.tsx
│   │   └── PieChart.tsx
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx
│   │   ├── Widget.tsx
│   │   └── Sidebar.tsx
│   └── auth/
│       ├── LoginForm.tsx
│       └── RegisterForm.tsx
├── lib/
│   ├── auth.ts
│   ├── api.ts
│   └── utils.ts
└── styles/
    └── globals.css
```

## Key Concepts Demonstrated

### 1. Authentication

The project implements a complete authentication system with JWT tokens:

```typescript
// lib/auth.ts
export async function loginUser(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (response.ok) {
    const data = await response.json()
    // Store token in localStorage
    localStorage.setItem('token', data.token)
    return data.user
  } else {
    throw new Error('Login failed')
  }
}
```

### 2. API Routes

API routes handle backend functionality:

```typescript
// pages/api/dashboard/data.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify authentication
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Fetch data from database or external API
  const data = await fetchDashboardData()
  
  res.status(200).json(data)
}
```

### 3. Data Visualization

Interactive charts using Chart.js:

```typescript
// components/charts/LineChart.tsx
'use client'

import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

interface LineChartProps {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
    }[]
  }
}

export default function LineChart({ data }: LineChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      chartInstance.current = new Chart(chartRef.current, {
        type: 'line',
        data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top' as const,
            },
          },
        },
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return <canvas ref={chartRef} />
}
```

### 4. State Management

Using React Context for global state:

```typescript
// context/AuthContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('token')
    if (token) {
      // Verify token and get user data
      fetchUser().then(setUser).catch(() => {
        localStorage.removeItem('token')
      })
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const user = await loginUser(email, password)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

### 5. Real-time Updates

WebSocket integration for real-time data:

```typescript
// hooks/useWebSocket.ts
'use client'

import { useEffect, useRef, useState } from 'react'

export function useWebSocket(url: string) {
  const [data, setData] = useState<any>(null)
  const [connected, setConnected] = useState(false)
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    ws.current = new WebSocket(url)

    ws.current.onopen = () => {
      setConnected(true)
    }

    ws.current.onmessage = (event) => {
      const receivedData = JSON.parse(event.data)
      setData(receivedData)
    }

    ws.current.onclose = () => {
      setConnected(false)
    }

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [url])

  const sendMessage = (message: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message))
    }
  }

  return { data, connected, sendMessage }
}
```

## Next Steps

1. Add more chart types and customization options
2. Implement data export functionality
3. Add user roles and permissions
4. Integrate with a real database
5. Add email notifications
6. Implement dashboard sharing
7. Add dark mode support
8. Create mobile app version

## Technologies Used

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Chart.js for data visualization
- SWR for data fetching
- WebSocket for real-time updates
- JWT for authentication