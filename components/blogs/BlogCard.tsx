import Link from 'next/link';
import type { Blog } from '@/app/api/blogs/route';
import { getBlogStats } from '@/app/services/blogs/stats';

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

export const BlogCard = async ({ blog, variant = 'default' }: BlogCardProps) => {
    const readTime = calculateReadTime(blog.contents);
    const cleanedContent = cleanContentForPreview(blog.contents);
    const stats = await getBlogStats(blog.id);

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
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-3 group-hover:text-primary-foreground transition-colors tracking-tight">
                                {blog.title}
                            </h2>

                            {/* Subtitle */}
                            {blog.subTitle && (
                                <p className="text-white/80 text-base sm:text-lg md:text-xl line-clamp-2 mb-4 max-w-3xl leading-relaxed">
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
                                                {( blog.author?.username ||blog.author?.full_name || 'A').charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-base sm:text-lg">
                                            {blog.author?.username || blog.author?.full_name || 'Anonymous'}
                                        </p>
                                        <p className="text-white/60 text-xs sm:text-sm">
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
                            <span>{blog.author?.username || blog.author?.full_name || 'Anonymous'}</span>
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
            <article className="overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-white/5 backdrop-blur-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:border-white/30 flex flex-col h-full">
                {/* Image Section */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted/50">
                    <img
                        src={blog.banner_image || "/placeholder-blog.jpg"}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                    {/* Premium Badge with Glass Effect */}
                    {blog.is_premium && (
                        <div className="absolute top-4 left-4">
                            <span className="px-3.5 py-1.5 bg-white/15 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg flex items-center gap-2 backdrop-blur-xl border border-white/20 hover:bg-white/25 transition-colors duration-300">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                Premium
                            </span>
                        </div>
                    )}

                    {/* Read Time Badge with Glass Effect - Mobile Only */}
                    <div className="absolute bottom-4 right-4 sm:hidden">
                        <span className="px-3 py-1.5 bg-white/20 text-white text-xs font-medium rounded-full backdrop-blur-xl border border-white/30">
                            {readTime} min read
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-5 sm:p-6 md:p-7 flex flex-col justify-between min-w-0">
                    {/* Top Content */}
                    <div>
                        {/* Meta Row with Glass Effect */}
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-3.5">
                            <time dateTime={blog.created_at} className="font-medium rounded-full bg-white/15 backdrop-blur-lg px-3 py-1.5 border border-white/25 hover:bg-white/25 hover:border-white/40 transition-all">
                                {formatDate(blog.created_at)}
                            </time>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                            <span className="hidden sm:inline font-medium">{readTime} min read</span>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-xl sm:text-2xl text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-snug tracking-tight">
                            {blog.title}
                        </h3>

                        {/* Subtitle */}
                        {blog.subTitle && (
                            <p className="mt-3 text-sm sm:text-base text-muted-foreground line-clamp-2 leading-relaxed">
                                {blog.subTitle}
                            </p>
                        )}

                        {/* Content Preview */}
                        {cleanedContent && (
                            <p className="mt-4 text-sm text-muted-foreground/75 line-clamp-2 lg:line-clamp-3 leading-relaxed">
                                {cleanedContent.slice(0, 150)}...
                            </p>
                        )}
                    </div>

                    {/* Author Section with Glass Effect */}
                    <div className="mt-6 pt-5 border-t border-white/15 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            {/* Avatar with Ring */}
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-white/30 to-white/10 ring-2 ring-white/30 shadow-lg flex-shrink-0 backdrop-blur-lg">
                                {blog.author?.avatar_url ? (
                                    <img
                                        src={blog.author.avatar_url}
                                        alt={blog.author.full_name || blog.author.username}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/40 to-white/20 text-primary text-xs font-bold">
                                        {(blog.author?.full_name || blog.author?.username || 'A').charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Author Info */}
                            <div className="min-w-0">
                                <p className="text-sm sm:text-base font-semibold text-foreground truncate">
                                    {blog.author?.username || blog.author?.full_name || 'Anonymous'}
                                </p>
                                {blog.author?.followers_count !== undefined && blog.author.followers_count > 0 && (
                                    <p className="text-xs sm:text-sm text-muted-foreground/70">
                                        {blog.author.followers_count.toLocaleString()} followers
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Action Button with Glass Effect */}
                        <div className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 backdrop-blur-xl px-3.5 py-2 text-xs font-semibold text-foreground group-hover:bg-white/40 group-hover:text-foreground group-hover:border-white/50 transition-all duration-300 shadow-md hover:shadow-lg">
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

                    {/* Stats Row with Glass Effect */}
                    {stats && !stats.isError && stats.data && (
                        <div className="mt-4 pt-4 border-t border-white/15 flex items-center justify-start gap-6">
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                                <svg className="w-4 h-4 text-muted-foreground/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span className="font-medium">{(stats.data.views || 0).toLocaleString()}</span>
                                <span className="text-muted-foreground/50">views</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                                <svg className="w-4 h-4 text-muted-foreground/70" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                                </svg>
                                <span className="font-medium">{(stats.data.share_count || 0).toLocaleString()}</span>
                                <span className="text-muted-foreground/50">shares</span>
                            </div>
                        </div>
                    )}
                </div>
            </article>
        </Link>
    );
}