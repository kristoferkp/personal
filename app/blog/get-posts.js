import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content')

export async function getPosts() {
  try {
    if (!fs.existsSync(postsDirectory)) {
      return []
    }
    
    const fileNames = fs.readdirSync(postsDirectory)
    const mdxFiles = fileNames.filter(name => name.endsWith('.mdx') && name !== 'index.mdx')
    
    const posts = mdxFiles.map(fileName => {
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      
      return {
        name: fileName.replace(/\.mdx$/, ''),
        route: `/posts/${fileName.replace(/\.mdx$/, '')}`,
        frontMatter: data,
        content: content
      }
    })
    
    return posts.sort((a, b) => new Date(b.frontMatter?.date || 0) - new Date(a.frontMatter?.date || 0))
  } catch (error) {
    console.error('Error getting posts:', error)
    return []
  }
}

export async function getTags() {
  try {
    const posts = await getPosts()
    if (!posts || posts.length === 0) {
      return []
    }
    const tags = posts.flatMap(post => post.frontMatter?.tags || [])
    return tags.filter(Boolean)
  } catch (error) {
    console.error('Error getting tags:', error)
    return []
  }
}