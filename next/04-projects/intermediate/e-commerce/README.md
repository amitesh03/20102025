# E-commerce Platform Project

A full-featured e-commerce platform built with Next.js, including product catalog, shopping cart, checkout process, and payment integration.

## Features

- Product catalog with filtering and search
- Shopping cart functionality
- User authentication and profiles
- Checkout process with Stripe integration
- Order management
- Admin dashboard
- Product reviews and ratings
- Wishlist functionality

## Learning Objectives

- Building complex e-commerce workflows
- Payment integration with Stripe
- User authentication and authorization
- Database integration with Prisma
- API routes for backend functionality
- State management for shopping cart
- Form validation and error handling

## Project Structure

```
e-commerce/
├── app/
│   ├── layout.tsx                  # Root layout with providers
│   ├── page.tsx                    # Home page with featured products
│   ├── products/
│   │   ├── page.tsx                # Product listing with filters
│   │   └── [id]/
│   │       └── page.tsx            # Product detail page
│   ├── cart/
│   │   └── page.tsx                # Shopping cart
│   ├── checkout/
│   │   └── page.tsx                # Checkout process
│   ├── account/
│   │   ├── page.tsx                # User account dashboard
│   │   ├── orders/
│   │   │   └── page.tsx            # Order history
│   │   └── profile/
│   │       └── page.tsx            # User profile
│   ├── admin/
│   │   ├── layout.tsx              # Admin layout
│   │   ├── page.tsx                # Admin dashboard
│   │   ├── products/
│   │   │   ├── page.tsx            # Product management
│   │   │   └── new/
│   │   │       └── page.tsx        # Add new product
│   │   └── orders/
│   │       └── page.tsx            # Order management
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts        # NextAuth.js configuration
│   │   ├── products/
│   │   │   ├── route.ts            # GET /api/products, POST /api/products
│   │   │   └── [id]/
│   │   │       └── route.ts        # Product CRUD operations
│   │   ├── cart/
│   │   │   ├── route.ts            # Cart operations
│   │   │   └── [id]/
│   │   │       └── route.ts        # Cart item operations
│   │   ├── checkout/
│   │   │   └── route.ts            # Stripe checkout
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts        # Stripe webhooks
│   └── components/
│       ├── ui/                     # Reusable UI components
│       ├── product/
│       │   ├── ProductCard.tsx     # Product card component
│       │   ├── ProductList.tsx     # Product list component
│       │   └── ProductFilter.tsx   # Product filter component
│       ├── cart/
│       │   ├── CartItem.tsx        # Cart item component
│       │   └── CartSummary.tsx     # Cart summary component
│       ├── checkout/
│       │   ├── CheckoutForm.tsx    # Checkout form
│       │   └── PaymentForm.tsx     # Payment form
│       └── auth/
│           ├── LoginForm.tsx       # Login form
│           └── RegisterForm.tsx    # Registration form
├── lib/
│   ├── db.ts                       # Prisma database connection
│   ├── auth.ts                     # NextAuth.js configuration
│   ├── stripe.ts                   # Stripe configuration
│   ├── utils.ts                    # Utility functions
│   └── validations.ts              # Form validations
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── migrations/                 # Database migrations
└── README.md
```

## Getting Started

1. Navigate to this directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Add your environment variables:
   ```
   DATABASE_URL="your-database-url"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   STRIPE_SECRET_KEY="your-stripe-secret-key"
   STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
   STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
   ```
5. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```
6. Run the development server:
   ```bash
   npm run dev
   ```
7. Open http://localhost:3000 in your browser

## Key Concepts Demonstrated

### Payment Integration with Stripe

```tsx
// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { cartItems } = await request.json()
    
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      metadata: {
        userId: session.user.id,
      },
    })
    
    return NextResponse.json({ sessionId: checkoutSession.id })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
```

### Shopping Cart State Management

```tsx
// hooks/useCart.ts
"use client"

import { createContext, useContext, useReducer, useEffect } from 'react'

interface CartState {
  items: CartItem[]
  total: number
}

const CartContext = createContext<{
  state: CartState
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}>({
  state: { items: [], total: 0 },
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) })
    }
  }, [])
  
  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state))
  }, [state])
  
  return (
    <CartContext.Provider value={{ state, ...actions }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
```

### Product Filtering and Search

```tsx
// app/products/page.tsx
import { getProducts } from '@/lib/db'
import ProductList from '@/components/product/ProductList'
import ProductFilter from '@/components/product/ProductFilter'

interface ProductsPageProps {
  searchParams: {
    category?: string
    minPrice?: string
    maxPrice?: string
    search?: string
    sort?: string
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const products = await getProducts({
    category: searchParams.category,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    search: searchParams.search,
    sort: searchParams.sort,
  })
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-1/4">
          <ProductFilter searchParams={searchParams} />
        </aside>
        
        <main className="lg:w-3/4">
          <ProductList products={products} />
        </main>
      </div>
    </div>
  )
}
```

### Database Schema with Prisma

```prisma
// prisma/schema.prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  description String
  price       Float
  image       String
  category    String
  inStock     Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  reviews     Review[]
  cartItems   CartItem[]
  orderItems  OrderItem[]
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  accounts  Account[]
  sessions  Session[]
  reviews   Review[]
  cartItems CartItem[]
  orders    Order[]
}

model CartItem {
  id        String   @id @default(cuid())
  quantity  Int
  productId String
  userId    String
  createdAt DateTime @default(now())
  
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([productId, userId])
}

model Order {
  id        String      @id @default(cuid())
  total     Float
  status    OrderStatus @default(PENDING)
  userId    String
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  
  user      User         @relation(fields: [userId], references: [id])
  items     OrderItem[]
}

enum Role {
  USER
  ADMIN
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
```

## Deployment

This e-commerce platform is designed for deployment on Vercel with the following services:

- Database: Vercel Postgres or PlanetScale
- Authentication: NextAuth.js
- Payments: Stripe
- File Storage: Vercel Blob or Cloudinary

## Next Steps

After completing this project:
- Try the social media platform project
- Learn about real-time features with WebSockets
- Explore advanced performance optimization
- Implement advanced analytics

Happy selling!