import Link from 'next/link';
import type { Blog } from '@/app/api/blogs/route';

interface BlogCardProps {
    blog: Blog;
    variant?: 'default' | 'featured' | 'compact' | 'horizontal';
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
};

const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

// Clean markdown content for preview
const cleanContentForPreview = (content: string): string => {
    return content
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/^#{1,3}\s+/gm, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/<u>([^<]+)<\/u>/g, '$1')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/^>\s+/gm, '')
        .replace(/^(\s*)[-*]\s+/gm, '')
        .replace(/^(\s*)\d+\.\s+/gm, '')
        .replace(/^---$/gm, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
};

export const BlogCard = ({ blog, variant = 'default' }: BlogCardProps) => {
    const readTime = calculateReadTime(blog.contents);
    const cleanedContent = cleanContentForPreview(blog.contents);

    // Featured Card - Large hero-style card
    if (variant === 'featured') {
        return (
            <Link href={`/blogs/${blog.id}`} className="block group">
                <article className="relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-500">
                    {/* Background Image with Overlay */}
                    <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
                        <img
                            src={blog.banner_image || "/placeholder-blog.jpg"}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        
                        {/* Content Overlay */}
                        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
                            {/* Badges */}
                            <div className="flex items-center gap-2 mb-4">
                                {blog.is_premium && (
                                    <span className="px-3 py-1 bg-amber-500/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        Premium
                                    </span>
                                )}
                                <span className="px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                                    Featured
                                </span>
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-3 group-hover:text-primary-foreground transition-colors">
                                {blog.title}
                            </h2>

                            {/* Subtitle */}
                            {blog.subTitle && (
                                <p className="text-white/80 text-sm sm:text-base md:text-lg line-clamp-2 mb-4 max-w-3xl">
                                    {blog.subTitle}
                                </p>
                            )}

                            {/* Author & Meta */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/30">
                                        {blog.author?.avatar_url ? (
                                            <img src={blog.author.avatar_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-white/20 text-white font-semibold">
                                                {(blog.author?.full_name || blog.author?.username || 'A').charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-sm">
                                            {blog.author?.full_name || blog.author?.username || 'Anonymous'}
                                        </p>
                                        <p className="text-white/60 text-xs">
                                            {formatDate(blog.created_at)} · {readTime} min read
                                        </p>
                                    </div>
                                </div>
                                <div className="hidden sm:flex items-center gap-2 text-white/60 text-sm">
                                    <span className="px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                                        Read article →
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </Link>
        );
    }

    // Compact Card - Minimal design for sidebars or lists
    if (variant === 'compact') {
        return (
            <Link href={`/blogs/${blog.id}`} className="block group">
                <article className="flex gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                        <img
                            src={blog.banner_image || "/placeholder-blog.jpg"}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {blog.is_premium && (
                            <div className="absolute top-1 left-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {blog.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                            <span>{blog.author?.full_name || blog.author?.username}</span>
                            <span>·</span>
                            <span>{readTime} min</span>
                        </div>
                    </div>
                </article>
            </Link>
        );
    }

    // Default Card - Standard blog card with image and content
    return (
        <Link href={`/blogs/${blog.id}`} className="block group">
            <article className="overflow-hidden rounded-none border border-border/60 bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-xl flex flex-col md:flex-row h-full">
                {/* Image Section */}
                <div className="relative w-full md:w-64 lg:w-72 flex-shrink-0 aspect-[16/9] md:aspect-[4/5] overflow-hidden bg-muted">
                    <img
                        src={blog.banner_image || "/placeholder-blog.jpg"}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Gradient Overlay on Mobile */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:hidden" />

                    {/* Premium Badge */}
                    {blog.is_premium && (
                        <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-md shadow-lg flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                Premium
                            </span>
                        </div>
                    )}

                    {/* Read Time Badge - Mobile Only */}
                    <div className="absolute bottom-3 right-3 sm:hidden">
                        <span className="px-2 py-1 bg-black/60 text-white text-[10px] font-medium rounded-md backdrop-blur-sm">
                            {readTime} min read
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-4 sm:p-5 md:p-6 flex flex-col justify-between min-w-0">
                    {/* Top Content */}
                    <div>
                        {/* Meta Row */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-2.5">
                            <time dateTime={blog.created_at} className="font-medium rounded-full bg-muted px-2.5 py-1">
                                {formatDate(blog.created_at)}
                            </time>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                            <span className="hidden sm:inline">{readTime} min read</span>
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-lg sm:text-xl text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug tracking-tight">
                            {blog.title}
                        </h3>

                        {/* Subtitle */}
                        {blog.subTitle && (
                            <p className="mt-2 text-sm sm:text-[15px] text-muted-foreground line-clamp-2">
                                {blog.subTitle}
                            </p>
                        )}

                        {/* Content Preview */}
                        {cleanedContent && (
                            <p className="mt-3 text-sm text-muted-foreground/85 line-clamp-2 lg:line-clamp-3 leading-relaxed">
                                {cleanedContent.slice(0, 150)}...
                            </p>
                        )}
                    </div>

                    {/* Author Section */}
                    <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-muted ring-2 ring-background shadow-sm">
                                {blog.author?.avatar_url ? (
                                    <img
                                        src={blog.author.avatar_url}
                                        alt={blog.author.full_name || blog.author.username}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-xs font-semibold">
                                        {(blog.author?.full_name || blog.author?.username || 'A').charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Author Info */}
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {blog.author?.full_name || blog.author?.username || 'Anonymous'}
                                </p>
                                {blog.author?.followers_count !== undefined && blog.author.followers_count > 0 && (
                                    <p className="text-[11px] text-muted-foreground">
                                        {blog.author.followers_count.toLocaleString()} followers
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs font-medium text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
                            Read
                            <svg
                                className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform"
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