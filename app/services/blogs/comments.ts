/**
 * Service to manage blog comments
 */

import axios, { AxiosResponse } from "axios";
import type { BlogCommentsResponse, CreateCommentPayload } from "@/app/api/blogs/types";

export async function getBlogComments(
    blogId: string,
    limit = 10,
    page = 1,
    sort = 'recent'
) {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${blogId}/comments?limit=${limit}&page=${page}&sort=${sort}`
        ) as AxiosResponse<{ data: BlogCommentsResponse; isError: boolean; error?: string }>;
        
        const data = response.data;
        return { data: data.data, isError: data.isError, error: data.error };
    } catch (error) {
        return { data: null, isError: true, error: "Failed to fetch comments. Please try again." };
    }
}

export async function addComment(blogId: string, content: string, parentCommentId?: string) {
    try {
        const payload: CreateCommentPayload = {
            blog_id: blogId,
            content,
            parent_comment_id: parentCommentId || null,
        };

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${blogId}/comments`,
            payload
        ) as AxiosResponse<{ data: any; isError: boolean; error?: string }>;
        
        const data = response.data;
        return { data: data.data, isError: data.isError, error: data.error };
    } catch (error: any) {
        const statusCode = error.response?.status;
        if (statusCode === 401) {
            return { data: null, isError: true, error: "Please log in to comment" };
        }
        if (statusCode === 400) {
            return { data: null, isError: true, error: "Comment content is required" };
        }
        return { data: null, isError: true, error: "Failed to add comment. Please try again." };
    }
}

export async function updateComment(blogId: string, commentId: string, content: string) {
    try {
        const response = await axios.patch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${blogId}/comments/${commentId}`,
            { content }
        ) as AxiosResponse<{ data: any; isError: boolean; error?: string }>;
        
        const data = response.data;
        return { data: data.data, isError: data.isError, error: data.error };
    } catch (error: any) {
        const statusCode = error.response?.status;
        if (statusCode === 401) {
            return { data: null, isError: true, error: "Please log in to edit comments" };
        }
        if (statusCode === 403) {
            return { data: null, isError: true, error: "You can only edit your own comments" };
        }
        return { data: null, isError: true, error: "Failed to update comment. Please try again." };
    }
}

export async function deleteComment(blogId: string, commentId: string) {
    try {
        const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${blogId}/comments/${commentId}`
        ) as AxiosResponse<{ data: any; isError: boolean; error?: string }>;
        
        const data = response.data;
        return { data: data.data, isError: data.isError, error: data.error };
    } catch (error: any) {
        const statusCode = error.response?.status;
        if (statusCode === 401) {
            return { data: null, isError: true, error: "Please log in to delete comments" };
        }
        if (statusCode === 403) {
            return { data: null, isError: true, error: "You can only delete your own comments" };
        }
        return { data: null, isError: true, error: "Failed to delete comment. Please try again." };
    }
}
