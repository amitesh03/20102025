# Multi-tenant SaaS Platform Project

A comprehensive multi-tenant SaaS platform built with Next.js, featuring tenant isolation, subscription management, real-time collaboration, and advanced analytics.

## Features

- Multi-tenant architecture with tenant isolation
- Subscription management with Stripe
- Real-time collaboration with WebSockets
- Advanced analytics dashboard
- Role-based access control
- API rate limiting
- Database sharding strategy
- Progressive Web App (PWA) features

## Learning Objectives

- Building multi-tenant applications
- Implementing subscription billing
- Real-time features with WebSockets
- Advanced database patterns
- Performance optimization at scale
- Security best practices
- PWA implementation
- Microservices architecture

## Project Structure

```
saas-platform/
├── apps/
│   ├── web/                        # Next.js web application
│   │   ├── app/
│   │   │   ├── (auth)/             # Authentication routes
│   │   │   ├── (dashboard)/        # Dashboard routes
│   │   │   ├── api/                # API routes
│   │   │   └── [tenant]/          # Tenant-specific routes
│   │   ├── components/
│   │   ├── lib/
│   │   └── package.json
│   └── api/                        # Express.js API service
│       ├── src/
│       │   ├── routes/             # API routes
│       │   ├── middleware/         # Custom middleware
│       │   ├── services/           # Business logic
│       │   └── utils/              # Utility functions
│       └── package.json
├── packages/
│   ├── db/                         # Database package
│   │   ├── prisma/
│   │   ├── migrations/
│   │   └── package.json
│   ├── auth/                       # Authentication package
│   │   ├── src/
│   │   └── package.json
│   ├── billing/                    # Billing package
│   │   ├── src/
│   │   └── package.json
│   ├── websocket/                  # WebSocket package
│   │   ├── src/
│   │   └── package.json
│   └── shared/                     # Shared utilities
│       ├── src/
│       └── package.json
├── infrastructure/
│   ├── docker/                     # Docker configurations
│   ├── kubernetes/                 # K8s manifests
│   └── terraform/                  # Infrastructure as code
└── README.md
```

## Architecture Overview

### Multi-Tenancy Strategy

This platform uses a shared database, shared schema approach with tenant isolation at the application level:

```typescript
// packages/db/src/tenant.ts
export class TenantService {
  async getTenantByDomain(domain: string): Promise<Tenant | null> {
    return await prisma.tenant.findUnique({
      where: { domain },
    })
  }
  
  async getTenantForUser(userId: string): Promise<Tenant[]> {
    return await prisma.tenant.findMany({
      where: {
        users: {
          some: {
            userId,
          },
        },
      },
    })
  }
  
  async createTenant(data: CreateTenantData): Promise<Tenant> {
    return await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          ...data,
          subscription: {
            create: {
              planId: 'free',
              status: 'active',
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            },
          },
        },
      })
      
      // Create initial resources for tenant
      await this.createInitialTenantResources(tenant.id, tx)
      
      return tenant
    })
  }
}
```

### Subscription Management

```typescript
// packages/billing/src/subscription.ts
export class SubscriptionService {
  async createSubscription(
    userId: string,
    tenantId: string,
    planId: string,
    paymentMethodId: string
  ): Promise<Subscription> {
    const customer = await this.getOrCreateCustomer(userId, tenantId)
    
    const stripeSubscription = await stripe.subscriptions.create({
      customer: customer.stripeCustomerId,
      items: [{ price: planId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    })
    
    return await prisma.subscription.create({
      data: {
        tenantId,
        userId,
        stripeSubscriptionId: stripeSubscription.id,
        planId,
        status: 'incomplete',
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      },
    })
  }
  
  async handleWebhook(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
    }
  }
}
```

### Real-time Collaboration

