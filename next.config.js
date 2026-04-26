/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true'
const basePath = isGitHubPages ? '/Sing-' : ''

const nextConfig = {
  output: 'export',
  distDir: 'dist',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
}

module.exports = nextConfig
