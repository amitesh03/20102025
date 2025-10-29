'use client'

import { useState } from 'react'
import { useCartStore, useCounterStore } from '../../lib/store'

const products = [
  { id: 1, name: 'T-Shirt', price: 20 },
  { id: 2, name: 'Jeans', price: 50 },
  { id: 3, name: 'Sneakers', price: 80 },
  { id: 4, name: 'Hat', price: 15 },
  { id: 5, name: 'Backpack', price: 40 }
]

export default function ShoppingCartExample() {
  const { items, addItem, removeItem, updateQuantity, clearCart } = useCartStore()
  const { count, increment, decrement, reset } = useCounterStore()
  const [notification, setNotification] = useState('')

  const handleAddItem = (product: typeof products[0]) => {
    addItem(product)
    setNotification(`${product.name} added to cart!`)
    setTimeout(() => setNotification(''), 2000)
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Global State with Zustand</h2>
      
      {notification && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
          {notification}
        </div>
      )}
      
      <div className="space-y-6">
        {/* Global Counter Example */}
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
          <h3 className="text-lg font-medium mb-2">Global Counter</h3>
          <div className="flex items-center space-x-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={decrement}
            >
              -
            </button>
            <span className="text-xl font-medium">{count}</span>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={increment}
            >
              +
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={reset}
            >
              Reset
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            This counter is shared across all components using Zustand
          </p>
        </div>

        {/* Product List */}
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
          <h3 className="text-lg font-medium mb-2">Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <div key={product.id} className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-gray-600 dark:text-gray-400">${product.price}</p>
                <button
                  className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm w-full"
                  onClick={() => handleAddItem(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Shopping Cart */}
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Shopping Cart</h3>
            {items.length > 0 && (
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            )}
          </div>
          
          {items.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
          ) : (
            <div>
              <ul className="space-y-2 mb-4">
                {items.map(item => (
                  <li key={item.id} className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">${item.price}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded text-sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded text-sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded text-sm ml-2"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-lg">Total:</span>
                  <span className="font-bold text-xl">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded">
          <h3 className="text-lg font-medium mb-2">How Zustand Works</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Zustand is a lightweight state management library</li>
            <li>State is stored in a centralized store</li>
            <li>Components subscribe to specific parts of the state</li>
            <li>Only components that use the changed state re-render</li>
            <li>No providers are needed - just import and use the hooks</li>
            <li>State persists across component unmounts and remounts</li>
          </ul>
        </div>
      </div>
    </div>
  )
}