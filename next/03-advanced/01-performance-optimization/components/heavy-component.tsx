'use client'

import { useEffect, useState } from 'react'

// This is a mock heavy component that simulates expensive operations
export default function HeavyComponent() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate heavy computation
    const timer = setTimeout(() => {
      const heavyData = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        value: Math.random() * 100,
        description: `This is a description for item ${i} with some additional content to make it heavier.`,
        category: `Category ${i % 10}`,
        tags: Array.from({ length: 5 }, (_, j) => `tag-${i}-${j}`)
      }))
      
      setData(heavyData)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="card-container">
      <h3 className="text-lg font-semibold mb-4">Heavy Component (1000 items)</h3>
      <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item) => (
            <div key={item.id} className="bg-white p-3 rounded shadow hover-card">
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {item.category}
                </span>
                <span className="text-sm font-medium">{item.value.toFixed(2)}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {item.tags.map((tag: string, index: number) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-600 px-1 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}