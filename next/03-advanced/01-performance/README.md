# Performance Optimization in Next.js

This example covers advanced performance optimization techniques in Next.js, including code splitting, lazy loading, image optimization, bundle analysis, and Core Web Vitals improvement.

## Learning Objectives

- Implement code splitting and lazy loading
- Optimize images with next/image
- Optimize fonts with next/font
- Analyze and optimize bundle size
- Improve Core Web Vitals
- Implement caching strategies

## Project Structure

```
03-advanced/01-performance/
├── app/
│   ├── layout.tsx                    # Root layout with optimized fonts
│   ├── page.tsx                      # Home page with performance examples
│   ├── heavy/
│   │   └── page.tsx                  # Heavy component page
│   ├── images/
│   │   └── page.tsx                  # Image optimization examples
│   └── components/
│       ├── HeavyComponent.tsx        # Heavy component for lazy loading
│       ├── ImageGallery.tsx          # Image gallery with optimization
│       ├── LazyComponent.tsx         # Lazy loaded component
│       └── OptimizedList.tsx         # List with virtualization
├── lib/
│   ├── utils.ts                      # Utility functions
│   └── performance.ts                # Performance monitoring
├── public/
│   └── images/                       # Static images
└── README.md
```

## Key Concepts

### 1. Code Splitting and Lazy Loading

Split your code into smaller chunks and load them on demand:

```tsx
// components/LazyComponent.tsx
"use client"

import { useState } from 'react'

export default function LazyComponent() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <h2>Lazy Loaded Component</h2>
      <p>This component was loaded on demand</p>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  )
}

// app/heavy/page.tsx
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const LazyComponent = dynamic(() => import('../../components/LazyComponent'), {
  loading: () => <p>Loading component...</p>,
  ssr: false // Disable server-side rendering for this component
})

export default function HeavyPage() {
  return (
    <div>
      <h1>Heavy Components Page</h1>
      <p>This page demonstrates lazy loading of heavy components</p>
      
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  )
}
```

### 2. Image Optimization

Use the next/image component for optimized images:

```tsx
// components/ImageGallery.tsx
import Image from 'next/image'

export default function ImageGallery() {
  const images = [
    { src: '/images/image1.jpg', alt: 'Image 1', width: 800, height: 600 },
    { src: '/images/image2.jpg', alt: 'Image 2', width: 800, height: 600 },
    { src: '/images/image3.jpg', alt: 'Image 3', width: 800, height: 600 },
  ]
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div key={index} className="relative h-64">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index < 2} // Priority for first two images
          />
        </div>
      ))}
    </div>
  )
}
```

### 3. Font Optimization

Optimize fonts with next/font:

```tsx
// app/layout.tsx
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
```

### 4. Bundle Analysis

Analyze your bundle size with @next/bundle-analyzer:

```js
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // Optimize chunks
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize chunk splitting
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
          chunks: 'all',
        },
      },
    }
    return config
  },
}

module.exports = withBundleAnalyzer(nextConfig)
```

### 5. Virtualization for Long Lists

Implement virtualization for long lists:

```tsx
// components/OptimizedList.tsx
"use client"

import { FixedSizeList as List } from 'react-window'

const items = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`,
  description: `Description for item ${i}`,
}))

const Row = ({ index, style }) => (
  <div style={style} className="p-2 border-b">
    <h3 className="font-semibold">{items[index].name}</h3>
    <p className="text-sm text-gray-600">{items[index].description}</p>
  </div>
)

export default function OptimizedList() {
  return (
    <div>
      <h2>Virtualized List</h2>
      <p>This list renders 10,000 items efficiently</p>
      <div className="border rounded-lg">
        <List
          height={500}
          itemCount={items.length}
          itemSize={80}
          width="100%"
        >
          {Row}
        </List>
      </div>
    </div>
  )
}
```

### 6. Performance Monitoring

Monitor performance metrics:

```tsx
// lib/performance.ts
export function reportWebVitals(metric) {
  // Send metrics to analytics service
  console.log(metric)
  
  // Example: Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    })
  }
}

// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## Installation

```bash
npm install react-window @next/bundle-analyzer @vercel/analytics
```

## Running This Example

1. Navigate to this directory
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open http://localhost:3000 in your browser

## Bundle Analysis

To analyze your bundle:

```bash
npm run build
ANALYZE=true npm run build
```

## Performance Metrics

Monitor these key metrics:

- **First Contentful Paint (FCP)**: Time to first content
- **Largest Contentful Paint (LCP)**: Time to largest content
- **First Input Delay (FID)**: Time to first interaction
- **Cumulative Layout Shift (CLS)**: Visual stability
- **Time to Interactive (TTI)**: Time to full interactivity

## Exercises

1. Implement lazy loading for a heavy chart component
2. Create a responsive image gallery with optimized loading
3. Set up bundle analysis and optimize the largest chunks
4. Implement virtualization for a table with 1000+ rows
5. Add performance monitoring to track Core Web Vitals

## Next Steps

After completing this example, proceed to the SEO example to learn about search engine optimization in Next.js.