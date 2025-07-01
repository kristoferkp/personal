import { generateStaticParamsFor, importPage } from "nextra/pages";
import { useMDXComponents as getMDXComponents } from "../../../mdx-components";

export async function generateStaticParams() {
	try {
		const params = generateStaticParamsFor("mdxPath");
		return await params();
	} catch (error) {
		console.warn('Failed to generate static params for blog:', error);
		// Return a minimal set of params for the blog index
		return [{ mdxPath: [] }];
	}
}

export async function generateMetadata(props) {
	try {
		const params = await props.params;
		const { metadata } = await importPage(params.mdxPath);
		return metadata;
	} catch (error) {
		console.warn('Failed to generate metadata for blog:', error);
		return {
			title: 'Blog',
			description: 'My personal blog'
		};
	}
}

const Wrapper = getMDXComponents({}).wrapper;

export default async function Page(props) {
	try {
		const params = await props.params;
		const result = await importPage(params.mdxPath);
		const { default: MDXContent, toc, metadata } = result;
		return (
			<Wrapper
				toc={toc}
				metadata={metadata}
			>
				<MDXContent
					{...props}
					params={params}
				/>
			</Wrapper>
		);
	} catch (error) {
		console.warn('Failed to load blog page:', error);
		// Return a fallback blog page
		return (
			<div className="max-w-4xl mx-auto p-6">
				<h1 className="text-3xl font-bold mb-4">Blog</h1>
				<p className="text-gray-600">Welcome to my blog. Posts coming soon!</p>
			</div>
		);
	}
}
