# Edge Functions in Next.js

This example demonstrates how to use Edge Functions in Next.js to run code at the edge for better performance, lower latency, and global distribution.

## Learning Objectives

After completing this example, you'll understand:

- What Edge Functions are and when to use them
- How to create Edge Functions in Next.js
- How to leverage edge runtime features
- How to implement geolocation-based personalization
- How to handle A/B testing at the edge
- How to implement personalization based on user data
- Best practices for Edge Functions

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Edge Functions Basics

Edge Functions in Next.js allow you to run code at the edge, closer to your users. They run in a lightweight V8 Isolate environment instead of a full Node.js environment.

### 1. Basic Edge Function

Creating a simple Edge Function:

```typescript
// app/api/edge-example/route.ts
export const runtime = 'edge'

export function GET(request: Request) {
  return new Response('Hello from the edge!', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
```

### 2. Geolocation-Based Content

Personalizing content based on user location:

```typescript
// app/api/location/route.ts
export const runtime = 'edge'

export function GET(request: Request) {
  // Get geolocation data from the request
  const country = request.headers.get('x-vercel-ip-country') || 'Unknown'
  const city = request.headers.get('x-vercel-ip-city') || 'Unknown'
  const region = request.headers.get('x-vercel-ip-region') || 'Unknown'
  const latitude = request.headers.get('x-vercel-ip-latitude') || 'Unknown'
  const longitude = request.headers.get('x-vercel-ip-longitude') || 'Unknown'
  const timezone = request.headers.get('x-vercel-ip-timezone') || 'Unknown'

  // Create personalized content based on location
  let greeting = 'Hello!'
  let currency = 'USD'
  let recommendedContent = 'General content'

  switch (country) {
    case 'US':
      greeting = 'Hello from the United States!'
      currency = 'USD'
      recommendedContent = 'Check out our US-exclusive deals!'
      break
    case 'GB':
      greeting = 'Hello from the United Kingdom!'
      currency = 'GBP'
      recommendedContent = 'Special offers for UK customers!'
      break
    case 'JP':
      greeting = 'こんにちは from Japan!'
      currency = 'JPY'
      recommendedContent = '日本限定オファーをチェック！'
      break
    case 'DE':
      greeting = 'Hallo from Germany!'
      currency = 'EUR'
      recommendedContent = 'Sonderangebote für deutsche Kunden!'
      break
    default:
      greeting = `Hello from ${country}!`
      recommendedContent = 'Welcome to our global store!'
  }

  const locationData = {
    country,
    city,
    region,
    latitude,
    longitude,
    timezone,
    greeting,
    currency,
    recommendedContent,
  }

  return new Response(JSON.stringify(locationData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
    },
  })
}
```

### 3. A/B Testing at the Edge

Implementing A/B testing with Edge Functions:

