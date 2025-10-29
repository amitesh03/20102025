'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

// Dynamically import the heavy component
const HeavyComponent = dynamic(
  () => import('../../components/heavy-component'),
  {
    loading: () => <div className="skeleton h-64 w-full rounded-lg mb-4"></div>,
    ssr: false // Disable server-side rendering for this component
  }
)

// Dynamically import the chart component
const ChartComponent = dynamic(
  () => import('../../components/chart-component'),
  {
    loading: () => <div className="skeleton h-64 w-full rounded-lg mb-4"></div>,
  }
)

export default function LazyLoadingPage() {
  const [showComponent, setShowComponent] = useState(false)
  const [showChart, setShowChart] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Lazy Loading Examples</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Dynamic Component Loading</h2>
          <p className="text-gray-600 mb-4">
            Click the button below to load a heavy component dynamically. This reduces the initial bundle size.
          </p>
          
          <button
            onClick={() => setShowComponent(!showComponent)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {showComponent ? 'Hide Component' : 'Load Component'}
          </button>
          
          {showComponent && (
            <div className="mt-6">
              <HeavyComponent />
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Lazy Image Loading</h2>
          <p className="text-gray-600 mb-4">
            Images below are loaded only when they enter the viewport, improving initial page load time.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative h-64">
              <Image
                src="https://images.unsplash.com/photo-1558655146-d09347e92766?w=500&h=300&fit=crop"
                alt="Mountain landscape"
                fill
                className="object-cover rounded-lg"
                loading="lazy"
              />
            </div>
            <div className="relative h-64">
              <Image
                src="https://images.unsplash.com/photo-1579546929518-9e396f3a8036?w=500&h=300&fit=crop"
                alt="Ocean view"
                fill
                className="object-cover rounded-lg"
                loading="lazy"
              />
            </div>
            <div className="relative h-64">
              <Image
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop"
                alt="Forest path"
                fill
                className="object-cover rounded-lg"
                loading="lazy"
              />
            </div>
            <div className="relative h-64">
              <Image
                src="https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=500&h=300&fit=crop"
                alt="Desert landscape"
                fill
                className="object-cover rounded-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Dynamic Chart Loading</h2>
          <p className="text-gray-600 mb-4">
            Charts are often heavy components. Load them dynamically when needed.
          </p>
          
          <button
            onClick={() => setShowChart(!showChart)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {showChart ? 'Hide Chart' : 'Load Chart'}
          </button>
          
          {showChart && (
            <div className="mt-6">
              <ChartComponent />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}