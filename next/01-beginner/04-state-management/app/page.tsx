'use client'

import { useState } from 'react'
import { useTheme } from './context/ThemeContext'
import { useCounterStore } from '../lib/store'
import LocalStateExample from './components/LocalStateExample'
import ShoppingCartExample from './components/ShoppingCartExample'
import ThemeToggleExample from './components/ThemeToggleExample'

export default function Home() {
  const { theme } = useTheme()
  const { count } = useCounterStore()
  const [activeTab, setActiveTab] = useState('local')

  return (
    <main className={`min-h-screen p-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">State Management in Next.js</h1>
        
        <div className="mb-8">
          <div className="flex border-b border-gray-300 dark:border-gray-600">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'local'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('local')}
            >
              Local State
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'context'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('context')}
            >
              Context API
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'zustand'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('zustand')}
            >
              Zustand Store
            </button>
          </div>
        </div>

        <div className="mb-8 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <p className="text-sm">
            <strong>Current Global Counter:</strong> {count}
          </p>
          <p className="text-sm">
            <strong>Current Theme:</strong> {theme}
          </p>
        </div>

        <div className="space-y-8">
          {activeTab === 'local' && <LocalStateExample />}
          {activeTab === 'context' && <ThemeToggleExample />}
          {activeTab === 'zustand' && <ShoppingCartExample />}
        </div>
      </div>
    </main>
  )
}