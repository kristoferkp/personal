import { normalizePages } from "nextra/normalize-pages";
import { getPageMap } from "nextra/page-map";
import fs from "fs";
import path from "path";

// Parse frontmatter manually to avoid external dependencies
function parseFrontMatter(content: string) {
	const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!match) {
		return { data: {}, content };
	}
	
	const [, frontMatterStr, bodyContent] = match;
	const frontMatter: Record<string, string | string[]> = {};
	
	// Simple YAML parsing for basic frontmatter
	frontMatterStr.split('\n').forEach(line => {
		const colonIndex = line.indexOf(':');
		if (colonIndex > 0) {
			const key = line.slice(0, colonIndex).trim();
			let value = line.slice(colonIndex + 1).trim();
			
			// Remove quotes if present
			if ((value.startsWith('"') && value.endsWith('"')) || 
				(value.startsWith("'") && value.endsWith("'"))) {
				value = value.slice(1, -1);
			}
			
			// Parse arrays (simple format)
			if (value.startsWith('[') && value.endsWith(']')) {
				frontMatter[key] = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''));
			} else {
				frontMatter[key] = value;
			}
		}
	});
	
	return { data: frontMatter, content: bodyContent };
}

// Fallback function for static export builds
async function getPostsFromFileSystem() {
	try {
		const postsDirectory = path.join(process.cwd(), "pages/posts");
		
		// Check if directory exists
		if (!fs.existsSync(postsDirectory)) {
			console.warn('Posts directory does not exist:', postsDirectory);
			return [];
		}
		
		const files = fs.readdirSync(postsDirectory);
		const mdxFiles = files.filter(file => file.endsWith('.mdx') && file !== 'index.mdx');
		
		if (mdxFiles.length === 0) {
			console.warn('No MDX files found in posts directory');
			return [];
		}
		
		const posts = mdxFiles.map(file => {
			const filePath = path.join(postsDirectory, file);
			const fileContent = fs.readFileSync(filePath, 'utf8');
			const { data: frontMatter, content } = parseFrontMatter(fileContent);
			const slug = file.replace('.mdx', '');
			
			return {
				name: slug,
				route: `/posts/${slug}`,
				title: frontMatter.title || slug,
				frontMatter: {
					...frontMatter,
					date: frontMatter.date || new Date().toISOString(),
				},
				content,
			};
		});
		
		return posts.sort(
			(a, b) => {
				const dateA = typeof a.frontMatter?.date === 'string' ? a.frontMatter.date : '0';
				const dateB = typeof b.frontMatter?.date === 'string' ? b.frontMatter.date : '0';
				return new Date(dateB || 0).getTime() - new Date(dateA || 0).getTime();
			}
		);
	} catch (error) {
		console.warn('Failed to read posts from file system:', error);
		return [];
	}
}

export async function getPosts() {
	// For static export builds, go directly to file system approach
	// to avoid unnecessary getPageMap warnings
	if (process.env.NODE_ENV === 'production' || process.env.NEXT_PHASE === 'phase-export') {
		return await getPostsFromFileSystem();
	}

	try {
		const pageMap = await getPageMap("/posts");
		if (!pageMap || pageMap.length === 0) {
			return await getPostsFromFileSystem();
		}
		
		const { directories } = normalizePages({
			list: pageMap,
			route: "/posts",
		});
		
		if (!directories || directories.length === 0) {
			return await getPostsFromFileSystem();
		}
		
		return directories
			.filter((post) => post.name !== "index")
			.sort(
				(a, b) => {
					const dateA = typeof a.frontMatter?.date === 'string' ? a.frontMatter.date : '0';
					const dateB = typeof b.frontMatter?.date === 'string' ? b.frontMatter.date : '0';
					return new Date(dateB || 0).getTime() - new Date(dateA || 0).getTime();
				}
			);
	} catch (error) {
		console.warn('Failed to get posts via Nextra, trying file system approach:', error);
		return await getPostsFromFileSystem();
	}
}

export async function getTags() {
	const posts = await getPosts();
	const tags = posts.flatMap((post) => {
		const postTags = post.frontMatter.tags;
		if (Array.isArray(postTags)) {
			return postTags;
		}
		return [];
	});
	return tags;
}
