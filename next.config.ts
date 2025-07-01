import nextra from "nextra";

// Set up Nextra with its configuration
const withNextra = nextra({
	defaultShowCopyCode: true,
	readingTime: true,
	staticImage: true,
	latex: true,
});

// Export the final Next.js config with Nextra included
export default withNextra({
	output: "export",  // <=== enables static exports
  	reactStrictMode: true,
	basePath: "/personal",  // <=== sets the base path for the app
});
