import { BlogCard } from './BlogCard';
import { getBlogs } from '@/app/services/blogs/blogs';
import type { Blog } from '@/app/api/blogs/route';

interface BlogsResponse {
    data: Blog[] | null;
    isError: boolean;
    error?: string;
}

export const Blogs = async () => {
    const response = await getBlogs() as BlogsResponse;
    
    if (response.isError) {
        return (
            <section className="py-12 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-destructive">Failed to load blogs. Please try again later.</p>
                </div>
            </section>
        );
    }

    const blogs = response.data ?? [];
    
    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                        Latest Blogs
                    </h2>
                    <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                        Discover insights, tutorials, and stories from our community
                    </p>
                </div>

                {/* Blog Grid */}
                {blogs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {blogs.map((blog) => (
                            <BlogCard key={blog.id} blog={blog} />
                        ))
                        }
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                            <svg
                                className="w-8 h-8 text-muted-foreground"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                />
                            </svg>
                        </div>
                        <p className="text-lg text-muted-foreground">No blogs available yet.</p>
                        <p className="mt-1 text-sm text-muted-foreground/70">Check back soon for new content!</p>
                    </div>
                )}
            </div>
        </section>
    );
};
