import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin',
      // Google no debe indexar el panel admin
    },
    sitemap: 'https://todopaz.vercel.app/sitemap.xml',
  }
}