'use client'

import { useState } from 'react'

export default function LocalStateExample() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')
  const [isVisible, setIsVisible] = useState(true)
  const [items, setItems] = useState<string[]>([])

  const addItem = () => {
    if (name.trim()) {
      setItems([...items, name])
      setName('')
    }
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Local State with useState</h2>
      
      <div className="space-y-6">
        {/* Counter Example */}
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
          <h3 className="text-lg font-medium mb-2">Counter</h3>
          <div className="flex items-center space-x-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setCount(count - 1)}
            >
              -
            </button>
            <span className="text-xl font-medium">{count}</span>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setCount(count + 1)}
            >
              +
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={() => setCount(0)}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Input Example */}
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
          <h3 className="text-lg font-medium mb-2">Input Field</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              placeholder="Enter an item"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            />
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={addItem}
            >
              Add
            </button>
          </div>
        </div>

        {/* List Example */}
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
          <h3 className="text-lg font-medium mb-2">Item List</h3>
          {items.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No items yet</p>
          ) : (
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{item}</span>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Toggle Example */}
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
          <h3 className="text-lg font-medium mb-2">Toggle Visibility</h3>
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? 'Hide' : 'Show'} Content
          </button>
          {isVisible && (
            <div className="mt-4 p-4 bg-purple-100 dark:bg-purple-900 rounded">
              <p>This content can be toggled on and off!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}