```typescript
// app/api/ab-test/route.ts
export const runtime = 'edge'

// A/B test configuration
const AB_TESTS = {
  homepage: {
    variants: ['control', 'variant-a', 'variant-b'],
    trafficSplit: [50, 25, 25], // Percentage for each variant
  },
  pricing: {
    variants: ['control', 'variant-a'],
    trafficSplit: [70, 30],
  },
}

// Function to get or create a user ID for A/B testing
function getUserId(request: Request): string {
  // Check if user ID exists in cookie
  const cookieHeader = request.headers.get('cookie')
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {} as Record<string, string>)

    if (cookies.ab_test_user_id) {
      return cookies.ab_test_user_id
    }
  }

  // Generate a new user ID
  return Math.random().toString(36).substring(2, 15)
}

// Function to assign a variant based on traffic split
function assignVariant(userId: string, trafficSplit: number[]): number {
  // Use a hash of the user ID to ensure consistent assignment
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const random = hash % 100

  let cumulative = 0
  for (let i = 0; i < trafficSplit.length; i++) {
    cumulative += trafficSplit[i]
    if (random < cumulative) {
      return i
    }
  }

  return 0 // Default to first variant
}

export function GET(request: Request) {
  const url = new URL(request.url)
  const testName = url.searchParams.get('test') || 'homepage'

  if (!AB_TESTS[testName as keyof typeof AB_TESTS]) {
    return new Response(JSON.stringify({ error: 'Invalid test name' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const test = AB_TESTS[testName as keyof typeof AB_TESTS]
  const userId = getUserId(request)
  const variantIndex = assignVariant(userId, test.trafficSplit)
  const variant = test.variants[variantIndex]

  const result = {
    testName,
    userId,
    variant,
    variantIndex,
    trafficSplit: test.trafficSplit,
  }

  // Create response with cookies
  const response = new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': [
        `ab_test_user_id=${userId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`,
        `ab_test_${testName}=${variant}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`,
      ],
    },
  })

  return response
}
```

### 4. Personalized Content Based on User Agent

Delivering different content based on device type:

```typescript
// app/api/personalize/route.ts
export const runtime = 'edge'

export function GET(request: Request) {
  const userAgent = request.headers.get('user-agent') || ''
  const url = new URL(request.url)
  const contentType = url.searchParams.get('type') || 'homepage'

  // Detect device type
  let deviceType = 'desktop'
  let optimizedContent = 'Default desktop content'

  if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
    deviceType = 'mobile'
    optimizedContent = 'Optimized mobile content with smaller images and touch-friendly UI'
  } else if (/tablet|ipad/i.test(userAgent)) {
    deviceType = 'tablet'
    optimizedContent = 'Optimized tablet content with medium-sized images'
  }

  // Detect browser
  let browser = 'unknown'
  if (/chrome/i.test(userAgent)) {
    browser = 'chrome'
  } else if (/firefox/i.test(userAgent)) {
    browser = 'firefox'
  } else if (/safari/i.test(userAgent)) {
    browser = 'safari'
  } else if (/edge/i.test(userAgent)) {
    browser = 'edge'
  }

  // Create personalized content
  let personalizedContent = optimizedContent

  switch (contentType) {
    case 'homepage':
      personalizedContent = deviceType === 'mobile'
        ? 'Welcome to our mobile-friendly site! Check out our streamlined navigation.'
        : 'Welcome to our full-featured site! Explore all our interactive elements.'
      break
    case 'product':
      personalizedContent = deviceType === 'mobile'
        ? 'Product details with swipeable image gallery and quick add to cart.'
        : 'Product details with 360° view and detailed specifications.'
      break
    case 'checkout':
      personalizedContent = deviceType === 'mobile'
        ? 'Streamlined checkout process with digital wallet support.'
        : 'Full checkout experience with multiple payment options and order summary.'
      break
  }

  const result = {
    deviceType,
    browser,
    userAgent: userAgent.substring(0, 100) + (userAgent.length > 100 ? '...' : ''),
    contentType,
    personalizedContent,
  }

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
    },
  })
}
```

### 5. Dynamic Redirects Based on Conditions

Implementing smart redirects at the edge:

```typescript
// app/api/redirect/route.ts
export const runtime = 'edge'

export function GET(request: Request) {
  const url = new URL(request.url)
  const path = url.searchParams.get('path') || '/'
  
  // Get geolocation data
  const country = request.headers.get('x-vercel-ip-country') || 'Unknown'
  const userAgent = request.headers.get('user-agent') || ''
  
  // Get time of day
  const hour = new Date().getHours()
  const isBusinessHours = hour >= 9 && hour <= 17
  
  // Determine redirect URL based on conditions
  let redirectUrl = path
  let reason = 'No redirect needed'
  
  // Business hours redirect
  if (path === '/contact' && !isBusinessHours) {
    redirectUrl = '/contact-after-hours'
    reason = 'Outside business hours'
  }
  
  // Country-specific redirects
  if (path === '/') {
    switch (country) {
      case 'US':
        redirectUrl = '/us'
        reason = 'US visitors'
        break
      case 'GB':
        redirectUrl = '/uk'
        reason = 'UK visitors'
        break
      case 'JP':
        redirectUrl = '/jp'
        reason = 'Japanese visitors'
        break
      default:
        redirectUrl = '/global'
        reason = 'International visitors'
    }
  }
  
  // Device-specific redirects
  if (path === '/app' && /mobile|android|iphone/i.test(userAgent)) {
    redirectUrl = '/mobile-app'
    reason = 'Mobile device detected'
  }
  
  // Create response
  if (redirectUrl !== path) {
    // Return redirect response
    return new Response(null, {
      status: 302,
      headers: {
        'Location': redirectUrl,
        'X-Redirect-Reason': reason,
      },
    })
  } else {
    // Return no redirect information
    return new Response(JSON.stringify({
      path,
      redirectUrl,
      reason,
      country,
      isBusinessHours,
      hour,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
```

### 6. API Proxy with Response Transformation

Creating an API proxy at the edge:

```typescript
// app/api/proxy/weather/route.ts
export const runtime = 'edge'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const city = url.searchParams.get('city') || 'New York'
  const units = url.searchParams.get('units') || 'metric'
  
  // Get user location for fallback
  const userCity = request.headers.get('x-vercel-ip-city') || 'New York'
  const userCountry = request.headers.get('x-vercel-ip-country') || 'US'
  
  // If no city provided, use user's location
  const queryCity = city === 'auto' ? userCity : city
  
  try {
    // Fetch weather data from external API
    const apiKey = process.env.WEATHER_API_KEY
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${queryCity}&appid=${apiKey}&units=${units}`
    
    const weatherResponse = await fetch(weatherUrl)
    
    if (!weatherResponse.ok) {
      throw new Error(`Weather API error: ${weatherResponse.status}`)
    }
    
    const weatherData = await weatherResponse.json()
    
    // Transform the response
    const transformedData = {
      location: {
        name: weatherData.name,
        country: weatherData.sys.country,
        coordinates: {
          lat: weatherData.coord.lat,
          lon: weatherData.coord.lon,
        },
      },
      current: {
        temperature: Math.round(weatherData.main.temp),
        feelsLike: Math.round(weatherData.main.feels_like),
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        windSpeed: weatherData.wind.speed,
        windDirection: weatherData.wind.deg,
        visibility: weatherData.visibility,
        uvIndex: weatherData.uvi || 0,
      },
      units,
      lastUpdated: new Date().toISOString(),
      source: 'OpenWeatherMap',
    }
    
    // Add location-specific recommendations
    let recommendations = []
    
    if (weatherData.main.temp > 30) {
      recommendations.push("It's hot! Stay hydrated and wear sunscreen.")
    } else if (weatherData.main.temp < 10) {
      recommendations.push("It's cold! Dress warmly and be careful on icy surfaces.")
    } else if (weatherData.weather[0].main.includes('rain')) {
      recommendations.push("Don't forget your umbrella!")
    }
    
    transformedData.recommendations = recommendations
    
    return new Response(JSON.stringify(transformedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to fetch weather data',
      message: error instanceof Error ? error.message : 'Unknown error',
      fallback: {
        location: { name: userCity, country: userCountry },
        current: { temperature: 'N/A', description: 'Weather data unavailable' },
      }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
```

### 7. Real-time Data Processing

Processing real-time data at the edge:

```typescript
// app/api/analytics/track/route.ts
export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Get request metadata
    const userAgent = request.headers.get('user-agent') || ''
    const referer = request.headers.get('referer') || ''
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const country = request.headers.get('x-vercel-ip-country') || 'Unknown'
    const city = request.headers.get('x-vercel-ip-city') || 'Unknown'
    
    // Extract event data
    const { event, properties, timestamp = Date.now() } = data
    
    // Create analytics event
    const analyticsEvent = {
      event,
      properties: {
        ...properties,
        userAgent: userAgent.substring(0, 200),
        referer,
        ip,
        location: {
          country,
          city,
        },
      },
      timestamp,
      receivedAt: Date.now(),
    }
    
    // In a real implementation, you would send this to your analytics service
    // For this example, we'll just log it
    console.log('Analytics event:', JSON.stringify(analyticsEvent))
    
    // You could also send to a service like:
    // await sendToAnalyticsService(analyticsEvent)
    
    return new Response(JSON.stringify({
      success: true,
      event: analyticsEvent.event,
      timestamp: analyticsEvent.timestamp,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Invalid request body',
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
```

### 8. Content Adaptation Based on Network Conditions

Adapting content based on user's network speed:

```typescript
// app/api/adaptive-content/route.ts
export const runtime = 'edge'

export function GET(request: Request) {
  const url = new URL(request.url)
  const contentType = url.searchParams.get('type') || 'images'
  
  // Get network information from headers
  const effectiveType = request.headers.get('x-vercel-sc-effective-type') || '4g'
  const rtt = request.headers.get('x-vercel-sc-rtt') || '100'
  const downlink = request.headers.get('x-vercel-sc-downlink') || '10'
  
  // Determine quality based on network conditions
  let quality = 'high'
  let imageSize = 1920
  let videoQuality = '1080p'
  
  if (effectiveType === 'slow-2g' || effectiveType === '2g') {
    quality = 'low'
    imageSize = 640
    videoQuality = '360p'
  } else if (effectiveType === '3g') {
    quality = 'medium'
    imageSize = 1280
    videoQuality = '720p'
  }
  
  // Create adaptive content
  let content = {}
  
  switch (contentType) {
    case 'images':
      content = {
        quality,
        imageSize,
        format: quality === 'low' ? 'webp' : 'avif',
        lazyLoad: true,
        placeholder: 'blur',
        images: [
          {
            src: `/api/image?size=${imageSize}&quality=${quality}`,
            width: imageSize,
            height: imageSize * 0.75,
            alt: 'Adaptive image',
          },
        ],
      }
      break
      
    case 'video':
      content = {
        quality,
        videoQuality,
        format: quality === 'low' ? 'mp4' : 'webm',
        autoplay: effectiveType !== 'slow-2g' && effectiveType !== '2g',
        controls: true,
        sources: [
          {
            src: `/api/video?quality=${videoQuality}`,
            type: 'video/mp4',
          },
        ],
      }
      break
      
    case 'page':
      content = {
        quality,
        components: {
          hero: {
            backgroundImage: quality === 'low' ? 'none' : 'url(/hero-bg.jpg)',
            videoBackground: quality === 'high',
            animations: quality !== 'low',
          },
          gallery: {
            columns: quality === 'low' ? 2 : 3,
            lazyLoad: true,
            imageSize,
          },
          features: {
            animations: quality === 'high',
            icons: quality !== 'low',
          },
        },
      }
      break
  }
  
  const response = {
    networkInfo: {
      effectiveType,
      rtt: parseInt(rtt),
      downlink: parseFloat(downlink),
    },
    adaptiveContent: content,
  }
  
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
    },
  })
}
```

## Edge Runtime Limitations

Edge Functions have some limitations compared to Node.js:

1. **Limited Node.js APIs**: Not all Node.js APIs are available
2. **No native modules**: Can't use native Node.js modules
3. **Limited package support**: Some packages might not work
4. **Memory constraints**: Limited memory and execution time
5. **No file system access**: Can't read or write files directly

## Best Practices for Edge Functions

1. **Keep functions small and focused**
2. **Minimize dependencies**
3. **Use appropriate caching headers**
4. **Handle errors gracefully**
5. **Test with different regions and devices**
6. **Monitor performance and errors**

## When to Use Edge Functions

- Geolocation-based personalization
- A/B testing and feature flags
- Dynamic redirects
- API proxies with response transformation
- Real-time data processing
- Content adaptation based on network conditions
- Authentication and authorization
- Request logging and analytics

## Next Steps

- Explore advanced edge patterns
- Implement edge-side includes
- Learn about edge middleware
- Experiment with edge-specific APIs
- Build a globally distributed application