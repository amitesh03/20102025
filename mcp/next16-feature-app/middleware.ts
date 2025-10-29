import { geolocation } from '@vercel/functions'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

export function middleware(request: NextRequest) {
  const { city, country, latitude, longitude } = geolocation(request) as {
    city?: string
    country?: string
    latitude?: number
    longitude?: number
  }

  const res = NextResponse.next()

  if (city) res.headers.set('x-geo-city', city)
  if (country) res.headers.set('x-geo-country', country)
  if (latitude != null && longitude != null) {
    res.headers.set('x-geo-coords', `${latitude},${longitude}`)
  }

  return res
}