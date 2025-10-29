import { Suspense } from 'react'
import { cookies } from 'next/headers'

export const experimental_ppr = true

async function User() {
  // Dynamic API usage makes this component render at request time.
  const session = (await cookies()).get('session')?.value
  // Simulate a small delay
  await new Promise((r) => setTimeout(r, 300))

  return (
    <div className="flex items-center gap-3 rounded-md border p-4">
      <div className="size-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
      <div className="flex flex-col">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">Session</span>
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {session ?? 'no-session'}
        </span>
      </div>
    </div>
  )
}

function AvatarSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-md border p-4 animate-pulse">
      <div className="size-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
      <div className="flex flex-col gap-1">
        <div className="h-3 w-12 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <section className="mx-auto max-w-xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Partial Prerendering Demo (PPR)</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        The static shell (this heading and paragraph) is prerendered. The user card below is
        rendered dynamically and streamed when ready.
      </p>
      <Suspense fallback={<AvatarSkeleton />}>
        {/* Dynamic component renders at request time due to cookies() */}
        <User />
      </Suspense>
    </section>
  )
}