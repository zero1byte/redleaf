/**
 * Utility to convert markdown-like formatting to HTML
 * Used for displaying blog content with proper formatting
 */

export interface FormattedContent {
    type: 'text' | 'bold' | 'italic' | 'underline' | 'link' | 'code' | 'heading' | 'quote' | 'list';
    content: string;
    level?: number; // For headings
    href?: string; // For links
    ordered?: boolean; // For lists
}

/**
 * Parse markdown formatting into structured content
 * Supports:
 * - **bold** text
 * - *italic* text
 * - __underline__ text
 * - [link text](url)
 * - `code` text
 * - # Heading 1, ## Heading 2, etc.
 * - > Quote
 * - - Bullet list
 * - 1. Numbered list
 */
export function parseMarkdownFormatting(text: string): FormattedContent[] {
    if (!text) return [];

    const result: FormattedContent[] = [];
    let remaining = text;
    let index = 0;

    while (remaining.length > 0) {
        // Check for bold
        const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
        if (boldMatch) {
            result.push({ type: 'bold', content: boldMatch[1] });
            remaining = remaining.slice(boldMatch[0].length);
            continue;
        }

        // Check for italic
        const italicMatch = remaining.match(/^\*(.+?)\*/);
        if (italicMatch) {
            result.push({ type: 'italic', content: italicMatch[1] });
            remaining = remaining.slice(italicMatch[0].length);
            continue;
        }

        // Check for underline
        const underlineMatch = remaining.match(/^__(.+?)__/);
        if (underlineMatch) {
            result.push({ type: 'underline', content: underlineMatch[1] });
            remaining = remaining.slice(underlineMatch[0].length);
            continue;
        }

        // Check for link
        const linkMatch = remaining.match(/^\[(.+?)\]\((.+?)\)/);
        if (linkMatch) {
            result.push({
                type: 'link',
                content: linkMatch[1],
                href: linkMatch[2]
            });
            remaining = remaining.slice(linkMatch[0].length);
            continue;
        }

        // Check for inline code
        const codeMatch = remaining.match(/^`(.+?)`/);
        if (codeMatch) {
            result.push({ type: 'code', content: codeMatch[1] });
            remaining = remaining.slice(codeMatch[0].length);
            continue;
        }

        // Regular text - consume until next formatting
        const nextMatch = remaining.match(/[\*_\[`]/);
        if (nextMatch) {
            const textContent = remaining.slice(0, nextMatch.index);
            if (textContent) {
                result.push({ type: 'text', content: textContent });
            }
            remaining = remaining.slice(nextMatch.index);
        } else {
            result.push({ type: 'text', content: remaining });
            remaining = '';
        }
    }

    return result;
}

/**
 * Convert markdown content to HTML string
 */
export function markdownToHtml(content: string): string {
    if (!content) return '';

    let html = content;

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Underline
    html = html.replace(/__(.+?)__/g, '<u>$1</u>');

    // Link
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>');

    // Inline code
    html = html.replace(/`(.+?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

    return html;
}

/**
 * Parse block-level markdown (headings, lists, quotes, etc.)
 */
export function parseBlockMarkdown(content: string): { type: string; content: string; level?: number; ordered?: boolean }[] {
    const lines = content.split('\n\n');
    const blocks = [];

    for (const line of lines) {
        // Heading
        const headingMatch = line.match(/^(#{1,6})\s+(.+)$/m);
        if (headingMatch) {
            blocks.push({
                type: 'heading',
                level: headingMatch[1].length,
                content: headingMatch[2]
            });
            continue;
        }

        // Quote
        if (line.startsWith('> ')) {
            blocks.push({
                type: 'quote',
                content: line.replace(/^> /gm, '')
            });
            continue;
        }

        // Ordered list
        if (line.match(/^\d+\.\s/)) {
            blocks.push({
                type: 'list',
                ordered: true,
                content: line
            });
            continue;
        }

        // Unordered list
        if (line.match(/^[-•*]\s/)) {
            blocks.push({
                type: 'list',
                ordered: false,
                content: line
            });
            continue;
        }

        // Regular paragraph
        blocks.push({
            type: 'paragraph',
            content: line
        });
    }

    return blocks;
}

/**
 * Complete blog content renderer
 * Converts entire blog markdown to displayable format
 */
export function renderBlogContent(content: string): string {
    if (!content) return '';

    const blocks = parseBlockMarkdown(content);
    let html = '';

    for (const block of blocks) {
        const inlineHtml = markdownToHtml(block.content);

        switch (block.type) {
            case 'heading':
                const tag = `h${block.level || 2}`;
                html += `<${tag} class="text-${block.level === 1 ? '3xl' : block.level === 2 ? '2xl' : 'xl'} font-bold my-4">${inlineHtml}</${tag}>`;
                break;

            case 'quote':
                html += `<blockquote class="border-l-4 border-primary/30 pl-4 my-4 italic text-muted-foreground">${inlineHtml}</blockquote>`;
                break;

            case 'list':
                if (block.ordered) {
                    html += `<ol class="list-decimal list-inside my-2 space-y-1"><li>${inlineHtml}</li></ol>`;
                } else {
                    html += `<ul class="list-disc list-inside my-2 space-y-1"><li>${inlineHtml}</li></ul>`;
                }
                break;

            case 'paragraph':
            default:
                html += `<p class="my-4 leading-relaxed">${inlineHtml}</p>`;
        }
    }

    return html;
}

/**
 * Extract plain text from markdown content (for previews, etc.)
 */
export function extractPlainText(content: string, maxLength: number = 150): string {
    if (!content) return '';

    // Remove markdown formatting
    let plain = content
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/__(.+?)__/g, '$1')
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')
        .replace(/`(.+?)`/g, '$1')
        .replace(/^#+\s/gm, '')
        .replace(/^>\s/gm, '')
        .replace(/^[-•*]\s/gm, '')
        .replace(/\n\n/g, ' ')
        .trim();

    if (plain.length > maxLength) {
        return plain.substring(0, maxLength) + '...';
    }

    return plain;
}