```typescript
// packages/websocket/src/collaboration.ts
export class CollaborationService {
  private io: Server
  private documentRooms: Map<string, Set<string>> = new Map()
  
  constructor(io: Server) {
    this.io = io
    this.setupEventHandlers()
  }
  
  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      socket.on('join-document', async (data) => {
        const { documentId, userId, tenantId } = data
        
        // Verify user has access to document
        const hasAccess = await this.verifyDocumentAccess(userId, documentId, tenantId)
        if (!hasAccess) {
          socket.emit('error', { message: 'Unauthorized' })
          return
        }
        
        socket.join(documentId)
        
        // Track users in document
        if (!this.documentRooms.has(documentId)) {
          this.documentRooms.set(documentId, new Set())
        }
        this.documentRooms.get(documentId)!.add(userId)
        
        // Notify other users
        socket.to(documentId).emit('user-joined', { userId })
        
        // Send current document state
        const document = await this.getDocument(documentId)
        socket.emit('document-state', { document })
      })
      
      socket.on('document-operation', async (data) => {
        const { documentId, operation, userId, tenantId } = data
        
        // Verify user has write access
        const hasWriteAccess = await this.verifyDocumentWriteAccess(userId, documentId, tenantId)
        if (!hasWriteAccess) {
          socket.emit('error', { message: 'Unauthorized' })
          return
        }
        
        // Apply operation
        const result = await this.applyOperation(documentId, operation)
        
        // Broadcast to other users in document
        socket.to(documentId).emit('operation-applied', {
          operation,
          result,
          userId,
        })
      })
      
      socket.on('disconnect', () => {
        // Remove user from all document rooms
        this.documentRooms.forEach((users, documentId) => {
          if (users.has(socket.userId)) {
            users.delete(socket.userId)
            socket.to(documentId).emit('user-left', { userId: socket.userId })
          }
        })
      })
    })
  }
}
```

### Advanced Analytics

```typescript
// packages/web/src/components/analytics/AnalyticsDashboard.tsx
"use client"

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface AnalyticsData {
  date: string
  users: number
  revenue: number
  engagement: number
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  
  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true)
      try {
        const response = await fetch(`/api/analytics?range=${timeRange}`)
        const analyticsData = await response.json()
        setData(analyticsData)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAnalytics()
  }, [timeRange])
  
  if (loading) {
    return <div>Loading analytics...</div>
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Users"
          value={data.reduce((sum, d) => sum + d.users, 0)}
          change={12.5}
        />
        <MetricCard
          title="Revenue"
          value={`$${data.reduce((sum, d) => sum + d.revenue, 0).toFixed(2)}`}
          change={8.2}
        />
        <MetricCard
          title="Engagement Rate"
          value={`${(data.reduce((sum, d) => sum + d.engagement, 0) / data.length).toFixed(1)}%`}
          change={-2.3}
        />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">User Growth</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
```

### PWA Implementation

```typescript
// packages/web/src/components/pwa/PWAInstaller.tsx
"use client"

import { useState, useEffect } from 'react'

let deferredPrompt: BeforeInstallPromptEvent | null = null

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e
})

export default function PWAInstaller() {
  const [installable, setInstallable] = useState(false)
  
  useEffect(() => {
    setInstallable(!!deferredPrompt)
  }, [])
  
  async function handleInstall() {
    if (!deferredPrompt) return
    
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      deferredPrompt = null
      setInstallable(false)
    }
  }
  
  if (!installable) return null
  
  return (
    <button
      onClick={handleInstall}
      className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
    >
      Install App
    </button>
  )
}
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Set up the database:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
5. Start the development servers:
   ```bash
   npm run dev
   ```

## Deployment

This platform is designed for deployment on:
- Web application: Vercel
- API service: AWS ECS or Google Cloud Run
- Database: PlanetScale or AWS RDS
- WebSocket service: AWS API Gateway with WebSockets
- Infrastructure: Terraform with AWS

## Scaling Considerations

- Database sharding by tenant
- Redis for session management and caching
- CDN for static assets
- Load balancing for API services
- Monitoring with Sentry and DataDog

## Next Steps

After completing this project:
- Explore machine learning integration
- Implement advanced security features
- Add mobile app development
- Learn about edge computing

Happy building!