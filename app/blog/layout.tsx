import { Footer, Layout, Navbar, ThemeSwitch } from "nextra-theme-blog";
import { Search } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-blog/style.css";

export const metadata = {
	title: "Blog Example",
};

export default async function RootLayout({ children }) {
	return (
		<Layout>
			<Navbar pageMap={await getPageMap()}>
				<Search />
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
