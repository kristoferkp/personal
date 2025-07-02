import { Footer, Layout, Navbar, ThemeSwitch } from "nextra-theme-blog";
import { getPosts } from "../posts/get-posts";
import "nextra-theme-blog/style.css";

export const metadata = {
	title: "Blog Example",
};

export default async function RootLayout({ children }) {
	// Create a minimal pageMap for static export
	let pageMap;
	try {
		const posts = await getPosts();
		pageMap = posts.map(post => ({
			kind: "MdxPage",
			name: post.name,
			route: `/blog/${post.name}`,
			frontMatter: post.frontMatter,
		}));
	} catch (error) {
		console.warn('Failed to generate pageMap for blog layout:', error);
		pageMap = [];
	}

	return (
		<Layout>
			<Navbar pageMap={pageMap}>
				<ThemeSwitch />
			</Navbar>

			{children}

			<Footer>
				<abbr
					title="This site and all its content are licensed under a Creative Commons Attribution-NonCommercial 4.0 International License."
					style={{ cursor: "help" }}
				>
					CC BY-NC 4.0
				</abbr>{" "}
				{new Date().getFullYear()} © Kristofer P.
				<a
					href="/feed.xml"
					style={{ float: "right" }}
				>
					RSS
				</a>
			</Footer>
		</Layout>
	);
}
