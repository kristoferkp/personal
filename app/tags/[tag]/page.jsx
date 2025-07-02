import Link from 'next/link'
import { getPosts, getTags } from '../../blog/get-posts'

// Simple PostCard component
function PostCard({ post }) {
  return (
    <article className="mb-8 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold mb-2">
        <Link href={post.route} className="hover:opacity-80 transition-opacity">
          {post.frontMatter.title}
        </Link>
      </h2>
      {post.frontMatter.date && (
        <time className="text-sm mb-3 block">
          {new Date(post.frontMatter.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
      )}
      {post.frontMatter.tags && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.frontMatter.tags.map(tag => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className="px-2 py-1 text-xs rounded hover:opacity-80 transition-opacity"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
      {post.content && (
        <p className="line-clamp-3">
          {post.content.split('\n').find(line => line.trim() && !line.startsWith('#'))?.trim() || ''}
        </p>
      )}
    </article>
  )
}
 
export async function generateMetadata(props) {
  const params = await props.params
  return {
    title: `Posts Tagged with “${decodeURIComponent(params.tag)}”`
  }
}
 
export async function generateStaticParams() {
  try {
    const allTags = await getTags()
    console.log('All tags from getTags():', allTags)
    const uniqueTags = [...new Set(allTags)]
    console.log('Unique tags:', uniqueTags)
    const staticParams = uniqueTags.map(tag => ({ tag }))
    console.log('Static params generated:', staticParams)
    return staticParams
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    return []
  }
}
 
export default async function TagPage(props) {
  const params = await props.params
  const { title } = await generateMetadata({ params })
  const posts = await getPosts()
  const tagToFilter = decodeURIComponent(params.tag)
  
  const filteredPosts = posts.filter(post => {
    const tags = post.frontMatter?.tags || []
    return tags.includes(tagToFilter)
  })
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <div>
        {filteredPosts.map(post => (
          <PostCard key={post.route} post={post} />
        ))}
      </div>
      {filteredPosts.length === 0 && (
        <p className="text-center py-8">No posts found with this tag.</p>
      )}
    </div>
  )
}