import { MetadataRoute } from 'next';
import { getBlogs } from '@/app/services/blogs/blogs';
import type { Blog } from '@/app/api/blogs/route';

interface BlogsResponse {
    data: Blog[] | null;
    isError: boolean;
    error?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://zerobytes.me';

    const response = (await getBlogs()) as BlogsResponse;

    const blogs: Blog[] = response.isError
        ? []
        : (response.data ?? []);

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/blogs`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...blogs.map((blog) => ({
            url: `${baseUrl}/blogs/${blog.id}`,
            lastModified: new Date(blog.created_at),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        })),
    ];
}
