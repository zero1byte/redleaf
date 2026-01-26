import Link from 'next/link';
import type { Blog } from '@/app/api/blogs/route';

interface BlogCardProps {
    blog: Blog;
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
};

export const BlogCard = ({ blog }: BlogCardProps) => {
    return (
        <Link href={`/blogs/${blog.id}`} className="block group">
            <article className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                {/* Banner Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    {blog.banner_image ? (
                        <img
                            src={blog.banner_image}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                            <svg
                                className="w-12 h-12 text-muted-foreground/40"
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
                    )}

                    {/* Premium Badge */}
                    {blog.is_premium && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-sm">
                            Premium
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                    {/* Title */}
                    <h3 className="font-semibold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {blog.title}
                    </h3>

                    {/* Subtitle */}
                    {blog.subTitle && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {blog.subTitle}
                        </p>
                    )}

                    {/* Content Preview */}
                    <p className="mt-2 text-sm text-muted-foreground/80 line-clamp-2 flex-grow">
                        {truncateText(blog.contents, 100)}
                    </p>

                    {/* Footer: Author & Date */}
                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-3">
                        {/* Author */}
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
                                {blog.author?.avatar_url ? (
                                    <img
                                        src={blog.author.avatar_url}
                                        alt={blog.author.full_name || blog.author.username}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-sm font-medium">
                                        {(blog.author?.full_name || blog.author?.username || 'A').charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <span className="text-sm font-medium text-foreground truncate">
                                {blog.author?.full_name || blog.author?.username || 'Anonymous'}
                            </span>
                        </div>

                        {/* Date */}
                        <time className="text-xs text-muted-foreground flex-shrink-0">
                            {formatDate(blog.created_at)}
                        </time>
                    </div>
                </div>
            </article>
        </Link>
    );
}