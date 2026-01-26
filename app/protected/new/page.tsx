"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Blog } from "@/app/api/blogs/route";
import axios, { AxiosResponse } from "axios";

export default function NewBlogPage() {
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const blog = {
            title,
            subTitle: subtitle,
            contents: content,
            is_premium: false,
        };

        ///submit to API
        try {
            const response = await axios.post('/api/blogs', blog) as AxiosResponse<{ data: Blog; isError: boolean; error?: string }>;
            window.location.href = `/blogs/${response.data.data.id}`;
        } catch (error) {
            console.error('Error creating blog:', error);
            setError("Failed to create blog. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

    return (
        <div className="min-h-screen bg-background py-0 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="mb-80">
                    {/* Title */}
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full bg-transparent text-4xl sm:text-5xl font-bold placeholder:text-muted-foreground/40 focus:outline-none mb-4"
                    />

                    {/* Subtitle */}
                    <input
                        type="text"
                        placeholder="Add a subtitle..."
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className="w-full bg-transparent text-xl sm:text-2xl text-muted-foreground placeholder:text-muted-foreground/40 focus:outline-none mb-8"
                    />

                    {/* Content */}
                    <textarea
                        placeholder="Tell your story..."
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            // Auto-resize textarea
                            e.target.style.height = "auto";
                            e.target.style.height = e.target.scrollHeight + "px";
                        }}
                        required
                        className="w-full bg-transparent text-lg sm:text-xl leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none resize-none overflow-hidden min-h-[60vh]"
                    />

                    {/* Bottom Bar */}
                    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm py-4 px-4 sm:px-6">
                        <div className="max-w-3xl mx-auto flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                {wordCount} {wordCount === 1 ? "word" : "words"}
                            </span>
                            <div className="flex items-center gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        // TODO: Save as draft
                                        console.log("Save as draft");
                                    }}
                                >
                                    Save draft
                                </Button>
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={isSubmitting || !title || !content}
                                    className="rounded-full px-6"
                                >
                                    {isSubmitting ? "Publishing..." : "Publish"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
