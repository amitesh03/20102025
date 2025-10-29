# Performance Optimization Exercises

These exercises will help you practice advanced performance optimization techniques in Next.js.

## Exercise 1: Implement Bundle Analysis and Optimization

Create a Next.js application with bundle analysis and optimization features.

### Requirements:

1. Set up bundle analyzer to analyze your bundle sizes
2. Implement dynamic imports for heavy components
3. Optimize imports to reduce bundle size
4. Use tree shaking to remove unused code
5. Implement code splitting by routes

### Hints

- Install @next/bundle-analyzer
- Use Next.js dynamic import for components
- Use specific imports instead of importing entire libraries
- Analyze the bundle to identify large chunks

### Solution

<details>
<summary>Click to see solution</summary>

First, install the bundle analyzer:

```bash
npm install @next/bundle-analyzer
```

Update `next.config.js`:

```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Other config options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable SWC minification
  swcMinify: true,
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = withBundleAnalyzer(nextConfig)
```

Create a heavy component at `components/heavy-chart.tsx`:

```typescript
import { useEffect, useRef } from 'react'

// This component simulates a heavy chart library
export default function HeavyChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Simulate heavy computation
    const data = Array.from({ length: 1000 }, () => Math.random() * 100)
    
    // Draw chart
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw axes
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(40, 20)
    ctx.lineTo(40, canvas.height - 40)
    ctx.lineTo(canvas.width - 20, canvas.height - 40)
    ctx.stroke()
    
    // Draw data
    const stepX = (canvas.width - 60) / (data.length - 1)
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.beginPath()
    
    data.forEach((value, index) => {
      const x = 40 + index * stepX
      const y = canvas.height - 40 - (value / 100) * (canvas.height - 60)
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    
    ctx.stroke()
  }, [])

  return (
    <div className="w-full h-64 bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Heavy Chart Component</h3>
      <canvas
        ref={canvasRef}
        className="w-full h-48"
      />
    </div>
  )
}
```

Create a page that uses dynamic imports at `app/performance/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

// Dynamically import the heavy component
const HeavyChart = dynamic(
  () => import('../../components/heavy-chart'),
  {
    loading: () => (
      <div className="w-full h-64 bg-white rounded-lg shadow p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    ),
    ssr: false // Disable server-side rendering for this component
  }
)

// Use specific imports instead of importing the entire library
import { format } from 'date-fns'

export default function PerformancePage() {
  const [showChart, setShowChart] = useState(false)
  const [showImages, setShowImages] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Performance Optimization</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Dynamic Component Loading</h2>
          <p className="text-gray-600 mb-4">
            This chart component is loaded only when needed, reducing the initial bundle size.
          </p>
          <button
            onClick={() => setShowChart(!showChart)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showChart ? 'Hide Chart' : 'Load Chart'}
          </button>
          
          {showChart && (
            <div className="mt-4">
              <HeavyChart />
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Optimized Images</h2>
          <p className="text-gray-600 mb-4">
            Images are optimized with Next.js Image component, lazy loading, and modern formats.
          </p>
          <button
            onClick={() => setShowImages(!showImages)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showImages ? 'Hide Images' : 'Load Images'}
          </button>
          
          {showImages && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="relative h-32">
                <Image
                  src="https://picsum.photos/seed/perf1/300/200.jpg"
                  alt="Performance 1"
                  fill
                  className="object-cover rounded"
                  loading="lazy"
                />
              </div>
              <div className="relative h-32">
                <Image
                  src="https://picsum.photos/seed/perf2/300/200.jpg"
                  alt="Performance 2"
                  fill
                  className="object-cover rounded"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Optimization Techniques</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-medium mb-2">Dynamic Imports</h3>
            <p className="text-sm text-gray-600">
              Load components only when needed to reduce initial bundle size.
            </p>
          </div>
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-medium mb-2">Image Optimization</h3>
            <p className="text-sm text-gray-600">
              Use Next.js Image component with lazy loading and modern formats.
            </p>
          </div>
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-medium mb-2">Tree Shaking</h3>
            <p className="text-sm text-gray-600">
              Import only what you need to reduce bundle size.
            </p>
          </div>
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-medium mb-2">Code Splitting</h3>
            <p className="text-sm text-gray-600">
              Split code into smaller chunks for better caching.
            </p>
          </div>
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-medium mb-2">Bundle Analysis</h3>
            <p className="text-sm text-gray-600">
              Analyze bundle size to identify optimization opportunities.
            </p>
          </div>
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-medium mb-2">Minification</h3>
            <p className="text-sm text-gray-600">
              Minify code and remove console logs in production.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">How to Analyze Bundle Size</h2>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm">
{`# Install bundle analyzer
npm install @next/bundle-analyzer

