import Link from 'next/link'
import { getSortedPostsData } from '../lib/posts'

export default function Home() {
  const allPostsData = getSortedPostsData()
  
  return (
    <div className="max-w-4xl mx-auto">
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Latest Posts</h2>
        <div className="space-y-6">
          {allPostsData.map(({ id, date, title }) => (
            <article key={id} className="bg-white p-6 rounded-lg shadow">
              <Link href={`/posts/${id}`} className="block">
                <h3 className="text-xl font-semibold mb-2 text-blue-600 hover:text-blue-800">
                  {title}
                </h3>
                <time className="text-sm text-gray-500">{date}</time>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}