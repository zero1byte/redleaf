'use client';

import { useState, useEffect } from 'react';
import { likeBlog, unlikeBlog, getBlogLikes } from '@/app/services/blogs/likes';
import type { BlogLikesStats } from '@/app/api/blogs/types';

interface BlogLikeButtonProps {
    blogId: string;
    isLoggedIn: boolean;
}

export const BlogLikeButton = ({ blogId, isLoggedIn }: BlogLikeButtonProps) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch initial like status
    useEffect(() => {
        const fetchLikes = async () => {
            const result = await getBlogLikes(blogId);
            if (!result.isError && result.data) {
                setIsLiked(result.data.user_has_liked);
                setLikesCount(result.data.total_likes);
            }
        };

        fetchLikes();
    }, [blogId]);

    const handleLikeToggle = async () => {
        if (!isLoggedIn) {
            setError('Please log in to like posts');
            return;
        }

        if (isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            let result;
            if (isLiked) {
                result = await unlikeBlog(blogId);
            } else {
                result = await likeBlog(blogId);
            }

            if (!result.isError && result.data) {
                setIsLiked(!isLiked);
                setLikesCount(result.data.total_likes);
            } else {
                setError(result.error || 'Failed to update like');
            }
        } catch (err) {
            setError('Failed to update like');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={handleLikeToggle}
                disabled={isLoading || !isLoggedIn}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isLiked
                        ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/50'
                        : 'bg-muted hover:bg-muted/80 text-foreground border border-border/50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                <svg
                    className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}
                    fill={isLiked ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                </svg>
                <span className="text-sm font-medium">{likesCount}</span>
            </button>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
};
