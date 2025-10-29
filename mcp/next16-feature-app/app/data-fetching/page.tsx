export default async function Page() {
  // Static data: cached until manually invalidated (default: 'force-cache')
  const staticRes = await fetch('https://dummyjson.com/products/1', { cache: 'force-cache' })
  const staticData = await staticRes.json()

  // Dynamic data: refetched on every request (similar to getServerSideProps)
  const dynamicRes = await fetch('https://dummyjson.com/products/2', { cache: 'no-store' })
  const dynamicData = await dynamicRes.json()

  // ISR-like data: cached and revalidated every 10 seconds
  const revalidatedRes = await fetch('https://dummyjson.com/products/3', { next: { revalidate: 10 } })
  const revalidatedData = await revalidatedRes.json()

  return (
    <section className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Data Fetching & Caching</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Demonstrates force-cache (static), no-store (dynamic), and revalidate=10 (ISR-like) in the App Router.
      </p>

      <div className="space-y-3">
        <h2 className="text-xl font-medium">Static (force-cache)</h2>
        <pre className="rounded bg-zinc-100 p-4 text-sm dark:bg-zinc-900">
          {JSON.stringify(staticData, null, 2)}
        </pre>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-medium">Dynamic (no-store)</h2>
        <pre className="rounded bg-zinc-100 p-4 text-sm dark:bg-zinc-900">
          {JSON.stringify(dynamicData, null, 2)}
        </pre>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-medium">Revalidate (10s)</h2>
        <pre className="rounded bg-zinc-100 p-4 text-sm dark:bg-zinc-900">
          {JSON.stringify(revalidatedData, null, 2)}
        </pre>
      </div>
    </section>
  )
}