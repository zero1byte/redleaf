/**
 * Service to manage blog likes
 */

import axios, { AxiosResponse } from "axios";
import type { BlogLikesStats } from "@/app/api/blogs/types";

export async function getBlogLikes(blogId: string) {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${blogId}/likes`
        ) as AxiosResponse<{ data: BlogLikesStats; isError: boolean; error?: string }>;
        
        const data = response.data;
        return { data: data.data, isError: data.isError, error: data.error };
    } catch (error) {
        return { data: null, isError: true, error: "Failed to fetch blog likes. Please try again." };
    }
}

export async function likeBlog(blogId: string) {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${blogId}/likes`,
            {}
        ) as AxiosResponse<{ data: BlogLikesStats; isError: boolean; error?: string }>;
        
        const data = response.data;
        return { data: data.data, isError: data.isError, error: data.error };
    } catch (error: any) {
        // 409 = already liked, 401 = not authenticated
        const statusCode = error.response?.status;
        if (statusCode === 409) {
            return { data: null, isError: true, error: "Already liked this blog" };
        }
        if (statusCode === 401) {
            return { data: null, isError: true, error: "Please log in to like blogs" };
        }
        return { data: null, isError: true, error: "Failed to like blog. Please try again." };
    }
}

export async function unlikeBlog(blogId: string) {
    try {
        const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${blogId}/likes`
        ) as AxiosResponse<{ data: BlogLikesStats; isError: boolean; error?: string }>;
        
        const data = response.data;
        return { data: data.data, isError: data.isError, error: data.error };
    } catch (error: any) {
        const statusCode = error.response?.status;
        if (statusCode === 401) {
            return { data: null, isError: true, error: "Please log in to unlike blogs" };
        }
        return { data: null, isError: true, error: "Failed to unlike blog. Please try again." };
    }
}
