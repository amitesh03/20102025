"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()
  
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Next.js Routing
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link 
                  href="/" 
                  className={`hover:text-blue-200 transition-colors ${
                    pathname === '/' ? 'text-blue-200 font-semibold' : ''
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  className={`hover:text-blue-200 transition-colors ${
                    pathname.startsWith('/products') ? 'text-blue-200 font-semibold' : ''
                  }`}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className={`hover:text-blue-200 transition-colors ${
                    pathname.startsWith('/blog') ? 'text-blue-200 font-semibold' : ''
                  }`}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/search" 
                  className={`hover:text-blue-200 transition-colors ${
                    pathname === '/search' ? 'text-blue-200 font-semibold' : ''
                  }`}
                >
                  Search
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}