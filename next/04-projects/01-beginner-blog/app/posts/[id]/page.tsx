import { getAllPostIds, getPostData } from '../../../lib/posts'
import Head from 'next/head'

export async function generateStaticParams() {
  const paths = getAllPostIds()
  return paths
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const postData = await getPostData(params.id)
  
  return {
    title: postData.title,
  }
}

export default async function Post({ params }: { params: { id: string } }) {
  const postData = await getPostData(params.id)
  
  return (
    <div className="max-w-4xl mx-auto">
      <article className="prose prose-lg max-w-none">
        <h1>{postData.title}</h1>
        <time dateTime={postData.date} className="text-gray-500">
          {postData.date}
        </time>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
      
      <div className="mt-8">
        <a href="/" className="text-blue-600 hover:text-blue-800">
          ← Back to home
        </a>
      </div>
    </div>
  )
}