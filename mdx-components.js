import { useMDXComponents as getThemeComponents } from 'nextra-theme-blog'
import BlogPostsList from './components/BlogPostsList'
 
// Get the default MDX components
const themeComponents = getThemeComponents()

// Custom wrapper for blog posts
function BlogWrapper({ children, metadata, toc }) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <article className="prose prose-lg max-w-none">
        {metadata?.title && (
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              {metadata.title}
            </h1>
            {metadata.date && (
              <time className="text-lg" style={{ color: 'var(--muted-foreground)' }}>
                {new Date(metadata.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            )}
            {metadata.tags && (
              <div className="flex flex-wrap gap-2 mt-4">
                {metadata.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm rounded-full"
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
          </header>
        )}
        
        <div className="prose-content" style={{ color: 'var(--foreground)' }}>
          {children}
        </div>
      </article>
    </div>
  )
}
 
// Merge components
export function useMDXComponents(components) {
  return {
    ...themeComponents,
    wrapper: BlogWrapper,
    BlogPostsList,
    ...components
  }
}