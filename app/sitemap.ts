import { MetadataRoute } from 'next'
import { getBlogs } from '@/app/services/blogs/blogs'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://zerobytes.me'

    const response = await getBlogs()

    const blogs = response.data ?? []

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/blogs`,
            lastModified: new Date(),
        },
        ...blogs.map((blog) => ({
            url: `${baseUrl}/blogs/${blog.id}`,
            lastModified: blog.created_at,
        })),
    ]
}
