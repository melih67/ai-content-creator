export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: 'user' | 'admin'
  subscription: SubscriptionPlan
  createdAt: Date
  lastLoginAt?: Date
  isActive: boolean
}

export interface Company {
  id: string
  userId: string
  name: string
  description: string
  industry: string
  logo?: string
  website?: string
  phone?: string
  address?: string
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
  }
  brandColors: {
    primary: string
    secondary: string
    accent?: string
  }
  brandVoice: 'professional' | 'casual' | 'friendly' | 'authoritative' | 'creative'
  targetAudience?: string
  products?: string
  uniqueSellingPoints?: string
  preferredPlatforms?: string[]
  contentThemes?: string
  createdAt: Date
  updatedAt: Date
}

export interface SocialPost {
  id: string
  companyId: string
  userId: string
  title: string
  content: string
  platform: SocialPlatform
  status: 'draft' | 'generated' | 'scheduled' | 'published'
  images: string[]
  hashtags: string[]
  scheduledAt?: Date
  publishedAt?: Date
  engagement?: {
    likes: number
    shares: number
    comments: number
    reach: number
  }
  aiPrompt: string
  createdAt: Date
  updatedAt: Date
}

export interface PostTemplate {
  id: string
  name: string
  description: string
  category: string
  platform: SocialPlatform
  template: string
  variables: string[]
  isPublic: boolean
  createdBy: string
  usageCount: number
  createdAt: Date
}

export interface AIGenerationRequest {
  companyId: string
  platform: SocialPlatform
  postType: PostType
  topic: string
  tone: 'professional' | 'casual' | 'friendly' | 'authoritative' | 'creative' | 'humorous'
  length: 'short' | 'medium' | 'long'
  includeHashtags: boolean
  includeEmojis: boolean
  customInstructions?: string
  attachments?: File[]
}

export interface AIGenerationResponse {
  content: string
  hashtags: string[]
  suggestedImages?: string[]
  confidence: number
  alternatives: string[]
}

export type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok'

export type PostType =
  | 'announcement'
  | 'promotion'
  | 'educational'
  | 'behind-the-scenes'
  | 'testimonial'
  | 'event'
  | 'product-showcase'
  | 'company-news'
  | 'industry-insight'
  | 'celebration'

export type SubscriptionPlan = 'free' | 'starter' | 'professional' | 'enterprise'

export interface SubscriptionFeatures {
  postsPerMonth: number
  companiesLimit: number
  aiGenerationsPerMonth: number
  advancedAnalytics: boolean
  customTemplates: boolean
  prioritySupport: boolean
  whiteLabel: boolean
}

export interface Analytics {
  totalPosts: number
  totalEngagement: number
  averageEngagement: number
  topPerformingPosts: SocialPost[]
  platformBreakdown: Record<SocialPlatform, number>
  engagementTrends: {
    date: string
    engagement: number
  }[]
  audienceGrowth: {
    date: string
    followers: number
  }[]
}

export interface Notification {
  id: string
  userId: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  isRead: boolean
  actionUrl?: string
  createdAt: Date
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface FileUpload {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  uploadedAt: Date
}

export interface Theme {
  name: string
  isDark: boolean
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
  }
}

export interface CreateCompanyRequest {
  name: string
  description?: string
  industry?: string
  logo?: string
  website?: string
  phone?: string
  address?: string
  socialMedia?: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
  }
  brandColors?: {
    primary: string
    secondary: string
    accent?: string
  }
  brandVoice?: 'professional' | 'casual' | 'friendly' | 'authoritative' | 'creative'
  targetAudience?: string
  products?: string
  uniqueSellingPoints?: string
  preferredPlatforms?: string[]
  contentThemes?: string
  brandGuidelines?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}