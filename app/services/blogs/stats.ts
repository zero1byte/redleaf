/**
 * Service to fetch blog statistics
 */

import axios, { AxiosResponse } from "axios";
import type { BlogStatsResponse } from "@/app/api/blogs/types";

export async function getBlogStats(blogId: string) {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${blogId}/stats`
        ) as AxiosResponse<{ data: BlogStatsResponse; isError: boolean; error?: string }>;
        
        const data = response.data;
        return { data: data.data, isError: data.isError, error: data.error };
    } catch (error) {
        return { data: null, isError: true, error: "Failed to fetch blog statistics. Please try again." };
    }
}
