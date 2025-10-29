---
title: 'Pre-rendering and Data Fetching'
date: '2023-11-15'
---

# Pre-rendering and Data Fetching in Next.js

Next.js has two forms of pre-rendering: **Static Generation** and **Server-side Rendering**. The difference is in **when** it generates the HTML for a page.

- **Static Generation (Recommended)**: The HTML is generated at **build time** and will be reused on each request.
- **Server-side Rendering**: The HTML is generated on **each request**.

Importantly, Next.js lets you **choose** which pre-rendering form to use for each page. You can create a "hybrid" Next.js app by using Static Generation for most pages and using Server-side Rendering for others.

## Static Generation with `getStaticProps`

If a page uses Static Generation, the page HTML is generated at build time. This means the page can be cached by CDN and served to users instantly.

```javascript
export async function getStaticProps() {
  // Get external data from the file system, API, DB, etc.
  const data = await fetchData()
  
  // The value of the `props` key will be
  // passed to the `Page` component
  return {
    props: {
      data
    }
  }
}
```

## Server-side Rendering with `getServerSideProps`

If a page uses Server-side Rendering, the page HTML is generated on each request.

```javascript
export async function getServerSideProps(context) {
  // Get external data from the file system, API, DB, etc.
  const data = await fetchData(context.params.id)
  
  // The value of the `props` key will be
  // passed to the `Page` component
  return {
    props: {
      data
    }
  }
}
```

## Client-side Data Fetching

If you don't need to pre-render the data, you can also fetch data on the client side using a library like SWR or React Query:

```javascript
import useSWR from 'swr'

function Profile() {
  const { data, error } = useSWR('/api/user', fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>
  
  return <div>Hello {data.name}!</div>
}