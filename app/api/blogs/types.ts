/**
 * Blog Operations Type Definitions
 * Centralized types for all blog-related API operations
 */

// ============ Blog Stats Types ============
export interface BlogStats {
  id: string;
  blog_id: string;
  created_at: string;
  views: number;
  share_count: number;
  rating: number;
}

export interface BlogStatsUpdatePayload {
  views?: number;
  share_count?: number;
  rating?: number;
}

export interface BlogStatsResponse {
  id: string;
  blog_id: string;
  views: number;
  share_count: number;
  rating: number;
}

// ============ Blog Comments Types ============
export interface BlogComment {
  id: string;
  blog_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  content: string;
  is_deleted: boolean;
  parent_comment_id?: string | null;
  author?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
  };
  likes_count?: number;
  replies_count?: number;
}

export interface CreateCommentPayload {
  blog_id: string;
  content: string;
  parent_comment_id?: string | null;
}

export interface UpdateCommentPayload {
  content: string;
}

export interface BlogCommentsResponse {
  comments: BlogComment[];
  total_count: number;
  page: number;
  limit: number;
}

// ============ Blog Likes Types ============
export interface BlogLike {
  id: string;
  blog_id: string;
  user_id: string;
  created_at: string;
}

export interface BlogLikesStats {
  blog_id: string;
  total_likes: number;
  user_has_liked: boolean;
  recent_likers?: Array<{
    user_id: string;
    username: string;
    avatar_url?: string;
  }>;
}

export interface CommentLike {
  id: string;
  comment_id: string;
  user_id: string;
  created_at: string;
}

// ============ Generic API Response Types ============
export interface ApiSuccessResponse<T> {
  data: T;
  isError: false;
  message?: string;
}

export interface ApiErrorResponse {
  error: string;
  isError: true;
  data?: any;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============ Pagination Types ============
export interface PaginationParams {
  limit: number;
  offset: number;
  page: number;
}
