import { getPosts } from "../posts/get-posts";

export const dynamic = "force-static";

const CONFIG = {
	title: "Personal Blog",
	siteUrl: "https://kristofer.dev", // Update this to your actual domain
	description: "Personal thoughts, technical articles, and project updates",
	lang: "en-us",
};

export async function GET() {
	try {
		const allPosts = await getPosts();
		
		if (!allPosts || allPosts.length === 0) {
			// Return a valid RSS feed even with no posts
			const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${CONFIG.title}</title>
    <link>${CONFIG.siteUrl}</link>
    <description>${CONFIG.description}</description>
    <language>${CONFIG.lang}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  </channel>
</rss>`;

			return new Response(xml, {
				headers: {
					"Content-Type": "application/rss+xml",
				},
			});
		}

		const posts = allPosts
			.map(
				(post) => `    <item>
        <title>${post.title || 'Untitled'}</title>
        <description>${post.frontMatter?.description || ''}</description>
        <link>${CONFIG.siteUrl}${post.route}</link>
        <pubDate>${new Date(post.frontMatter?.date || Date.now()).toUTCString()}</pubDate>
    </item>`
			)
			.join("\n");
		
		const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${CONFIG.title}</title>
    <link>${CONFIG.siteUrl}</link>
    <description>${CONFIG.description}</description>
    <language>${CONFIG.lang}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${posts}
  </channel>
</rss>`;

		return new Response(xml, {
			headers: {
				"Content-Type": "application/rss+xml",
			},
		});
	} catch (error) {
		console.error('RSS feed generation failed:', error);
		
		// Return a minimal RSS feed on error
		const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${CONFIG.title}</title>
    <link>${CONFIG.siteUrl}</link>
    <description>${CONFIG.description}</description>
    <language>${CONFIG.lang}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  </channel>
</rss>`;

		return new Response(xml, {
			headers: {
				"Content-Type": "application/rss+xml",
			},
		});
	}
}
