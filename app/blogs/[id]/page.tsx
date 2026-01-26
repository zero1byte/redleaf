import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogById } from '@/app/services/blogs/blogs';
import { Blog } from '@/app/api/blogs/route';

type PageProps = {
    params: { id: string };
};

interface BlogResponse {
    data: Blog;
    isError: boolean;
    error?: string;
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
};

const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

export default async function BlogPage({ params }: PageProps) {
    const { id } = await params;

    const response = await getBlogById(id) as BlogResponse;

    if (response.isError || !response.data) {
        notFound();
    }
    
    const blog = response.data;
    const readTime = calculateReadTime(blog.contents);

    return (
        <main className="min-h-screen bg-background">
            {/* Banner Image */}
            {blog.banner_image && (
                <div className="w-full h-[40vh] sm:h-[50vh] md:h-[60vh] relative overflow-hidden">
                    <img
                        src={blog.banner_image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
            )}

            <article className={`max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 ${blog.banner_image ? '-mt-24 relative z-10' : 'pt-8 sm:pt-12'}`}>
                {/* Header Section */}
                <header className="mb-8 sm:mb-12">
                    {/* Premium Badge */}
                    {blog.is_premium && (
                        <div className="mb-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium rounded-full border border-amber-500/20">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                Premium Content
                            </span>
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">
                        {blog.title}
                    </h1>

                    {/* Subtitle */}
                    {blog.subTitle && (
                        <p className="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed">
                            {blog.subTitle}
                        </p>
                    )}

                    {/* Author & Meta Section */}
                    <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pt-6 border-t border-border">
                        {/* Author Info */}
                        <div className="flex items-center gap-3">
                            <Link href={`/profile/${blog.author?.username}`} className="flex-shrink-0">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden ring-2 ring-primary/10 hover:ring-primary/30 transition-all">
                                    {blog.author?.avatar_url ? (
                                        <img
                                            src={blog.author.avatar_url}
                                            alt={blog.author.full_name || blog.author.username}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-lg sm:text-xl font-semibold">
                                            {(blog.author?.full_name || blog.author?.username || 'A').charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </Link>
                            <div className="flex flex-col">
                                <Link 
                                    href={`/profile/${blog.author?.username}`}
                                    className="font-semibold text-foreground hover:text-primary transition-colors"
                                >
                                    {blog.author?.full_name || blog.author?.username || 'Anonymous'}
                                </Link>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>{blog.author?.followers_count?.toLocaleString() || 0} followers</span>
                                </div>
                            </div>
                        </div>

                        {/* Divider - Hidden on mobile */}
                        <div className="hidden sm:block w-px h-10 bg-border" />

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <time dateTime={blog.created_at}>{formatDate(blog.created_at)}</time>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{readTime} min read</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Article Content */}
                <div className="prose prose-lg sm:prose-xl dark:prose-invert max-w-none
                    prose-headings:font-bold prose-headings:tracking-tight
                    prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                    prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                    prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                    prose-pre:bg-muted prose-pre:border prose-pre:border-border
                    prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
                    prose-img:rounded-xl prose-img:shadow-lg
                    prose-ul:my-6 prose-ol:my-6 prose-li:text-muted-foreground
                ">
                    <div className="whitespace-pre-wrap">{blog.contents}</div>
                </div>

                {/* Footer Section */}
                <footer className="mt-12 sm:mt-16 pt-8 border-t border-border">
                    {/* Author Card */}
                    <div className="bg-muted/30 rounded-2xl p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link href={`/profile/${blog.author?.username}`} className="flex-shrink-0 self-start">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-background shadow-lg hover:ring-primary/20 transition-all">
                                    {blog.author?.avatar_url ? (
                                        <img
                                            src={blog.author.avatar_url}
                                            alt={blog.author.full_name || blog.author.username}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground text-2xl sm:text-3xl font-bold">
                                            {(blog.author?.full_name || blog.author?.username || 'A').charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </Link>
                            <div className="flex-grow">
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                    Written by
                                </p>
                                <Link 
                                    href={`/profile/${blog.author?.username}`}
                                    className="text-xl sm:text-2xl font-bold text-foreground hover:text-primary transition-colors"
                                >
                                    {blog.author?.full_name || blog.author?.username || 'Anonymous'}
                                </Link>
                                {blog.author?.username && (
                                    <p className="text-muted-foreground mt-1">@{blog.author.username}</p>
                                )}
                                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <span className="font-semibold text-foreground">{blog.author?.followers_count?.toLocaleString() || 0}</span> followers
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="font-semibold text-foreground">{blog.author?.following_count?.toLocaleString() || 0}</span> following
                                    </span>
                                </div>
                                <Link
                                    href={`/profile/${blog.author?.username}`}
                                    className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-colors"
                                >
                                    View Profile
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Back to Blogs */}
                    <div className="mt-8 text-center pb-12">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to all blogs
                        </Link>
                    </div>
                </footer>
            </article>
        </main>
    );
}
