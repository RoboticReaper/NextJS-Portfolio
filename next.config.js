const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/
});

const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
};

// Merge MDX config with Next.js config
module.exports = withMDX(nextConfig);