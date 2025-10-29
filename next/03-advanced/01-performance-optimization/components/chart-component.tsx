'use client'

import { useEffect, useRef } from 'react'

// Mock chart component that simulates a heavy chart library
export default function ChartComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Generate random data
    const dataPoints = 50
    const data = Array.from({ length: dataPoints }, () => Math.random() * 100)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw axes
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(40, 20)
    ctx.lineTo(40, canvas.height - 40)
    ctx.lineTo(canvas.width - 20, canvas.height - 40)
    ctx.stroke()

    // Draw data points and lines
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2
    const stepX = chartWidth / (data.length - 1)

    // Draw line chart
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.beginPath()

    data.forEach((value, index) => {
      const x = padding + index * stepX
      const y = canvas.height - padding - (value / 100) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw data points
    data.forEach((value, index) => {
      const x = padding + index * stepX
      const y = canvas.height - padding - (value / 100) * chartHeight

      ctx.fillStyle = '#3b82f6'
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw labels
    ctx.fillStyle = '#6b7280'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'

    // X-axis labels
    for (let i = 0; i < data.length; i += 10) {
      const x = padding + i * stepX
      ctx.fillText(`${i}`, x, canvas.height - 20)
    }

    // Y-axis labels
    ctx.textAlign = 'right'
    for (let i = 0; i <= 100; i += 25) {
      const y = canvas.height - padding - (i / 100) * chartHeight
      ctx.fillText(`${i}`, 30, y + 4)
    }

    // Title
    ctx.textAlign = 'center'
    ctx.font = 'bold 16px sans-serif'
    ctx.fillStyle = '#111827'
    ctx.fillText('Performance Metrics Over Time', canvas.width / 2, 20)
  }, [])

  return (
    <div className="card-container">
      <h3 className="text-lg font-semibold mb-4">Chart Component</h3>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <canvas
          ref={canvasRef}
          className="w-full h-64 gpu-accelerated"
          style={{ width: '100%', height: '256px' }}
        />
      </div>
      <p className="text-sm text-gray-600 mt-2">
        This chart is rendered using HTML5 Canvas API, which is efficient for complex visualizations.
      </p>
    </div>
  )
}