import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'

export default function BlogPostsList() {
  // Get all MDX files from content directory
  const contentDirectory = path.join(process.cwd(), 'content')
  
  let posts = []
  
  try {
    if (fs.existsSync(contentDirectory)) {
      const fileNames = fs.readdirSync(contentDirectory)
      const mdxFiles = fileNames.filter(name => name.endsWith('.mdx') && name !== 'index.mdx')
      
      posts = mdxFiles.map(fileName => {
        const fullPath = path.join(contentDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data } = matter(fileContents)
        
        return {
          slug: fileName.replace(/\.mdx$/, ''),
          title: data.title || fileName.replace(/\.mdx$/, ''),
          date: data.date,
          tags: data.tags || [],
          description: data.description || ''
        }
      })
      
      // Sort by date (newest first)
      posts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    }
  } catch (error) {
    console.error('Error reading blog posts:', error)
  }

  if (posts.length === 0) {
    return (
      <div style={{ color: 'var(--muted-foreground)', fontStyle: 'italic' }}>
        No blog posts found.
      </div>
    )
  }

  return (
    <div className="blog-posts-list">
      {posts.map(post => (
        <div key={post.slug} className="mb-6 p-4 rounded-lg" style={{ 
          backgroundColor: 'var(--card)', 
          borderColor: 'var(--border)',
          border: '1px solid'
        }}>
          <h3 className="text-lg font-semibold mb-2">
            <Link 
              href={`/blog/${post.slug}`} 
              className="hover:opacity-80 transition-opacity"
              style={{ color: 'var(--primary)' }}
            >
              {post.title}
            </Link>
          </h3>
          
          {post.date && (
            <time className="text-sm mb-2 block" style={{ color: 'var(--muted-foreground)' }}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          )}
          
          {post.description && (
            <p className="mb-3" style={{ color: 'var(--muted-foreground)' }}>
              {post.description}
            </p>
          )}
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded"
                  style={{ 
                    backgroundColor: 'var(--accent)', 
                    color: 'var(--accent-foreground)' 
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