# Analyze your bundle
ANALYZE=true npm run build`}
          </pre>
        </div>
        <p className="mt-4 text-gray-700">
          Run the command above to analyze your bundle size and identify optimization opportunities.
        </p>
      </div>
    </div>
  )
}
```

</details>

---

## Exercise 2: Implement Image Optimization Strategies

Create a page that demonstrates various image optimization techniques in Next.js.

### Requirements:

1. Use Next.js Image component with proper sizing
2. Implement lazy loading for images
3. Add blur placeholders for better UX
4. Use responsive images with srcset
5. Optimize image formats (WebP, AVIF)

### Hints

- Use the Image component from next/image
- Specify width and height to prevent layout shift
- Add placeholder="blur" with blurDataURL
- Use sizes attribute for responsive images
- Configure image domains in next.config.js

### Solution

<details>
<summary>Click to see solution</summary>

Update `next.config.js` to allow external images:

```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other config
  images: {
    domains: ['picsum.photos'],
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = withBundleAnalyzer(nextConfig)
```

Create an image optimization page at `app/image-optimization/page.tsx`:

```typescript
import Image from 'next/image'

// Generate a low-quality image placeholder for blur effect
function getBlurDataURL(width: number, height: number) {
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="sans-serif">Loading...</text>
    </svg>`
  ).toString('base64')}`
}

export default function ImageOptimizationPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Image Optimization Techniques</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Basic Image</h2>
          <p className="text-gray-600 mb-4">
            Standard image with Next.js optimization
          </p>
          <div className="relative h-64">
            <Image
              src="https://picsum.photos/seed/basic/800/600.jpg"
              alt="Basic optimized image"
              fill
              className="object-cover rounded-lg"
              loading="lazy"
            />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Image with Blur Placeholder</h2>
          <p className="text-gray-600 mb-4">
            Image with blur placeholder for better perceived performance
          </p>
          <div className="relative h-64">
            <Image
              src="https://picsum.photos/seed/blur/800/600.jpg"
              alt="Image with blur placeholder"
              fill
              className="object-cover rounded-lg"
              loading="lazy"
              placeholder="blur"
              blurDataURL={getBlurDataURL(800, 600)}
            />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Priority Image</h2>
          <p className="text-gray-600 mb-4">
            Above-the-fold image with priority loading
          </p>
          <div className="relative h-64">
            <Image
              src="https://picsum.photos/seed/priority/800/600.jpg"
              alt="Priority image"
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Responsive Image</h2>
          <p className="text-gray-600 mb-4">
            Image that adapts to different screen sizes
          </p>
          <div className="relative h-64">
            <Image
              src="https://picsum.photos/seed/responsive/1200/600.jpg"
              alt="Responsive image"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Image Gallery with Lazy Loading</h2>
        <p className="text-gray-600 mb-4">
          Images below are loaded only when they enter the viewport
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="relative h-48">
              <Image
                src={`https://picsum.photos/seed/gallery${i}/400/300.jpg`}
                alt={`Gallery image ${i + 1}`}
                fill
                className="object-cover rounded-lg"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Image Optimization Best Practices</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-medium">Use Next.js Image Component</h3>
            <p className="text-gray-600">
              The Image component automatically optimizes images for different devices and screen sizes.
            </p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-medium">Specify Width and Height</h3>
            <p className="text-gray-600">
              Always specify width and height to prevent layout shift and improve Core Web Vitals.
            </p>
          </div>
          
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-medium">Use Lazy Loading</h3>
            <p className="text-gray-600">
              Load images only when they're needed to improve initial page load time.
            </p>
          </div>
          
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="font-medium">Add Placeholders</h3>
            <p className="text-gray-600">
              Use blur placeholders to improve perceived performance and user experience.
            </p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-medium">Optimize Formats</h3>
            <p className="text-gray-600">
              Use modern image formats like WebP and AVIF for better compression and quality.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

