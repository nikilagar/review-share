import { MetadataRoute } from 'next'
import { headers } from 'next/headers'

export default async function robots(): Promise<MetadataRoute.Robots> {
    const headersList = await headers()
    const host = headersList.get('host') || 'friendlyreview.com'
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        sitemap: `${protocol}://${host}/sitemap.xml`,
    }
}
