'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Activity, Zap, Image, Code, BarChart3, Package } from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">Next.js Performance Optimization</h1>
          <p className="text-xl mb-8">Learn techniques to optimize your Next.js applications for better performance</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'lazy-loading', label: 'Lazy Loading', icon: Package },
              { id: 'image-optimization', label: 'Image Optimization', icon: Image },
              { id: 'code-splitting', label: 'Code Splitting', icon: Code },
              { id: 'monitoring', label: 'Monitoring', icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center">
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'lazy-loading' && <LazyLoadingTab />}
          {activeTab === 'image-optimization' && <ImageOptimizationTab />}
          {activeTab === 'code-splitting' && <CodeSplittingTab />}
          {activeTab === 'monitoring' && <MonitoringTab />}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Zap className="h-8 w-8 text-yellow-500 mr-3" />
              <h3 className="text-lg font-semibold">Fast Performance</h3>
            </div>
            <p className="text-gray-600">Optimize your app for lightning-fast load times and smooth user experience.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-8 w-8 text-green-500 mr-3" />
              <h3 className="text-lg font-semibold">Better Metrics</h3>
            </div>
            <p className="text-gray-600">Improve Core Web Vitals and other performance metrics for better SEO.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Package className="h-8 w-8 text-blue-500 mr-3" />
              <h3 className="text-lg font-semibold">Smaller Bundles</h3>
            </div>
            <p className="text-gray-600">Reduce bundle sizes with code splitting and tree shaking techniques.</p>
          </div>
        </div>
      </div>
    </main>
  )
}

function OverviewTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Performance Optimization Overview</h2>
      <div className="prose max-w-none">
        <p className="mb-4">
          Performance optimization is crucial for providing a great user experience and improving your app's SEO rankings.
          Next.js provides several built-in features and techniques to optimize your application.
        </p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Key Performance Metrics</h3>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li><strong>First Contentful Paint (FCP):</strong> Time when the first content is painted</li>
          <li><strong>Largest Contentful Paint (LCP):</strong> Time when the largest content is painted</li>
          <li><strong>First Input Delay (FID):</strong> Time from user's first interaction to response</li>
          <li><strong>Cumulative Layout Shift (CLS):</strong> Measure of visual stability</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Optimization Techniques</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Code Splitting</h4>
            <p className="text-sm text-gray-600">Split your code into smaller chunks to reduce initial load time</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Lazy Loading</h4>
            <p className="text-sm text-gray-600">Load components and images only when needed</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Image Optimization</h4>
            <p className="text-sm text-gray-600">Optimize images with next/image component</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Bundle Analysis</h4>
            <p className="text-sm text-gray-600">Analyze and optimize your bundle sizes</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function LazyLoadingTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Lazy Loading</h2>
      <div className="prose max-w-none">
        <p className="mb-4">
          Lazy loading is a technique to defer loading of non-critical resources until they're needed.
          This helps reduce initial page load time and improves perceived performance.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Dynamic Imports</h3>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-6 overflow-x-auto">
          <pre className="text-sm">
{`// Dynamic import with loading state
const DynamicComponent = dynamic(
  () => import('../components/heavy-component'),
  {
    loading: () => <p>Loading...</p>,
    ssr: false // Disable server-side rendering
  }
)`}
          </pre>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Lazy Loading Images</h3>
        <p className="mb-4">
          Use Next.js Image component with lazy loading for better performance:
        </p>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-6 overflow-x-auto">
          <pre className="text-sm">
{`import Image from 'next/image'

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={500}
  height={300}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>`}
          </pre>
        </div>
      </div>
    </div>
  )
}

function ImageOptimizationTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Image Optimization</h2>
      <div className="prose max-w-none">
        <p className="mb-4">
          Images are often the largest contributors to page weight. Next.js provides built-in image optimization
          to serve images in modern formats with appropriate sizes.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Next.js Image Component Features</h3>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Automatic optimization (WebP, AVIF)</li>
          <li>Responsive images with srcset</li>
          <li>Lazy loading by default</li>
          <li>Prevents layout shift with aspect ratio</li>
          <li>Placeholder support (blur, empty)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Use Appropriate Sizes</h4>
            <p className="text-sm text-gray-600">Specify width and height to prevent layout shift</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Optimize Formats</h4>
            <p className="text-sm text-gray-600">Use modern formats like WebP and AVIF</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Add Placeholders</h4>
            <p className="text-sm text-gray-600">Use blur placeholders for better UX</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Priority Loading</h4>
            <p className="text-sm text-gray-600">Mark above-the-fold images with priority</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CodeSplittingTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Code Splitting</h2>
      <div className="prose max-w-none">
        <p className="mb-4">
          Code splitting is a technique to split your code into smaller chunks that can be loaded on demand.
          This reduces the initial bundle size and improves load time.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Automatic Code Splitting</h3>
        <p className="mb-4">
          Next.js automatically splits your code by pages. Each page gets its own JavaScript bundle.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Dynamic Imports</h3>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-6 overflow-x-auto">
          <pre className="text-sm">
{`// Import a component dynamically
import dynamic from 'next/dynamic'

const DynamicChart = dynamic(() => import('../components/chart'), {
  loading: () => <p>Loading chart...</p>
})

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <DynamicChart />
    </div>
  )
}`}
          </pre>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Bundle Analysis</h3>
        <p className="mb-4">
          Use the Next.js bundle analyzer to analyze your bundle sizes:
        </p>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-6 overflow-x-auto">
          <pre className="text-sm">
{`# Install bundle analyzer
npm install @next/bundle-analyzer

# Add to next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

# Analyze your bundle
ANALYZE=true npm run build`}
          </pre>
        </div>
      </div>
    </div>
  )
}

function MonitoringTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Performance Monitoring</h2>
      <div className="prose max-w-none">
        <p className="mb-4">
          Monitoring your app's performance is essential to identify and fix issues.
          Next.js provides built-in tools and integrates with external monitoring services.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Web Vitals</h3>
        <p className="mb-4">
          Next.js includes a built-in Web Vitals report to measure performance:
        </p>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-6 overflow-x-auto">
          <pre className="text-sm">
{`// pages/_app.js
export function reportWebVitals(metric) {
  console.log(metric)
  // Send to analytics service
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_category: 'Web Vitals'
    })
  }
}`}
          </pre>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Performance Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Lighthouse</h4>
            <p className="text-sm text-gray-600">Audit your app's performance, accessibility, and more</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Chrome DevTools</h4>
            <p className="text-sm text-gray-600">Profile and debug performance issues</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">WebPageTest</h4>
            <p className="text-sm text-gray-600">Test your app from different locations and devices</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Speed Insights</h4>
            <p className="text-sm text-gray-600">Monitor real-world performance with Vercel</p>
          </div>
        </div>
      </div>
    </div>
  )
}