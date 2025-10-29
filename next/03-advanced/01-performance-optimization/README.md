# Next.js Performance Optimization Example

This example demonstrates various techniques to optimize performance in Next.js 14 applications.

## Learning Objectives

After completing this example, you'll understand:

- How to implement lazy loading for components and images
- How to optimize images using Next.js Image component
- How to use code splitting to reduce bundle sizes
- How to analyze and monitor performance metrics
- How to implement performance optimizations in CSS and JavaScript

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

## Performance Optimization Techniques

### 1. Lazy Loading

Lazy loading defers loading of non-critical resources until they're needed. This reduces initial page load time and improves perceived performance.

#### Dynamic Imports

Use Next.js `dynamic` import to load components on demand:

```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(
  () => import('../components/heavy-component'),
  {
    loading: () => <div>Loading...</div>,
    ssr: false // Disable server-side rendering
  }
)
```

#### Image Lazy Loading

Use Next.js Image component with lazy loading:

```typescript
import Image from 'next/image'

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={500}
  height={300}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### 2. Image Optimization

Next.js provides built-in image optimization with the Image component:

- Automatic optimization (WebP, AVIF)
- Responsive images with srcset
- Lazy loading by default
- Prevents layout shift with aspect ratio
- Placeholder support (blur, empty)

### 3. Code Splitting

Code splitting reduces the initial bundle size by splitting code into smaller chunks:

- Automatic code splitting by pages
- Dynamic imports for components
- Bundle analysis with @next/bundle-analyzer

### 4. Bundle Analysis

Analyze your bundle sizes to identify optimization opportunities:

```bash
# Install bundle analyzer
npm install @next/bundle-analyzer

# Analyze your bundle
ANALYZE=true npm run build
```

### 5. Performance Monitoring

Monitor your app's performance with:

- Web Vitals
- Lighthouse
- Chrome DevTools
- WebPageTest

## Configuration Examples

### next.config.js

```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = withBundleAnalyzer(nextConfig)
```

### CSS Optimizations

```css
/* CSS containment for performance optimization */
.card-container {
  contain: layout style paint;
}

/* Will-change for animations */
.hover-card {
  will-change: transform;
}

/* GPU acceleration */
.gpu-accelerated {
  transform: translateZ(0);
}
```

## Performance Metrics

Key performance metrics to monitor:

- **First Contentful Paint (FCP):** Time when the first content is painted
- **Largest Contentful Paint (LCP):** Time when the largest content is painted
- **First Input Delay (FID):** Time from user's first interaction to response
- **Cumulative Layout Shift (CLS):** Measure of visual stability

## Best Practices

1. **Optimize Images**
   - Use appropriate formats (WebP, AVIF)
   - Specify width and height to prevent layout shift
   - Use lazy loading for below-the-fold images
   - Add blur placeholders for better UX

2. **Code Splitting**
   - Split components by routes
   - Use dynamic imports for heavy components
   - Analyze bundle sizes regularly

3. **Performance Monitoring**
   - Monitor Core Web Vitals
   - Use performance budgets
   - Test on real devices and networks

4. **Rendering Optimization**
   - Use CSS containment
   - Implement GPU acceleration for animations
   - Minimize layout thrashing

## Next Steps

- Implement service workers for caching
- Explore edge functions for better performance
- Set up performance budgets
- Implement A/B testing for performance improvements
- Explore advanced optimization techniques like prefetching and preloading