'use client';

import { useState, useEffect } from 'react';
import { getBlogComments, addComment } from '@/app/services/blogs/comments';
import type { BlogComment, BlogCommentsResponse } from '@/app/api/blogs/types';

interface BlogCommentSectionProps {
    blogId: string;
    isLoggedIn: boolean;
    currentUserAvatar?: string;
    currentUsername?: string;
}

export const BlogCommentSection = ({
    blogId,
    isLoggedIn,
    currentUserAvatar,
    currentUsername,
}: BlogCommentSectionProps) => {
    const [comments, setComments] = useState<BlogComment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalComments, setTotalComments] = useState(0);

    // Fetch comments on mount
    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);
            const result = await getBlogComments(blogId, 10, 1, 'recent');
            if (!result.isError && result.data) {
                setComments(result.data.comments);
                setTotalComments(result.data.total_count);
            }
            setIsLoading(false);
        };

        fetchComments();
    }, [blogId]);

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLoggedIn) {
            setError('Please log in to comment');
            return;
        }

        if (!commentText.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        if (isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const result = await addComment(blogId, commentText);
            if (!result.isError && result.data) {
                // Add new comment to list
                setComments([result.data, ...comments]);
                setTotalComments(totalComments + 1);
                setCommentText('');
            } else {
                setError(result.error || 'Failed to post comment');
            }
        } catch (err) {
            setError('Failed to post comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="mt-16 pt-12 border-t border-border/60">
            <h3 className="text-2xl font-bold text-foreground mb-6">Comments ({totalComments})</h3>

            {/* Comment Form */}
            {isLoggedIn ? (
                <form onSubmit={handleAddComment} className="mb-8 p-4 rounded-lg bg-muted/30 border border-border/50">
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="w-full min-h-[100px] p-3 bg-background border border-border/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                    <div className="mt-3 flex items-center justify-between gap-3">
                        <button
                            type="submit"
                            disabled={isSubmitting || !commentText.trim()}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Posting...' : 'Post Comment'}
                        </button>
                    </div>
                    {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
                </form>
            ) : (
                <div className="mb-8 p-4 rounded-lg bg-muted/30 border border-border/50 text-center">
                    <p className="text-muted-foreground">
                        <a href="/auth/login" className="text-primary hover:underline">
                            Log in
                        </a>{' '}
                        to share your thoughts
                    </p>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading comments...</div>
                ) : comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4 p-4 rounded-lg bg-muted/20 border border-border/30">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                {comment.author?.avatar_url ? (
                                    <img
                                        src={comment.author.avatar_url}
                                        alt={comment.author.username}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center text-sm font-semibold text-foreground">
                                        {comment.author?.username?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-semibold text-foreground text-sm">
                                        {comment.author?.full_name || comment.author?.username || 'Anonymous'}
                                    </p>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed break-words">
                                    {comment.content}
                                </p>
                                {/* Reply count */}
                                {comment.replies_count ? (
                                    <p className="text-xs text-primary mt-2 hover:underline cursor-pointer">
                                        {comment.replies_count} {comment.replies_count === 1 ? 'reply' : 'replies'}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No comments yet. Be the first to share your thoughts!</p>
                    </div>
                )}
            </div>
        </section>
    );
};
