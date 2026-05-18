/**
 * Service to manage blog views
 */

import axios, { AxiosResponse } from "axios";
import type { BlogStatsResponse } from "@/app/api/blogs/types";

export async function incrementBlogViews(blogId: string) {
    try {
        const response = await axios.patch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${blogId}/stats`,
            { increment_views: 1 }
        ) as AxiosResponse<{ data: BlogStatsResponse; isError: boolean; error?: string }>;
        
        const data = response.data;
        return { data: data.data, isError: data.isError, error: data.error };
    } catch (error) {
        // Silently fail - don't show error to user for view tracking
        return { data: null, isError: true, error: "Failed to increment views" };
    }
}
