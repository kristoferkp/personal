import nextra from 'nextra'

// Set up Nextra with its configuration
const withNextra = nextra({
  contentDirBasePath: '/blog'
})

// Export the final Next.js config with Nextra included
export default withNextra({
  basePath: "/personal",
  assetPrefix: "/personal/",
  trailingSlash: true,
  output: 'export',
  images: {
    unoptimized: true
  }
})