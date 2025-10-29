# Next16 Feature App

A comprehensive Next.js 16 example app demonstrating modern App Router features, caching APIs, Edge runtime, Middleware geolocation, Partial Prerendering (PPR), streaming with Suspense, dynamic routes with `generateStaticParams`, i18n layout, metadata, and route segment config.

This project was scaffolded with `create-next-app@16` and enhanced per Next.js 16 documentation (sources retrieved via Context7).

## Getting started

- Requirements: Node 18+ (recommend Node 20+)
- Install dependencies:
  - `npm install`
- Run development:
  - `npm run dev`
- Build:
  - `npm run build`
- Start production build:
  - `npm run start`

Note: The template uses `--webpack` in dev/build scripts. You can switch to Turbopack later if desired.

## Key features implemented

1. App Router pages and routes:
   - `/` Home page (template default)
   - `/ppr` Partial Prerendering demo (static shell + dynamic content with Suspense)
   - `/streaming` Streaming demo using route-level `loading.tsx` and multiple Suspense boundaries
   - `/data-fetching` Data fetching & caching patterns: `force-cache`, `no-store`, `revalidate`
   - `/posts/[slug]` Dynamic route with `generateStaticParams`, `generateMetadata`
     - Available slugs: `welcome`, `features`
   - `/client-nav` Client-side navigation examples:
     - Programmatic `useRouter().push()`
     - Manual `router.prefetch(href)` polling link
     - `next/link` with built-in prefetch

2. Route Handlers (API):
   - `POST /api/set-token`: sets a cookie (`token`) via `NextResponse.cookies`
   - `POST /api/revalidate`: validates `x-vercel-reval-key` and calls `revalidateTag('posts', 'max')`
     - Requires env `CONTENTFUL_REVALIDATE_SECRET`
   - `GET /api/proxy` (Edge): example Edge API route that proxies and forwards `authorization` cookie
   - `GET /api/hello` (Edge): returns a JSON payload from the Edge runtime

3. Server Actions and caching APIs:
   - `app/actions.ts` demonstrates:
     - `refresh()` to force client UI re-render after server-side mutation
     - `updateTag(tag)` for read-your-writes cache semantics

4. Middleware geolocation (Vercel):
   - `middleware.ts` uses `@vercel/functions` `geolocation(request)` to inject headers:
     - `x-geo-city`
     - `x-geo-country`
     - `x-geo-coords` (lat,long)
   - Configure `matcher` to apply to most routes

5. Partial Prerendering (PPR):
   - `/ppr` exports `experimental_ppr = true`
   - Uses a dynamic component (`cookies()`) wrapped in `<Suspense>` to stream after static shell

6. Streaming UI:
   - `/streaming` shows two Suspense boundaries (`PostFeed`, `Weather`)
   - Route-level `app/streaming/loading.tsx` fallback

7. Data fetching & caching options:
   - `/data-fetching` page requests:
     - Static (`force-cache`)
     - Dynamic (`no-store`)
     - ISR-like (`next: { revalidate: 10 }`)

8. Dynamic routes & metadata:
   - `/posts/[slug]`:
     - `generateStaticParams()` provides known slugs
     - `generateMetadata()` sets per-page OpenGraph metadata
     - `notFound()` for missing slug

9. Internationalization (i18n) layout:
   - `app/[lang]/layout.tsx`:
     - `generateStaticParams()` from `i18n-config.ts`
     - Sets html `lang` attribute per locale

10. Route segment configuration demo:
    - `app/config-demo/route.ts` exports:
      - `dynamic`, `dynamicParams`, `revalidate`, `fetchCache`, `runtime`, `preferredRegion`

11. Metadata & manifest:
    - `app/layout.tsx` defines:
      - `metadataBase`, `title` template, `openGraph`, `icons`, `manifest`
    - Manifest path: `/site.webmanifest` (see Public section below)

12. Next.js 16 config:
    - `next.config.ts`:
      - `cacheComponents: true` (replacement for older experimental `dynamicIO`)
      - `images.remotePatterns` replaces deprecated `images.domains`

## File overview

- App Router pages & layouts:
  - `app/layout.tsx` (metadata, fonts)
  - `app/page.tsx` (home)
  - `app/ppr/page.tsx` (PPR demo)
  - `app/streaming/page.tsx`, `app/streaming/loading.tsx` (streaming UI)
  - `app/data-fetching/page.tsx` (caching patterns)
  - `app/posts/[slug]/page.tsx` (dynamic route, metadata, static params)
  - `app/[lang]/layout.tsx` (i18n layout)
  - `app/client-nav/page.tsx` (client-side navigation & prefetch)

- API Route Handlers:
  - `app/api/set-token/route.ts` (POST)
  - `app/api/revalidate/route.ts` (POST revalidateTag)
  - `app/api/proxy/route.ts` (GET, Edge proxy)
  - `app/api/hello/route.ts` (GET, Edge)

- Server Actions:
  - `app/actions.ts` (`refresh`, `updateTag`)

- Middleware:
  - `middleware.ts` (`@vercel/functions` geolocation)

- Config:
  - `next.config.ts` (Next.js 16 options)
  - `i18n-config.ts` (locales & type)

- Public assets:
  - `public/*` default icons & SVGs
  - Add `public/site.webmanifest` for the manifest referenced in `app/layout.tsx`.

## Environment variables

- `CONTENTFUL_REVALIDATE_SECRET` used by `/api/revalidate`.

Create `.env.local`:
```
CONTENTFUL_REVALIDATE_SECRET=your-secret-here
```

## How to explore

- PPR: http://localhost:3000/ppr
- Streaming: http://localhost:3000/streaming
- Data Fetching: http://localhost:3000/data-fetching
- Dynamic posts: 
  - http://localhost:3000/posts/welcome
  - http://localhost:3000/posts/features
- Client nav: http://localhost:3000/client-nav
- i18n layout:
  - http://localhost:3000/en
  - http://localhost:3000/es
  - http://localhost:3000/fr
- Config demo: http://localhost:3000/config-demo
- API:
  - `POST http://localhost:3000/api/set-token`
  - `POST http://localhost:3000/api/revalidate` (requires header `x-vercel-reval-key`)
  - `GET http://localhost:3000/api/proxy` (Edge)
  - `GET http://localhost:3000/api/hello` (Edge)

## Notes & references (from Context7 Next.js docs)

- App Router, Route Handlers, Suspense & streaming, PPR, caching APIs (`refresh`, `updateTag`, `revalidateTag`), Edge runtime, Middleware geolocation with `@vercel/functions`, and metadata API were implemented based on official Next.js docs indexed in Context7.

## Next steps

- Optionally add Turbopack (update `scripts`).
- Add `public/site.webmanifest` content (PWA metadata).
- Integrate Server Actions with UI components (forms) for interactive demos.
