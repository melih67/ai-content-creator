import { apiService } from './api'
import type { SocialPost, AIGenerationRequest, AIGenerationResponse, ApiResponse, PaginatedResponse, SocialPlatform, PostType } from '@/types'

export interface CreatePostRequest {
  companyId: string
  title: string
  content: string
  platform: SocialPlatform
  status: 'draft' | 'generated' | 'scheduled' | 'published'
  images?: string[]
  hashtags?: string[]
  scheduledAt?: Date
  aiPrompt?: string
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: string
}

export interface PostQueryParams {
  page?: number
  limit?: number
  companyId?: string
  platform?: SocialPlatform
  status?: 'draft' | 'generated' | 'scheduled' | 'published'
  search?: string
  dateFrom?: string
  dateTo?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'scheduledAt' | 'publishedAt'
  sortOrder?: 'asc' | 'desc'
}

export interface BulkPostAction {
  postIds: string[]
  action: 'delete' | 'publish' | 'schedule' | 'archive'
  scheduledAt?: Date
}

export interface PostAnalytics {
  postId: string
  platform: SocialPlatform
  engagement: {
    likes: number
    shares: number
    comments: number
    reach: number
    impressions: number
    clicks: number
  }
  demographics: {
    ageGroups: Record<string, number>
    genders: Record<string, number>
    locations: Record<string, number>
  }
  performance: {
    engagementRate: number
    clickThroughRate: number
    reachRate: number
  }
}

class PostsService {
  async getPosts(params?: PostQueryParams): Promise<PaginatedResponse<SocialPost>> {
    return await apiService.get<SocialPost[]>('/posts', params)
  }

  async getPostById(id: string): Promise<ApiResponse<SocialPost>> {
    return await apiService.get<SocialPost>(`/posts/${id}`)
  }

  async createPost(postData: CreatePostRequest): Promise<ApiResponse<SocialPost>> {
    return await apiService.post<SocialPost>('/posts', postData)
  }

  async updatePost(id: string, postData: Partial<CreatePostRequest>): Promise<ApiResponse<SocialPost>> {
    return await apiService.patch<SocialPost>(`/posts/${id}`, postData)
  }

  async deletePost(id: string): Promise<ApiResponse> {
    return await apiService.delete(`/posts/${id}`)
  }

  async duplicatePost(id: string): Promise<ApiResponse<SocialPost>> {
    return await apiService.post<SocialPost>(`/posts/${id}/duplicate`)
  }

  async bulkAction(action: BulkPostAction): Promise<ApiResponse> {
    return await apiService.post('/posts/bulk', action)
  }

  // AI Generation
  async generateContent(request: AIGenerationRequest): Promise<ApiResponse<AIGenerationResponse>> {
    return await apiService.post<AIGenerationResponse>('/ai/generate', request)
  }

  async regenerateContent(postId: string, request: Partial<AIGenerationRequest>): Promise<ApiResponse<AIGenerationResponse>> {
    return await apiService.post<AIGenerationResponse>(`/posts/${postId}/regenerate`, request)
  }

  async improveContent(postId: string, instructions: string): Promise<ApiResponse<AIGenerationResponse>> {
    return await apiService.post<AIGenerationResponse>(`/posts/${postId}/improve`, { instructions })
  }

  async generateHashtags(content: string, platform: SocialPlatform, count?: number): Promise<ApiResponse<string[]>> {
    return await apiService.post<string[]>('/ai/hashtags', { content, platform, count })
  }

  async generateImages(prompt: string, style?: string, count?: number): Promise<ApiResponse<string[]>> {
    return await apiService.post<string[]>('/ai/images', { prompt, style, count })
  }

  async analyzeContent(content: string): Promise<ApiResponse<{
    sentiment: 'positive' | 'negative' | 'neutral'
    tone: string
    readability: number
    keywords: string[]
    suggestions: string[]
  }>> {
    return await apiService.post('/ai/analyze', { content })
  }

