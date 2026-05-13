// next-sitemap.config.js
// Note: We're using Next.js native route handlers (app/robots.ts and app/sitemap.ts)
// This config is kept for any additional sitemap functionality if needed

export default {
  siteUrl: 'https://zerobytes.me',
  generateRobotsTxt: false, // Disabled - using Next.js native robots.ts instead
  exclude: [
    '/404',
    '/500',
    '/_app',
    '/_document',
    '/_error',
    '/api/*',
    '/admin/*',
    '/auth/*',
  ],
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 50000,
};