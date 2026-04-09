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
        year: 'numeric',
    });
};

const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

// ─── Inline Formatting ────────────────────────────────────────────────────────
const renderInlineFormatting = (text: string): React.ReactNode => {
    const parts = text.split(
        /(\*\*[^*]+\*\*|\*[^*]+\*|<u>[^<]+<\/u>|\[[^\]]+\]\([^)]+\))/g
    );
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**'))
            return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
        if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**'))
            return <em key={i}>{part.slice(1, -1)}</em>;
        if (part.startsWith('<u>') && part.endsWith('</u>'))
            return <u key={i}>{part.slice(3, -4)}</u>;
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch)
            return (
                <a key={i} href={linkMatch[2]} className="text-primary underline underline-offset-2 hover:opacity-75 transition-opacity" target="_blank" rel="noopener noreferrer">
                    {linkMatch[1]}
                </a>
            );
        return part;
    });
};

// ─── Blog Content Renderer ────────────────────────────────────────────────────
const BlogContent = ({ content }: { content: string }) => {
    const renderContent = () => {
        const elements: JSX.Element[] = [];
        let listItems: { type: 'bullet' | 'numbered'; content: string; indent: number }[] = [];
        
        // Extract code blocks first with positions
        const codeBlockRegex = /```([\w]*)\n([\s\S]*?)```/g;
        const codeBlocks: Array<{ placeholder: string; lang: string; code: string }> = [];
        let processedContent = content;
        let codeBlockIndex = 0;

        processedContent = processedContent.replace(codeBlockRegex, (match) => {
            const langMatch = match.match(/```([\w]*)\n/);
            const codeMatch = match.match(/```([\w]*)\n([\s\S]*?)```/);
            const lang = langMatch?.[1] || '';
            const code = codeMatch?.[2]?.trim() || '';
            
            const placeholder = `__CODE_BLOCK_${codeBlockIndex}__`;
            codeBlocks.push({
                placeholder,
                lang,
                code
            });
            codeBlockIndex++;
            
            // Replace with placeholder surrounded by newlines to preserve structure
            return `\n${placeholder}\n`;
        });

        // Split by double newlines for paragraph separation
        const blocks = processedContent.split('\n\n');

        const flushList = () => {
            if (listItems.length === 0) return;
            const listType = listItems[0].type;
            const ListTag = listType === 'numbered' ? 'ol' : 'ul';
            elements.push(
                <ListTag
                    key={`list-${elements.length}`}
                    className={`my-7 space-y-2 pl-6 ${listType === 'numbered' ? 'list-decimal' : 'list-disc'}`}
                >
                    {listItems.map((item, i) => (
                        <li key={i} className="text-base leading-relaxed text-muted-foreground" style={{ marginLeft: item.indent * 20 }}>
                            {renderInlineFormatting(item.content)}
                        </li>
                    ))}
                </ListTag>
            );
            listItems = [];
        };

        blocks.forEach((block, index) => {
            const trimmed = block.trim();

            if (!trimmed) return;

            // Check if this is a code block placeholder
            if (trimmed.startsWith('__CODE_BLOCK_') && trimmed.endsWith('__')) {
                const blockIndex = parseInt(trimmed.match(/\d+/)?.[0] || '0');
                if (codeBlocks[blockIndex]) {
                    const { lang, code } = codeBlocks[blockIndex];
                    flushList();
                    elements.push(
                        <div key={`code-${index}`} className="my-8 rounded-xl overflow-hidden border border-border/60">
                            {lang && (
                                <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/80 border-b border-border/60">
                                    <div className="flex gap-1.5">
                                        <span className="w-3 h-3 rounded-full bg-red-400/70" />
                                        <span className="w-3 h-3 rounded-full bg-amber-400/70" />
                                        <span className="w-3 h-3 rounded-full bg-green-400/70" />
                                    </div>
                                    <span className="ml-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">{lang}</span>
                                </div>
                            )}
                            <pre className="overflow-x-auto bg-muted/50 p-5">
                                <code className="text-sm font-mono text-foreground leading-relaxed whitespace-pre-wrap break-words">{code}</code>
                            </pre>
                        </div>
                    );
                }
                return;
            }

            // Divider
            if (trimmed === '---') {
                flushList();
                elements.push(
                    <div key={`hr-${index}`} className="my-12 flex items-center gap-4">
                        <div className="flex-1 h-px bg-border/60" />
                        <div className="flex gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                        </div>
                        <div className="flex-1 h-px bg-border/60" />
                    </div>
                );
                return;
            }

            // H1
            if (trimmed.startsWith('# ')) {
                flushList();
                elements.push(
                    <h1 key={`h1-${index}`} className="mt-14 mb-5 text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
                        {renderInlineFormatting(trimmed.slice(2))}
                    </h1>
                );
                return;
            }

            // H2
            if (trimmed.startsWith('## ')) {
                flushList();
                elements.push(
                    <h2 key={`h2-${index}`} className="mt-12 mb-4 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-snug">
                        {renderInlineFormatting(trimmed.slice(3))}
                    </h2>
                );
                return;
            }

            // H3
            if (trimmed.startsWith('### ')) {
                flushList();
                elements.push(
                    <h3 key={`h3-${index}`} className="mt-10 mb-3 text-xl sm:text-2xl font-semibold text-foreground leading-snug">
                        {renderInlineFormatting(trimmed.slice(4))}
                    </h3>
                );
                return;
            }

            // H4
            if (trimmed.startsWith('#### ')) {
                flushList();
                elements.push(
                    <h4 key={`h4-${index}`} className="mt-8 mb-2 text-lg font-semibold text-foreground">
                        {renderInlineFormatting(trimmed.slice(5))}
                    </h4>
                );
                return;
            }

            // Image
            const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
            if (imgMatch) {
                flushList();
                elements.push(
                    <figure key={`img-${index}`} className="my-10">
                        <div className="overflow-hidden rounded-2xl border border-border/40">
                            <img src={imgMatch[2]} alt={imgMatch[1] || 'Blog image'} className="w-full object-cover" />
                        </div>
                        {imgMatch[1] && (
                            <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">
                                {imgMatch[1]}
                            </figcaption>
                        )}
                    </figure>
                );
                return;
            }

            // Blockquote
            if (trimmed.startsWith('> ')) {
                flushList();
                elements.push(
                    <blockquote key={`quote-${index}`} className="my-8 relative pl-6 pr-4 py-1">
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-foreground/20" />
                        <p className="text-lg sm:text-xl italic text-muted-foreground leading-relaxed">
                            {renderInlineFormatting(trimmed.slice(2))}
                        </p>
                    </blockquote>
                );
                return;
            }

            // Bullet list
            if (trimmed.match(/^(\s*)- /)) {
                const match = trimmed.match(/^(\s*)- (.+)$/);
                if (match) {
                    const indent = Math.floor(match[1].length / 2);
                    if (listItems.length > 0 && listItems[0].type !== 'bullet') flushList();
                    listItems.push({ type: 'bullet', content: match[2], indent });
                }
                return;
            }

            // Numbered list
            if (trimmed.match(/^(\s*)\d+\. /)) {
                const match = trimmed.match(/^(\s*)\d+\. (.+)$/);
                if (match) {
                    const indent = Math.floor(match[1].length / 2);
                    if (listItems.length > 0 && listItems[0].type !== 'numbered') flushList();
                    listItems.push({ type: 'numbered', content: match[2], indent });
                }
                return;
            }

            // Bold block
            if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                flushList();
                elements.push(
                    <p key={`bold-${index}`} className="my-5 text-base sm:text-lg font-semibold text-foreground leading-relaxed">
                        {trimmed.slice(2, -2)}
                    </p>
                );
                return;
            }

            // Regular paragraph
            if (trimmed) {
                flushList();
                elements.push(
                    <p key={`p-${index}`} className="my-5 text-base sm:text-[17px] text-muted-foreground leading-[1.85] tracking-[0.01em]">
                        {renderInlineFormatting(trimmed)}
                    </p>
                );
            }
        });

        flushList();
        return elements;
    };

    return <div>{renderContent()}</div>;
};

// ─── Icon components ──────────────────────────────────────────────────────────
const CalendarIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const ClockIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const StarIcon = () => (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogPage({ params }: PageProps) {
    const { id } = await params;
    const response = await getBlogById(id) as BlogResponse;

    if (response.isError || !response.data) notFound();

    const blog = response.data;
    const readTime = calculateReadTime(blog.contents);

    const authorInitial = (blog.author?.full_name || blog.author?.username || 'A').charAt(0).toUpperCase();

    return (
        <main className="min-h-screen bg-background">

            {/* ── Banner Image ── */}
            {blog.banner_image && (
                <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 pt-10 sm:pt-12">
                    <div className="w-full h-[38vh] sm:h-[46vh] md:h-[52vh] overflow-hidden rounded-xl">
                        <img
                            src={blog.banner_image}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            )}

            {/* ── Article wrapper ── */}
            <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 pb-20">

                {/* ── Header ── */}
                <header className={`${blog.banner_image ? 'pt-8 sm:pt-10' : 'pt-14 sm:pt-20'}`}>

                    {/* Premium badge */}
                    {blog.is_premium && (
                        <div className="mb-5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium tracking-wide rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                <StarIcon />
                                Premium
                            </span>
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-[2.65rem] font-bold text-foreground leading-[1.2] tracking-tight">
                        {blog.title}
                    </h1>

                    {/* Subtitle */}
                    {blog.subTitle && (
                        <p className="mt-4 text-lg sm:text-xl text-muted-foreground leading-relaxed font-light">
                            {blog.subTitle}
                        </p>
                    )}

                    {/* ── Author row ── */}
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        {/* Avatar + name */}
                        <Link href={`/profile/${blog.author?.username}`} className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-border group-hover:ring-foreground/30 transition-all flex-shrink-0">
                                {blog.author?.avatar_url ? (
                                    <img
                                        src={blog.author.avatar_url}
                                        alt={blog.author.full_name || blog.author.username}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-foreground/8 text-foreground text-sm font-semibold">
                                        {authorInitial}
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                                    {blog.author?.full_name || blog.author?.username || 'Anonymous'}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {(blog.author?.followers_count ?? 0).toLocaleString()} followers
                                </p>
                            </div>
                        </Link>

                        {/* Separator */}
                        <div className="hidden sm:block w-px h-7 bg-border/60" />

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <CalendarIcon />
                                <time dateTime={blog.created_at}>{formatDate(blog.created_at)}</time>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <ClockIcon />
                                {readTime} min read
                            </span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="mt-10 h-px bg-border/60" />
                </header>

                {/* ── Body ── */}
                <div className="mt-10">
                    <BlogContent content={blog.contents} />
                </div>

            </div>
        </main>
    );
}