</details>

---

## Exercise 3: Implement Performance Monitoring

Create a performance monitoring system that tracks Core Web Vitals and other performance metrics.

### Requirements:

1. Measure Core Web Vitals (LCP, FID, CLS)
2. Track custom performance metrics
3. Create a performance dashboard
4. Implement performance budgets
5. Add performance alerts

### Hints

- Use the Web Vitals library
- Create a custom performance monitoring hook
- Store metrics in localStorage or send to analytics
- Visualize metrics with charts
- Set thresholds for performance budgets

### Solution

<details>
<summary>Click to see solution</summary>

First, install the web-vitals library:

```bash
npm install web-vitals
```

Create a performance monitoring hook at `lib/use-performance-monitoring.ts`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

interface Metric {
  name: string
  value: number
  id: string
  delta: number
}

interface PerformanceMetrics {
  cls: Metric | null
  fid: Metric | null
  fcp: Metric | null
  lcp: Metric | null
  ttfb: Metric | null
}

export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cls: null,
    fid: null,
    fcp: null,
    lcp: null,
    ttfb: null,
  })
  const [customMetrics, setCustomMetrics] = useState<Record<string, number>>({})

  useEffect(() => {
    // Measure Core Web Vitals
    const handleCLS = (metric: Metric) => {
      setMetrics(prev => ({ ...prev, cls: metric }))
      reportMetric('CLS', metric)
    }

    const handleFID = (metric: Metric) => {
      setMetrics(prev => ({ ...prev, fid: metric }))
      reportMetric('FID', metric)
    }

    const handleFCP = (metric: Metric) => {
      setMetrics(prev => ({ ...prev, fcp: metric }))
      reportMetric('FCP', metric)
    }

    const handleLCP = (metric: Metric) => {
      setMetrics(prev => ({ ...prev, lcp: metric }))
      reportMetric('LCP', metric)
    }

    const handleTTFB = (metric: Metric) => {
      setMetrics(prev => ({ ...prev, ttfb: metric }))
      reportMetric('TTFB', metric)
    }

    getCLS(handleCLS)
    getFID(handleFID)
    getFCP(handleFCP)
    getLCP(handleLCP)
    getTTFB(handleTTFB)
  }, [])

  const reportMetric = (name: string, metric: Metric) => {
    // In a real app, you would send this to your analytics service
    console.log(`[Performance] ${name}:`, metric)
    
    // Store in localStorage for demo purposes
    const stored = localStorage.getItem('performance-metrics')
    const allMetrics = stored ? JSON.parse(stored) : {}
    
    allMetrics[`${name}-${metric.id}`] = {
      name,
      value: metric.value,
      timestamp: Date.now(),
    }
    
    localStorage.setItem('performance-metrics', JSON.stringify(allMetrics))
  }

  const measureCustomMetric = (name: string, fn: () => void) => {
    const start = performance.now()
    fn()
    const end = performance.now()
    const duration = end - start
    
    setCustomMetrics(prev => ({ ...prev, [name]: duration }))
    
    // Store in localStorage
    const stored = localStorage.getItem('custom-metrics')
    const allMetrics = stored ? JSON.parse(stored) : {}
    
    allMetrics[`${name}-${Date.now()}`] = {
      name,
      value: duration,
      timestamp: Date.now(),
    }
    
    localStorage.setItem('custom-metrics', JSON.stringify(allMetrics))
  }

  const getPerformanceRating = (metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    const thresholds: Record<string, { good: number; poor: number }> = {
      CLS: { good: 0.1, poor: 0.25 },
      FID: { good: 100, poor: 300 },
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      TTFB: { good: 800, poor: 1800 },
    }
    
    const threshold = thresholds[metricName]
    if (!threshold) return 'good'
    
    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
  }

  const getRatingColor = (rating: 'good' | 'needs-improvement' | 'poor') => {
    switch (rating) {
      case 'good': return 'text-green-600'
      case 'needs-improvement': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
    }
  }

  return {
    metrics,
    customMetrics,
    measureCustomMetric,
    getPerformanceRating,
    getRatingColor,
  }
}
```

Create a performance dashboard at `app/performance-dashboard/page.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { usePerformanceMonitoring } from '../../../lib/use-performance-monitoring'

