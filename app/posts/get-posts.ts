import { normalizePages } from "nextra/normalize-pages";
import { getPageMap } from "nextra/page-map";

export async function getPosts() {
	try {
		const { directories } = normalizePages({
			list: await getPageMap("/posts"),
			route: "/posts",
		});
		return directories
			.filter((post) => post.name !== "index")
			.sort(
				(a, b) =>
					new Date(b.frontMatter?.date || 0).getTime() -
					new Date(a.frontMatter?.date || 0).getTime()
			);
	} catch (error) {
		console.warn('Failed to get posts:', error);
		return [];
	}
}

export async function getTags() {
	const posts = await getPosts();
	const tags = posts.flatMap((post) => post.frontMatter.tags || []);
	return tags;
}
