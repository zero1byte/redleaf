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

const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

export const BlogCard = ({ blog }: BlogCardProps) => {
    const readTime = calculateReadTime(blog.contents);

    return (
        <Link href={`/blogs/${blog.id}`} className="block group">
            <article className="bg-card border-0 border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row h-full rounded-none">
                {/* Left: Image */}
                <div className="relative w-full sm:w-48 md:w-56 lg:w-64 flex-shrink-0 aspect-video sm:aspect-square overflow-hidden bg-muted">
                    <img
                        src={blog.banner_image || "https://xvkdsmspuyvzyzcpjiwk.supabase.co/storage/v1/object/public/users_avatars/98c31494-ce8e-411a-a2e4-35895bb6cc60/avatar.jpg"}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                            <svg
                                className="w-10 h-10 text-muted-foreground/40"
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
                    )} */}

                    {/* Premium Badge */}
                    {blog.is_premium && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-sm">
                            Premium
                        </span>
                    )}
                </div>

                {/* Right: Content */}
                <div className="flex-grow p-4 sm:p-5 flex flex-col justify-between min-w-0 
                border-r border-y border-border/90">
                    {/* Top Section */}
                    <div>
                        {/* Meta Row: Date & Read Time */}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                            <time dateTime={blog.created_at}>{formatDate(blog.created_at)}</time>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                            <span>{readTime} min read</span>
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-base sm:text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                            {blog.title}
                        </h3>

                        {/* Subtitle */}
                        {blog.subTitle && (
                            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2">
                                {blog.subTitle}
                            </p>
                        )}

                        {/* Content Preview - Hidden on very small screens */}
                        <p className="hidden sm:block mt-2 text-sm text-muted-foreground/80  line-clamp-3 truncate">
                            {blog.contents}
                        </p>
                    </div>

                    {/* Bottom Section: Author */}
                    <div className="mt-3 sm:mt-4 pt-3 border-t border-border/50 flex items-center gap-3">
                        {/* Author Avatar */}
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0 ring-2 ring-background">
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

                        {/* Author Info */}
                        <div className="min-w-0 flex-grow">
                            <p className="text-sm font-medium text-foreground truncate">
                                {blog.author?.full_name || blog.author?.username || 'Anonymous'}
                            </p>
                            {blog.author?.followers_count !== undefined && (
                                <p className="text-xs text-muted-foreground">
                                    {blog.author.followers_count.toLocaleString()} followers
                                </p>
                            )}
                        </div>

                        {/* Arrow Icon */}
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <svg
                                className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}