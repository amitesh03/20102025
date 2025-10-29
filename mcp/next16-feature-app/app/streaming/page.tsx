import { Suspense } from 'react'

async function PostFeed() {
  await new Promise((r) => setTimeout(r, 600))
  const posts = [{ id: 1, title: 'Hello Next 16' }, { id: 2, title: 'Streaming FTW' }]
  return (
    <ul className="list-disc pl-6">
      {posts.map((p) => (
        <li key={p.id} className="text-zinc-900 dark:text-zinc-100">{p.title}</li>
      ))}
    </ul>
  )
}

async function Weather() {
  await new Promise((r) => setTimeout(r, 900))
  // Simulated weather read
  return <div className="text-zinc-700 dark:text-zinc-300">Bangalore • 27°C</div>
}

export default function Page() {
  return (
    <section className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Streaming with Suspense</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Below sections stream independently. Each Suspense boundary shows its own fallback.
      </p>

      <div className="space-y-4">
        <h2 className="text-xl font-medium">Post Feed</h2>
        <Suspense fallback={<p className="text-sm text-zinc-500">Loading feed...</p>}>
          <PostFeed />
        </Suspense>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-medium">Weather</h2>
        <Suspense fallback={<p className="text-sm text-zinc-500">Loading weather...</p>}>
          <Weather />
        </Suspense>
      </div>
    </section>
  )
}