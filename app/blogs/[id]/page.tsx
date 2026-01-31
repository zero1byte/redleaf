import { JSX } from 'react';
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

// Content Renderer Component
const BlogContent = ({ content }: { content: string }) => {
    const renderContent = () => {
        const blocks = content.split('\n\n');
        const elements: JSX.Element[] = [];
        let listItems: { type: 'bullet' | 'numbered'; content: string; indent: number }[] = [];
        let inCodeBlock = false;
        let codeContent: string[] = [];

        const flushList = () => {
            if (listItems.length > 0) {
                const listType = listItems[0].type;
                const ListTag = listType === 'numbered' ? 'ol' : 'ul';
                elements.push(
                    <ListTag
                        key={`list-${elements.length}`}
                        className={`my-6 ${listType === 'numbered' ? 'list-decimal' : 'list-disc'} list-outside ml-6 space-y-2`}
                    >
                        {listItems.map((item, i) => (
                            <li
                                key={i}
                                className="text-lg text-muted-foreground leading-relaxed"
                                style={{ marginLeft: item.indent * 24 }}
                            >
                                {renderInlineFormatting(item.content)}
                            </li>
                        ))}
                    </ListTag>
                );
                listItems = [];
            }
        };

        const renderInlineFormatting = (text: string): React.ReactNode => {
            // Handle bold **text**
            let result: React.ReactNode[] = [];
            const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|<u>[^<]+<\/u>|\[[^\]]+\]\([^)]+\))/g);

            parts.forEach((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    result.push(<strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>);
                } else if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
                    result.push(<em key={i} className="italic">{part.slice(1, -1)}</em>);
                } else if (part.startsWith('<u>') && part.endsWith('</u>')) {
                    result.push(<u key={i}>{part.slice(3, -4)}</u>);
                } else if (part.match(/^\[[^\]]+\]\([^)]+\)$/)) {
                    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                    if (match) {
                        result.push(
                            <a key={i} href={match[2]} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                                {match[1]}
                            </a>
                        );
                    }
                } else {
                    result.push(part);
                }
            });

            return result;
        };

        blocks.forEach((block, index) => {
            const trimmedBlock = block.trim();

            // Handle code blocks
            if (trimmedBlock.startsWith('```')) {
                if (!inCodeBlock) {
                    inCodeBlock = true;
                    codeContent = [];
                    const firstLine = trimmedBlock.slice(3);
                    if (firstLine && !firstLine.includes('```')) {
                        codeContent.push(firstLine);
                    }
                }
                if (trimmedBlock.endsWith('```') && trimmedBlock.length > 3) {
                    inCodeBlock = false;
                    const code = trimmedBlock.slice(3, -3).trim();
                    flushList();
                    elements.push(
                        <pre key={`code-${index}`} className="my-6 bg-muted border border-border rounded-lg p-4 overflow-x-auto">
                            <code className="text-sm font-mono text-foreground">{code || codeContent.join('\n')}</code>
                        </pre>
                    );
                    codeContent = [];
                }
                return;
            }

            if (inCodeBlock) {
                codeContent.push(block);
                return;
            }

            // Handle divider
            if (trimmedBlock === '---') {
                flushList();
                elements.push(<hr key={`hr-${index}`} className="my-8 border-border" />);
                return;
            }

            // Handle headings
            if (trimmedBlock.startsWith('# ')) {
                flushList();
                elements.push(
                    <h1 key={`h1-${index}`} className="text-3xl sm:text-4xl font-bold text-foreground mt-12 mb-6 tracking-tight">
                        {renderInlineFormatting(trimmedBlock.slice(2))}
                    </h1>
                );
                return;
            }

            if (trimmedBlock.startsWith('## ')) {
                flushList();
                elements.push(
                    <h2 key={`h2-${index}`} className="text-2xl sm:text-3xl font-semibold text-foreground mt-10 mb-5 tracking-tight">
                        {renderInlineFormatting(trimmedBlock.slice(3))}
                    </h2>
                );
                return;
            }

            if (trimmedBlock.startsWith('### ')) {
                flushList();
                elements.push(
                    <h3 key={`h3-${index}`} className="text-xl sm:text-2xl font-medium text-foreground mt-8 mb-4 tracking-tight">
                        {renderInlineFormatting(trimmedBlock.slice(4))}
                    </h3>
                );
                return;
            }

            // Handle images
            const imageMatch = trimmedBlock.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
            if (imageMatch) {
                flushList();
                elements.push(
                    <figure key={`img-${index}`} className="my-8">
                        <img
                            src={imageMatch[2]}
                            alt={imageMatch[1] || 'Blog image'}
                            className="w-full rounded-xl shadow-lg"
                        />
                        {imageMatch[1] && (
                            <figcaption className="mt-3 text-center text-sm text-muted-foreground">
                                {imageMatch[1]}
                            </figcaption>
                        )}
                    </figure>
                );
                return;
            }

            // Handle blockquotes
            if (trimmedBlock.startsWith('> ')) {
                flushList();
                elements.push(
                    <blockquote
                        key={`quote-${index}`}
                        className="my-6 border-l-4 border-primary bg-muted/50 py-4 px-6 rounded-r-lg italic text-lg text-muted-foreground"
                    >
                        {renderInlineFormatting(trimmedBlock.slice(2))}
                    </blockquote>
                );
                return;
            }

            // Handle bullet lists
            if (trimmedBlock.match(/^(\s*)- /)) {
                const match = trimmedBlock.match(/^(\s*)- (.+)$/);
                if (match) {
                    const indent = Math.floor(match[1].length / 2);
                    if (listItems.length > 0 && listItems[0].type !== 'bullet') {
                        flushList();
                    }
                    listItems.push({ type: 'bullet', content: match[2], indent });
                }
                return;
            }

            // Handle numbered lists
            if (trimmedBlock.match(/^(\s*)\d+\. /)) {
                const match = trimmedBlock.match(/^(\s*)\d+\. (.+)$/);
                if (match) {
                    const indent = Math.floor(match[1].length / 2);
                    if (listItems.length > 0 && listItems[0].type !== 'numbered') {
                        flushList();
                    }
                    listItems.push({ type: 'numbered', content: match[2], indent });
                }
                return;
            }

            // Handle bold text block
            if (trimmedBlock.startsWith('**') && trimmedBlock.endsWith('**')) {
                flushList();
                elements.push(
                    <p key={`bold-${index}`} className="text-lg sm:text-xl text-foreground font-bold leading-relaxed my-4">
                        {trimmedBlock.slice(2, -2)}
                    </p>
                );
                return;
            }

            // Handle regular paragraphs
            if (trimmedBlock) {
                flushList();
                elements.push(
                    <p key={`p-${index}`} className="text-lg text-muted-foreground leading-relaxed my-4">
                        {renderInlineFormatting(trimmedBlock)}
                    </p>
                );
            }
        });

        // Flush any remaining list items
        flushList();

        return elements;
    };

    return <div className="content">{renderContent()}</div>;
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
        <main className="h-full bg-background">
            <article className={`max-w-3xl mx-auto px-4 sm:px-6 pt-5 lg:px-8 ${blog.banner_image ? 'relative z-10' : 'pt-8 sm:pt-12'}`}>
                {/* Header Section */}
                <div className="mb-8 sm:mb-12">
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
                    <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-2 border-0 bg-foreground/5 border-border rounded-lg">
                        {/* Author Info */}
                        <div className="flex items-center gap-3">
                            <Link href={`/profile/${blog.author?.username}`} className="flex-shrink-0">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-primary/10 hover:ring-primary/30 transition-all">
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
                </div>

                {/* Article Content */}
                <div className="prose prose-lg sm:prose-xl dark:prose-invert max-w-none">
                    <BlogContent content={blog.contents} />
                </div>

            </article>
        </main>
    );
}