interface MetricHistory {
  name: string
  value: number
  timestamp: number
}

export default function PerformanceDashboard() {
  const { metrics, customMetrics, measureCustomMetric, getPerformanceRating, getRatingColor } = usePerformanceMonitoring()
  const [history, setHistory] = useState<Record<string, MetricHistory[]>>({})

  useEffect(() => {
    // Load metrics history from localStorage
    const metricsData = localStorage.getItem('performance-metrics')
    const customData = localStorage.getItem('custom-metrics')
    
    const allHistory: Record<string, MetricHistory[]> = {}
    
    if (metricsData) {
      const data = JSON.parse(metricsData)
      Object.values(data).forEach((metric: any) => {
        if (!allHistory[metric.name]) {
          allHistory[metric.name] = []
        }
        allHistory[metric.name].push(metric)
      })
    }
    
    if (customData) {
      const data = JSON.parse(customData)
      Object.values(data).forEach((metric: any) => {
        if (!allHistory[metric.name]) {
          allHistory[metric.name] = []
        }
        allHistory[metric.name].push(metric)
      })
    }
    
    // Sort by timestamp and keep only the last 10 entries
    Object.keys(allHistory).forEach(key => {
      allHistory[key].sort((a, b) => a.timestamp - b.timestamp)
      allHistory[key] = allHistory[key].slice(-10)
    })
    
    setHistory(allHistory)
  }, [])

  const simulateHeavyOperation = () => {
    measureCustomMetric('Heavy Operation', () => {
      // Simulate a heavy operation
      const start = performance.now()
      while (performance.now() - start < 100) {
        // Busy wait for 100ms
      }
    })
  }

  const simulateNetworkRequest = () => {
    measureCustomMetric('Network Request', async () => {
      // Simulate a network request
      await fetch('https://jsonplaceholder.typicode.com/posts/1')
    })
  }

  const formatMetricValue = (name: string, value: number): string => {
    switch (name) {
      case 'CLS':
        return value.toFixed(3)
      case 'FID':
      case 'FCP':
      case 'LCP':
      case 'TTFB':
        return `${Math.round(value)}ms`
      default:
        return `${Math.round(value)}ms`
    }
  }

  const getMetricDescription = (name: string): string => {
    switch (name) {
      case 'CLS':
        return 'Cumulative Layout Shift - measures visual stability'
      case 'FID':
        return 'First Input Delay - measures interactivity'
      case 'FCP':
        return 'First Contentful Paint - measures loading performance'
      case 'LCP':
        return 'Largest Contentful Paint - measures loading performance'
      case 'TTFB':
        return 'Time to First Byte - measures server response time'
      default:
        return 'Custom performance metric'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Performance Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Core Web Vitals</h2>
          <div className="space-y-4">
            {Object.entries(metrics).map(([key, metric]) => (
              metric && (
                <div key={key} className="border-b border-gray-200 pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{key}</h3>
                      <p className="text-sm text-gray-600">{getMetricDescription(key)}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${getRatingColor(getPerformanceRating(key, metric.value))}`}>
                        {formatMetricValue(key, metric.value)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Rating: {getPerformanceRating(key, metric.value)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Custom Metrics</h2>
          <div className="space-y-4 mb-4">
            {Object.entries(customMetrics).map(([name, value]) => (
              <div key={name} className="flex justify-between items-center">
                <h3 className="font-medium">{name}</h3>
                <p className="font-semibold text-blue-600">
                  {formatMetricValue(name, value)}
                </p>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Test Performance</h3>
            <button
              onClick={simulateHeavyOperation}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Simulate Heavy Operation
            </button>
            <button
              onClick={simulateNetworkRequest}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Simulate Network Request
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Performance Budgets</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-medium">Good Performance</h3>
            <ul className="text-sm text-gray-600 mt-1">
              <li>CLS < 0.1</li>
              <li>FID < 100ms</li>
              <li>FCP < 1.8s</li>
              <li>LCP < 2.5s</li>
              <li>TTFB < 800ms</li>
            </ul>
          </div>
          
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-medium">Needs Improvement</h3>
            <ul className="text-sm text-gray-600 mt-1">
              <li>CLS 0.1 - 0.25</li>
              <li>FID 100ms - 300ms</li>
              <li>FCP 1.8s - 3s</li>
              <li>LCP 2.5s - 4s</li>
              <li>TTFB 800ms - 1.8s</li>
            </ul>
          </div>
          
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="font-medium">Poor Performance</h3>
            <ul className="text-sm text-gray-600 mt-1">
              <li>CLS > 0.25</li>
              <li>FID > 300ms</li>
              <li>FCP > 3s</li>
              <li>LCP > 4s</li>
              <li>TTFB > 1.8s</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
```

</details>

---

## Exercise 4: Implement Service Worker for Caching

Create a Progressive Web App (PWA) with service worker for offline functionality and caching.

### Requirements:

1. Register a service worker
2. Implement caching strategies
3. Add offline support
4. Create a offline fallback page
5. Implement background sync

### Hints

- Use the Web App Manifest
- Implement different caching strategies (cache first, network first, etc.)
- Use the Cache API for storing responses
- Handle offline scenarios gracefully
- Implement push notifications

### Solution

<details>
<summary>Click to see solution</summary>

Create a public manifest file at `public/manifest.json`:

```json
{
  "name": "Next.js Performance App",
  "short_name": "Perf App",
  "description": "A Next.js app with performance optimization",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Create a service worker at `public/sw.js`:

```javascript
const CACHE_NAME = 'nextjs-performance-v1'
const urlsToCache = [
  '/',
  '/performance',
  '/image-optimization',
  '/performance-dashboard',
  '/static/js/main.js',
  '/static/css/main.css',
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response
        }

        // Clone the request
        const fetchRequest = event.request.clone()

        return fetch(fetchRequest)
          .then((response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Clone the response
            const responseToCache = response.clone()

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })

            return response
          })
          .catch(() => {
            // If fetch fails, try to serve from cache
            return caches.match(event.request)
              .then((response) => {
                if (response) {
                  return response
                }
                
                // If it's an HTML request, serve the offline page
                if (event.request.headers.get('accept').includes('text/html')) {
                  return caches.match('/offline')
                }
              })
          })
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})
```

Create an offline page at `app/offline/page.tsx`:

```typescript
export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center p-6">
        <div className="mb-6">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">You're offline</h1>
        <p className="text-gray-600 mb-6">
          It looks like you've lost your internet connection. Please check your network settings and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
```

Create a service worker registration hook at `lib/use-service-worker.ts`:

```typescript
'use client'

import { useEffect, useState } from 'react'

export function useServiceWorker() {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false)

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineMessage(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineMessage(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope)
          setServiceWorkerReady(true)
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }
  }, [])

  const hideOfflineMessage = () => {
    setShowOfflineMessage(false)
  }

  return {
    isOnline,
    showOfflineMessage,
    serviceWorkerReady,
    hideOfflineMessage,
  }
}
```

Update the layout to include the service worker at `app/layout.tsx`:

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ServiceWorkerProvider from './service-worker-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next.js Performance App',
  description: 'A Next.js app with performance optimization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={inter.className}>
        <ServiceWorkerProvider>
          {children}
        </ServiceWorkerProvider>
      </body>
    </html>
  )
}
```

Create a service worker provider component at `app/service-worker-provider.tsx`:

```typescript
'use client'

import { useServiceWorker } from '../lib/use-service-worker'

export default function ServiceWorkerProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { isOnline, showOfflineMessage, hideOfflineMessage } = useServiceWorker()

  return (
    <>
      {children}
      
      {showOfflineMessage && (
        <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-white p-4 text-center">
          <p>You are currently offline. Some features may not be available.</p>
          <button
            onClick={hideOfflineMessage}
            className="mt-2 bg-yellow-600 text-white px-3 py-1 rounded text-sm"
          >
            Dismiss
          </button>
        </div>
      )}
      
      {!isOnline && !showOfflineMessage && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-2 text-center text-sm">
          No internet connection
        </div>
      )}
    </>
  )
}
```

</details>

---

## Additional Challenges

1. Implement request deduplication to prevent duplicate API calls
2. Add performance budgets with webpack-bundle-analyzer
3. Create a real-time performance monitoring dashboard
4. Implement predictive prefetching based on user behavior
5. Add resource hints (preconnect, prefetch, preload) for critical resources

These exercises will help you master advanced performance optimization techniques in Next.js.