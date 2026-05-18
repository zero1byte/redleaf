import { BlogCard } from './BlogCard';
import { getBlogs } from '@/app/services/blogs/blogs';
import { BlogSkeletonGrid } from '@/components/loaders/blogCardLoader';
import type { Blog } from '@/app/api/blogs/route';
import { Suspense } from 'react';

interface BlogsResponse {
    data: Blog[] | null;
    isError: boolean;
    error?: string;
}

async function BlogsContent() {
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
        <>
            {blogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {blogs.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center py-20 md:py-28">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-6 ring-1 ring-primary/10">
                            <svg
                                className="w-10 h-10 text-muted-foreground"
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
                        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">No blogs available yet</h3>
                        <p className="text-base text-muted-foreground">Check back soon for new content!</p>
                    </div>
                </div>
            )}
        </>
    );
}

export const Blogs = () => {
    return (
        <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 w-full relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-40" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-30" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="mb-12 md:mb-16 text-center">
                    <div className="inline-block mb-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                        <span className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wide">Featured Content</span>
                    </div>
                    <h2 className="section-title text-foreground">
                        Latest Blogs
                    </h2>
                    <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Discover insights, tutorials, and stories from our community
                    </p>
                </div>

                {/* Blog Grid with Suspense */}
                <Suspense fallback={<BlogSkeletonGrid count={6} variant="default" />}>
                    <BlogsContent />
                </Suspense>
            </div>
        </section>
    );
}
