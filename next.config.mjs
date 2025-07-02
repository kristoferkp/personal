import nextra from "nextra";

// Set up Nextra with its configuration
const withNextra = nextra({
	staticImage: true,
	// contentDirBasePath: '/blog' // Commented out to use root content directory
});

// Export the final Next.js config with Nextra included
export default withNextra({
	// output: "export",  // <=== temporarily disabled for debugging
  	reactStrictMode: true,
	basePath: "/personal",  // <=== sets the base path for the app
	images: {
		unoptimized: true,  // <=== required for static export
	},
	trailingSlash: true,  // <=== helps with static export routing
});
