import { notFound } from 'next/navigation'
import Link from 'next/link'
import products from '../../../../data/products.json'

async function getProduct(id: string) {
  const product = products.find(p => p.id === id)
  return product
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  
  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/products" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">{product.name}</h1>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-lg">Product Image</span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-blue-600">${product.price}</span>
              <div>
                {product.inStock ? (
                  <span className="text-green-600 font-medium">In Stock</span>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </div>
            </div>
            
            <div>
              <span className="text-gray-600">Category: </span>
              <span className="font-medium">{product.category}</span>
            </div>
            
            <button 
              className={`w-full py-3 px-4 rounded font-bold transition-colors ${
                product.inStock 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!product.inStock}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">Route Information</h2>
        <p className="text-gray-700 mb-2">
          This is a dynamic route that matches the pattern: <code className="bg-gray-200 px-2 py-1 rounded">/products/[id]</code>
        </p>
        <p className="text-gray-700">
          The product ID from the URL is: <code className="bg-gray-200 px-2 py-1 rounded">{params.id}</code>
        </p>
      </div>
    </div>
  )
}