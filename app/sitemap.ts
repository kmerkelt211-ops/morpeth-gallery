import type { MetadataRoute } from 'next'
import { siteUrl } from './site-config'

const staticRoutes = [
  '/',
  '/exhibitions',
  '/student',
  '/staff',
  '/guest-artists',
  '/alumni',
  '/house',
  '/clubs',
  '/support',
  '/shop',
  '/about',
]

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }))
}