  // Publishing
  async publishPost(id: string, platforms?: SocialPlatform[]): Promise<ApiResponse<{
    results: Record<SocialPlatform, { success: boolean; postId?: string; error?: string }>
  }>> {
    return await apiService.post(`/posts/${id}/publish`, { platforms })
  }

  async schedulePost(id: string, scheduledAt: Date, platforms?: SocialPlatform[]): Promise<ApiResponse> {
    return await apiService.post(`/posts/${id}/schedule`, { scheduledAt, platforms })
  }

  async cancelScheduledPost(id: string): Promise<ApiResponse> {
    return await apiService.post(`/posts/${id}/cancel-schedule`)
  }

  async getPublishingStatus(id: string): Promise<ApiResponse<{
    status: 'pending' | 'publishing' | 'published' | 'failed'
    platforms: Record<SocialPlatform, {
      status: 'pending' | 'publishing' | 'published' | 'failed'
      publishedId?: string
      error?: string
    }>
  }>> {
    return await apiService.get(`/posts/${id}/publishing-status`)
  }

  // Analytics
  async getPostAnalytics(id: string): Promise<ApiResponse<PostAnalytics>> {
    return await apiService.get(`/posts/${id}/analytics`)
  }

  async getPostsAnalytics(params: {
    companyId?: string
    platform?: SocialPlatform
    dateFrom?: string
    dateTo?: string
  }): Promise<ApiResponse<{
    totalPosts: number
    totalEngagement: number
    averageEngagement: number
    topPerformingPosts: SocialPost[]
    platformBreakdown: Record<SocialPlatform, number>
    engagementTrends: { date: string; engagement: number }[]
  }>> {
    return await apiService.get('/posts/analytics', params)
  }

  // Media
  async uploadMedia(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<{
    id: string
    url: string
    filename: string
    size: number
    mimeType: string
  }>> {
    return await apiService.upload('/media/upload', file, onProgress)
  }

  async getMediaLibrary(params?: {
    page?: number
    limit?: number
    type?: 'image' | 'video' | 'gif'
    search?: string
  }): Promise<PaginatedResponse<any>> {
    return await apiService.get('/media', params)
  }

  async deleteMedia(id: string): Promise<ApiResponse> {
    return await apiService.delete(`/media/${id}`)
  }

  // Templates
  async getPostTemplates(params?: {
    platform?: SocialPlatform
    category?: string
    isPublic?: boolean
  }): Promise<ApiResponse<any[]>> {
    return await apiService.get('/templates', params)
  }

  async createTemplate(templateData: {
    name: string
    description: string
    category: string
    platform: SocialPlatform
    template: string
    variables: string[]
    isPublic: boolean
  }): Promise<ApiResponse<any>> {
    return await apiService.post('/templates', templateData)
  }

  async useTemplate(templateId: string, variables: Record<string, string>): Promise<ApiResponse<{
    content: string
    hashtags: string[]
  }>> {
    return await apiService.post(`/templates/${templateId}/use`, { variables })
  }

  // Content Calendar
  async getContentCalendar(params: {
    companyId: string
    month: number
    year: number
    platform?: SocialPlatform
  }): Promise<ApiResponse<{
    posts: (SocialPost & { date: string })[]
    suggestions: { date: string; type: PostType; reason: string }[]
  }>> {
    return await apiService.get('/calendar', params)
  }

  async getContentSuggestions(companyId: string): Promise<ApiResponse<{
    trending: { topic: string; relevance: number }[]
    seasonal: { topic: string; date: string }[]
    industry: { topic: string; category: string }[]
  }>> {
    return await apiService.get(`/content-suggestions/${companyId}`)
  }

  // Export
  async exportPosts(params: {
    companyId?: string
    platform?: SocialPlatform
    dateFrom?: string
    dateTo?: string
    format: 'csv' | 'json' | 'pdf'
  }): Promise<ApiResponse<{ downloadUrl: string }>> {
    return await apiService.post('/posts/export', params)
  }
}

export const postsService = new PostsService()
export default postsService