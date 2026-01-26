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
                <div className="relative w-full sm:w-40 md:w-48 lg:w-56 xl:w-64 flex-shrink-0 aspect-[16/10] sm:aspect-[4/3] md:aspect-square overflow-hidden bg-muted">
                    <img
                        src={blog.banner_image || "https://xvkdsmspuyvzyzcpjiwk.supabase.co/storage/v1/object/public/users_avatars/98c31494-ce8e-411a-a2e4-35895bb6cc60/avatar.jpg"}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Premium Badge */}
                    {blog.is_premium && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-sm">
                            Premium
                        </span>
                    )}
                </div>

                {/* Right: Content */}
                <div className="flex-grow p-3 xs:p-4 sm:p-4 md:p-5 flex flex-col justify-between min-w-0 
                border border-border/50">
                    {/* Top Section */}
                    <div>
                        {/* Meta Row: Date & Read Time */}
                        <div className="flex items-center gap-2 sm:gap-3 text-[10px] xs:text-xs text-muted-foreground mb-1.5 sm:mb-2">
                            <time dateTime={blog.created_at}>{formatDate(blog.created_at)}</time>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                            <span>{readTime} min read</span>
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-sm xs:text-base sm:text-base md:text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                            {blog.title}
                        </h3>

                        {/* Subtitle - Show on all but limit lines */}
                        {blog.subTitle && (
                            <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2">
                                {blog.subTitle}
                            </p>
                        )}

                        {/* Content Preview - Hidden on mobile, show progressively */}
                        <p className="hidden md:block mt-2 text-xs md:text-sm text-muted-foreground/80 line-clamp-2 lg:line-clamp-3">
                            {blog.contents}
                        </p>
                    </div>

                    {/* Bottom Section: Author */}
                    <div className="mt-2 xs:mt-3 sm:mt-3 md:mt-4 pt-2 sm:pt-3 border-t border-border/50 flex items-center gap-2 sm:gap-3">
                        {/* Author Avatar */}
                        <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-muted flex-shrink-0 ring-2 ring-background">
                            {blog.author?.avatar_url ? (
                                <img
                                    src={blog.author.avatar_url}
                                    alt={blog.author.full_name || blog.author.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-xs sm:text-sm font-medium">
                                    {(blog.author?.full_name || blog.author?.username || 'A').charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Author Info */}
                        <div className="min-w-0 flex-grow">
                            <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                                {blog.author?.full_name || blog.author?.username || 'Anonymous'}
                            </p>
                            {blog.author?.followers_count !== undefined && (
                                <p className="hidden xs:block text-[10px] sm:text-xs text-muted-foreground">
                                    {blog.author.followers_count.toLocaleString()} followers
                                </p>
                            )}
                        </div>

                        {/* Arrow Icon */}
                        <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <svg
                                className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-primary transition-colors"
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