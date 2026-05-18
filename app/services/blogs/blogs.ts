import { Blog } from "@/app/api/blogs/route";
import axios, { AxiosResponse } from "axios";

export const getBlogs = async () => {
    //fetch from api/blogs
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs`) as AxiosResponse<{ data: Blog[]; isError: boolean; error?: string }>;
        const data = response.data;
        return { data: data.data, isError: data.isError, error: data.error };
    } catch (error) {
        return { data: error, isError: true, error: "Failed to fetch blogs. Please try again." };
    }
}
export const getBlogById = async (id: string) => {
    //fetch from api/blogs
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs?id=${id}`) as AxiosResponse<{ data: Blog; isError: boolean; error?: string }>;
        const data = response.data;
        return { data: data.data, isError: data.isError, error: data.error };
    } catch (error) {
        return { data: error, isError: true, error: "Failed to fetch blog. Please try again." };
    }
}