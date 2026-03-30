"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import type { Blog } from "@/app/api/blogs/route";

type BlogsSearchResponse = {
    data: Blog[];
    isError: boolean;
    error?: string;
};

const cleanContent = (content: string): string => {
    return content
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
        .replace(/\[[^\]]+\]\(([^)]+)\)/g, "$1")
        .replace(/[`#>*_-]/g, "")
        .replace(/\s+/g, " ")
        .trim();
};

const toRelativeDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (days <= 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};

export function MainSearchBox() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const trimmedQuery = query.trim();

        if (trimmedQuery.length < 2) {
            setResults([]);
            setError(null);
            return;
        }

        const controller = new AbortController();
        const timer = window.setTimeout(async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `/api/blogs?q=${encodeURIComponent(trimmedQuery)}&limit=8`,
                    { signal: controller.signal },
                );

                if (!response.ok) {
                    throw new Error("Unable to search blogs right now.");
                }

                const data = (await response.json()) as BlogsSearchResponse;

                if (data.isError) {
                    throw new Error(data.error || "Search failed.");
                }

                setResults(data.data ?? []);
            } catch (err) {
                if (controller.signal.aborted) return;

                const message =
                    err instanceof Error ? err.message : "Unable to search blogs right now.";
                setError(message);
                setResults([]);
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }, 280);

        return () => {
            controller.abort();
            window.clearTimeout(timer);
        };
    }, [query]);

    const showResults = query.trim().length >= 2;

    return (
        <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
            <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search blogs..."
                    className="h-14 w-full rounded-full border border-border bg-background pl-12 pr-12 text-base shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                    aria-label="Search blogs"
                />
                {isLoading && (
                    <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-muted-foreground" />
                )}
            </div>

            {showResults && (
                <div className="mt-4">
                    {error && <p className="px-2 py-1 text-sm text-destructive">{error}</p>}

                    {!error && results.length > 0 && (
                        <ul className="space-y-2">
                            {results.map((blog) => (
                                <li key={blog.id}>
                                    <Link
                                        href={`/blogs/${blog.id}`}
                                        className="group block rounded-xl border border-transparent p-3 transition hover:border-border hover:bg-muted/45"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                                                <img
                                                    src={blog.banner_image || "/placeholder-blog.jpg"}
                                                    alt={blog.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                                                    {blog.title}
                                                </p>
                                                {blog.subTitle && (
                                                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{blog.subTitle}</p>
                                                )}
                                                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground/85">
                                                    {cleanContent(blog.contents).slice(0, 120)}
                                                </p>
                                                <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                                                    <span>{blog.author?.full_name || blog.author?.username || "Anonymous"}</span>
                                                    <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                                                    <span>{toRelativeDate(blog.created_at)}</span>
                                                    {blog.is_premium && (
                                                        <>
                                                            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                                                            <span className="font-medium text-amber-600">Premium</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </section>
    );
}