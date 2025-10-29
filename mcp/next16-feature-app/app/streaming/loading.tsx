export default function Loading() {
  return (
    <section className="mx-auto max-w-2xl space-y-4 p-6">
      <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
      <div className="space-y-2">
        <div className="h-3 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        <div className="h-3 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
      </div>
    </section>
  )
}