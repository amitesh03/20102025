'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

function ManualPrefetchLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    let cancelled = false
    const poll = () => {
      if (!cancelled) router.prefetch(href)
    }
    poll()
    return () => {
      cancelled = true
    }
  }, [href, router])

  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault()
        router.push(href)
      }}
      className="text-blue-600 hover:underline"
    >
      {children}
    </a>
  )
}

export default function Page() {
  const router = useRouter()

  return (
    <section className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Client-side Navigation & Prefetch</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Demonstrates programmatic navigation via useRouter().push and manual route prefetching.
      </p>

      <div className="space-y-3">
        <h2 className="text-xl font-medium">Programmatic push()</h2>
        <button
          type="button"
          onClick={() => router.push('/streaming')}
          className="rounded bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200"
        >
          Go to Streaming Demo
        </button>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-medium">Manual Prefetch Link</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          This link continuously prefetches the target route and pushes on click.
        </p>
        <ManualPrefetchLink href="/posts/welcome">Open Post: welcome</ManualPrefetchLink>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-medium">next/link (built-in prefetch)</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Standard Link with built-in prefetching in viewport.
        </p>
        <Link href="/ppr" className="text-blue-600 hover:underline">
          Go to PPR Demo
        </Link>
      </div>
    </section>
  )
}